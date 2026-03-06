#!/usr/bin/env node
import path from 'node:path';
import { parseArgs, fail } from './lib/cli.mjs';
import { readText, writeText } from './lib/fs.mjs';
import { fromYaml, toYaml } from './lib/yaml.mjs';

const DONE_STATUSES = new Set(['done', 'completed', 'closed', 'resolved']);
const BLOCKING_STATUSES = new Set(['blocked']);

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

function isBlocked(taskId, statusMap) {
  const item = statusMap.get(taskId);
  return item ? BLOCKING_STATUSES.has(String(item.status || '').toLowerCase()) : false;
}

function hasHumanGate(taskId, statusMap) {
  const item = statusMap.get(taskId);
  return item ? Boolean(item.human_gate_required) : false;
}

function evaluateIssue(issue, statusMap) {
  const reasons = [];

  if (issue.execution_mode !== 'executable') {
    reasons.push('execution_mode_not_executable');
  }
  if (!issue.workspace_launchable) {
    reasons.push('workspace_not_launchable');
  }
  if (!issue.doc_inputs || issue.doc_inputs.length === 0) {
    reasons.push('missing_doc_inputs');
  }
  if (!issue.acceptance_criteria || issue.acceptance_criteria.length === 0) {
    reasons.push('missing_acceptance_criteria');
  }
  if (!issue.repo_scope) {
    reasons.push('missing_repo_scope');
  }
  if (hasHumanGate(issue.task_id, statusMap)) {
    reasons.push('human_gate_required');
  }
  for (const dep of issue.depends_on_task_ids || []) {
    if (!isDone(dep, statusMap)) {
      reasons.push(`dependency_not_done:${dep}`);
    }
  }
  for (const blockedBy of issue.blocked_by_task_ids || []) {
    if (!isDone(blockedBy, statusMap)) {
      reasons.push(`blocked_by_unresolved:${blockedBy}`);
    }
  }
  if (isDone(issue.task_id, statusMap)) {
    reasons.push('already_done');
  }
  if (isBlocked(issue.task_id, statusMap)) {
    reasons.push('task_blocked');
  }

  return {
    task_id: issue.task_id,
    title: issue.title,
    ready: reasons.length === 0,
    reasons,
    execution_mode: issue.execution_mode,
    workspace_launchable: issue.workspace_launchable,
    parent_task_id: issue.parent_task_id,
    repo_scope: issue.repo_scope
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const batchPath = args.batch;
  const statusPath = args.status || args.snapshot;
  const outputPath = args.output || path.join('.meta', 'ready-task-selection.yaml');
  const callbackPolicy = args['callback-policy'] || 'unlock-next-on-done';

  if (!batchPath || !statusPath) {
    fail('INPUT_ERROR', '缺少必要参数', {
      required: ['--batch', '--status'],
      example: 'node scripts/select-ready-task.mjs --batch .meta/vibekanban-issue-batch.yaml --status .meta/task-status-snapshot.yaml --output .meta/ready-task-selection.yaml'
    });
  }

  const [batchText, statusText] = await Promise.all([
    readText(batchPath),
    readText(statusPath)
  ]).catch((error) => fail('INPUT_ERROR', '读取输入文件失败', { message: error.message }));

  const batch = fromYaml(batchText);
  const snapshot = fromYaml(statusText);

  if (!batch || !Array.isArray(batch.issues)) {
    fail('VALIDATION_ERROR', 'batch 文件格式不合法', { file: batchPath });
  }
  if (!snapshot || !Array.isArray(snapshot.statuses)) {
    fail('VALIDATION_ERROR', 'status snapshot 文件格式不合法', { file: statusPath });
  }

  const statusMap = indexStatuses(snapshot);
  const evaluations = batch.issues.map((issue) => evaluateIssue(issue, statusMap));
  const readyTasks = evaluations.filter((item) => item.ready);

  const result = {
    project_id: batch.project_id || snapshot.project_id || '',
    callback_policy: callbackPolicy,
    selected_at: new Date().toISOString(),
    ready_tasks: readyTasks,
    ready_count: readyTasks.length,
    auto_start_candidate: callbackPolicy === 'start-next-on-done' && readyTasks.length === 1 ? readyTasks[0].task_id : '',
    excluded_tasks: evaluations.filter((item) => !item.ready)
  };

  await writeText(outputPath, toYaml(result)).catch((error) => fail('WRITE_ERROR', '写入输出文件失败', { message: error.message, output: outputPath }));

  console.log(JSON.stringify({ success: true, output: outputPath, ready_count: readyTasks.length, auto_start_candidate: result.auto_start_candidate }, null, 2));
}

await main();
