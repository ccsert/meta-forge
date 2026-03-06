#!/usr/bin/env node
import path from 'node:path';
import { parseArgs, fail } from './lib/cli.mjs';
import { readText, writeText } from './lib/fs.mjs';
import { fromYaml } from './lib/yaml.mjs';

function stringifyList(items, wrapper = '`') {
  if (!items || items.length === 0) return '[]';
  return `[${items.map((item) => `${wrapper}${item}${wrapper}`).join(', ')}]`;
}

function buildDocInputs(docInputs) {
  const items = (docInputs && docInputs.length > 0) ? docInputs : ['(none)', '(none)'];
  return {
    doc_input_1: items[0] || '(none)',
    doc_input_2: items[1] || '(none)'
  };
}

function buildAcceptance(issue) {
  const items = (issue.acceptance_criteria && issue.acceptance_criteria.length > 0) ? issue.acceptance_criteria : ['(todo)', '(todo)'];
  return {
    acceptance_1: items[0] || '(todo)',
    acceptance_2: items[1] || '(todo)'
  };
}

function renderTemplate(template, variables) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    if (!(key in variables)) {
      fail('RENDER_ERROR', '模板变量缺失', { variable: key });
    }
    return String(variables[key]);
  });
}

function findIssue(batch, taskId) {
  const issue = batch.issues?.find((entry) => entry.task_id === taskId);
  if (!issue) {
    fail('VALIDATION_ERROR', 'batch 中找不到指定 task_id', { task_id: taskId });
  }
  return issue;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const batchPath = args.batch;
  const taskId = args['task-id'];
  const templatePath = args.template || path.join('templates', 'vibekanban-issue-description.md');
  const outputPath = args.output || path.join('.meta', 'descriptions', `${taskId}.md`);
  const issueId = args['issue-id'] || '{{issue_id}}';
  const executor = args.executor || 'CODEX';
  const workspaceScope = args['workspace-scope'] || 'single-workspace';
  const goal = args.goal || 'See acceptance criteria and referenced docs.';
  const executionNotes = args['execution-notes'] || 'Follow project docs and standards before making changes.';

  if (!batchPath || !taskId) {
    fail('INPUT_ERROR', '缺少必要参数', {
      required: ['--batch', '--task-id'],
      example: 'node scripts/render-issue-description.mjs --batch .meta/vibekanban-issue-batch.yaml --task-id TASK-001 --output .meta/descriptions/TASK-001.md'
    });
  }

  const [batchText, templateText] = await Promise.all([
    readText(batchPath),
    readText(templatePath)
  ]).catch((error) => fail('INPUT_ERROR', '读取输入文件失败', { message: error.message }));

  const batch = fromYaml(batchText);
  if (!batch || !Array.isArray(batch.issues)) {
    fail('VALIDATION_ERROR', 'batch 文件格式不合法', { file: batchPath });
  }

  const issue = findIssue(batch, taskId);

  const variables = {
    title: issue.title || issue.task_id,
    task_id: issue.task_id,
    project_id: batch.project_id || '',
    issue_id: issueId,
    parent_id: issue.parent_task_id || '',
    execution_mode: issue.execution_mode || 'non-executable',
    workspace_launchable: String(issue.workspace_launchable ?? false),
    execution_reason: issue.execution_reason || '',
    workspace_scope: workspaceScope,
    executor,
    depends_on: stringifyList(issue.depends_on_task_ids || []),
    blocked_by: stringifyList(issue.blocked_by_task_ids || []),
    related_tasks: stringifyList(issue.related_task_ids || []),
    downstream_candidates: stringifyList(issue.downstream_candidates || []),
    spawned_from: issue.spawned_from_task_id || '',
    repo_id: batch.repo_id || '',
    repo_scope: issue.repo_scope || '',
    base_branch: batch.base_branch || 'main',
    goal,
    execution_notes: executionNotes,
    ...buildDocInputs(issue.doc_inputs || []),
    ...buildAcceptance(issue)
  };

  const rendered = renderTemplate(templateText, variables);
  await writeText(outputPath, rendered).catch((error) => fail('WRITE_ERROR', '写入输出文件失败', { message: error.message, output: outputPath }));

  console.log(JSON.stringify({ success: true, output: outputPath, task_id: taskId }, null, 2));
}

await main();
