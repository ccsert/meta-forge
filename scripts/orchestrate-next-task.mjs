#!/usr/bin/env node
import path from 'node:path';
import { parseArgs, fail } from './lib/cli.mjs';
import { readText, writeText } from './lib/fs.mjs';
import { fromYaml, toYaml } from './lib/yaml.mjs';

/*
 * orchestrate-next-task.mjs
 *
 * 读取刚完成任务的 session-result，结合 issue-batch 和状态快照，
 * 按 callback-policy 决定下一步动作：
 *   - manual-next: 仅输出推荐，不自动启动
 *   - unlock-next-on-done: 解锁下游任务（默认）
 *   - start-next-on-done: 若仅有 1 个 ready task 则标记 auto_start
 *
 * 用法:
 *   node scripts/orchestrate-next-task.mjs \
 *     --result .meta/session-result.yaml \
 *     --batch .meta/vibekanban-issue-batch.yaml \
 *     --status .meta/task-status-snapshot.yaml \
 *     [--callback-policy unlock-next-on-done] \
 *     [--output .meta/orchestration-decision.yaml]
 */

const DONE_STATUSES = new Set(['done', 'completed', 'closed', 'resolved']);

function indexStatuses(snapshot) {
  const map = new Map();
  for (const item of snapshot.statuses || []) {
    map.set(item.task_id, item);
  }
  return map;
}

function isDone(taskId, statusMap) {
  const item = statusMap.get(taskId);
  return item ? DONE_STATUSES.has(String(item.status || '').toLowerCase()) : false;
}

function findDownstreamTasks(completedTaskId, issues) {
  return issues.filter((issue) => {
    const deps = issue.depends_on_task_ids || [];
    return deps.includes(completedTaskId);
  });
}

function evaluateReadiness(issue, statusMap) {
  const reasons = [];

  if (issue.execution_mode !== 'executable') reasons.push('not_executable');
  if (!issue.workspace_launchable) reasons.push('not_launchable');

  for (const dep of issue.depends_on_task_ids || []) {
    if (!isDone(dep, statusMap)) reasons.push(`dep_not_done:${dep}`);
  }
  for (const blocker of issue.blocked_by_task_ids || []) {
    if (!isDone(blocker, statusMap)) reasons.push(`blocked_by:${blocker}`);
  }
  if (isDone(issue.task_id, statusMap)) reasons.push('already_done');

  return {
    task_id: issue.task_id,
    title: issue.title,
    ready: reasons.length === 0,
    reasons
  };
}

function determineAction(resultStatus, callbackPolicy) {
  // 如果任务未完成，不触发后续编排
  if (resultStatus !== 'completed' && resultStatus !== 'done') {
    return {
      action: 'hold',
      reason: `任务状态为 ${resultStatus}，不触发下游解锁`
    };
  }

  switch (callbackPolicy) {
    case 'manual-next':
      return { action: 'recommend', reason: '回调策略为 manual-next，仅输出推荐' };
    case 'start-next-on-done':
      return { action: 'auto-start', reason: '回调策略为 start-next-on-done，若仅 1 个 ready task 则自动启动' };
    case 'unlock-next-on-done':
    default:
      return { action: 'unlock', reason: '回调策略为 unlock-next-on-done，解锁下游任务' };
  }
}

function buildFollowupIssues(sessionResult) {
  const actions = sessionResult.followup_actions || [];
  return actions
    .filter((a) => typeof a === 'string')
    .map((action) => ({
      type: 'followup',
      description: action,
      spawned_from: sessionResult.task_id || ''
    }));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const resultPath = args.result;
  const batchPath = args.batch;
  const statusPath = args.status || args.snapshot;
  const callbackPolicy = args['callback-policy'] || 'unlock-next-on-done';
  const outputPath = args.output || path.join('.meta', 'orchestration-decision.yaml');

  if (!resultPath || !batchPath || !statusPath) {
    fail('INPUT_ERROR', '缺少必要参数', {
      required: ['--result', '--batch', '--status'],
      example: 'node scripts/orchestrate-next-task.mjs --result .meta/session-result.yaml --batch .meta/vibekanban-issue-batch.yaml --status .meta/task-status-snapshot.yaml'
    });
  }

  const [resultText, batchText, statusText] = await Promise.all([
    readText(resultPath),
    readText(batchPath),
    readText(statusPath)
  ]).catch((error) => fail('INPUT_ERROR', '读取输入文件失败', { message: error.message }));

  const sessionResult = fromYaml(resultText);
  const batch = fromYaml(batchText);
  const snapshot = fromYaml(statusText);

  if (!sessionResult || !sessionResult.result_status) {
    fail('VALIDATION_ERROR', 'session-result 缺少 result_status', { file: resultPath });
  }
  if (!batch || !Array.isArray(batch.issues)) {
    fail('VALIDATION_ERROR', 'batch 文件格式不合法', { file: batchPath });
  }
  if (!snapshot || !Array.isArray(snapshot.statuses)) {
    fail('VALIDATION_ERROR', 'status snapshot 文件格式不合法', { file: statusPath });
  }

  const completedTaskId = sessionResult.task_id || '';
  const resultStatus = String(sessionResult.result_status).toLowerCase();
  const statusMap = indexStatuses(snapshot);

  // 将刚完成的任务标记为 done（在内存中）
  if (resultStatus === 'completed' || resultStatus === 'done') {
    statusMap.set(completedTaskId, {
      task_id: completedTaskId,
      status: 'done',
      human_gate_required: false
    });
  }

  // 寻找下游任务
  const downstream = findDownstreamTasks(completedTaskId, batch.issues);

  // 评估所有未完成任务的就绪状态
  const allEvaluations = batch.issues
    .filter((issue) => !isDone(issue.task_id, statusMap))
    .map((issue) => evaluateReadiness(issue, statusMap));

  const readyTasks = allEvaluations.filter((e) => e.ready);
  const newlyUnlocked = downstream
    .map((d) => evaluateReadiness(d, statusMap))
    .filter((e) => e.ready);

  // 决定动作
  const actionDecision = determineAction(resultStatus, callbackPolicy);

  // 收集 followup
  const followups = buildFollowupIssues(sessionResult);

  // 确定 auto_start_candidate
  let autoStartCandidate = '';
  if (actionDecision.action === 'auto-start' && readyTasks.length === 1) {
    autoStartCandidate = readyTasks[0].task_id;
  }

  const decision = {
    project_id: batch.project_id || sessionResult.project_id || '',
    completed_task_id: completedTaskId,
    completed_result_status: resultStatus,
    callback_policy: callbackPolicy,
    decided_at: new Date().toISOString(),
    action: actionDecision.action,
    action_reason: actionDecision.reason,

    newly_unlocked: newlyUnlocked,
    newly_unlocked_count: newlyUnlocked.length,

    all_ready_tasks: readyTasks,
    all_ready_count: readyTasks.length,

    auto_start_candidate: autoStartCandidate,

    followup_issues: followups,
    followup_count: followups.length,

    human_gate_required: sessionResult.human_gate_required || false,
    human_gate_reason: sessionResult.human_gate_reason || '',

    merge_readiness: sessionResult.merge_readiness || '',
    recommended_action: sessionResult.recommended_action || '',

    summary: buildSummary(actionDecision, completedTaskId, newlyUnlocked, readyTasks, autoStartCandidate, followups)
  };

  await writeText(outputPath, toYaml(decision)).catch((error) =>
    fail('WRITE_ERROR', '写入输出文件失败', { message: error.message, output: outputPath })
  );

  console.log(JSON.stringify({
    success: true,
    output: outputPath,
    action: decision.action,
    newly_unlocked_count: decision.newly_unlocked_count,
    all_ready_count: decision.all_ready_count,
    auto_start_candidate: decision.auto_start_candidate,
    summary: decision.summary
  }, null, 2));
}

function buildSummary(action, completedId, unlocked, ready, autoStart, followups) {
  const parts = [`任务 ${completedId} 已完成。`];

  if (unlocked.length > 0) {
    parts.push(`新解锁 ${unlocked.length} 个下游任务: ${unlocked.map((u) => u.task_id).join(', ')}。`);
  } else {
    parts.push('无新解锁的下游任务。');
  }

  parts.push(`当前共 ${ready.length} 个 ready task。`);

  if (autoStart) {
    parts.push(`自动启动候选: ${autoStart}。`);
  }

  if (followups.length > 0) {
    parts.push(`有 ${followups.length} 个 followup 待创建。`);
  }

  if (action.action === 'hold') {
    parts.push(`⚠️ ${action.reason}`);
  }

  return parts.join(' ');
}

await main();
