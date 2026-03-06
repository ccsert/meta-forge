#!/usr/bin/env node
import path from 'node:path';
import { parseArgs, fail } from './lib/cli.mjs';
import { readText, writeText } from './lib/fs.mjs';
import { toYaml } from './lib/yaml.mjs';

function parseManifest(text) {
  const projectId = text.match(/^\s*id:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
  const repoId = text.match(/^\s*repo_id:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
  const baseBranch = text.match(/^\s*default_branch:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');

  if (!projectId) {
    fail('VALIDATION_ERROR', 'manifest 缺少 project.id', { file: 'manifest' });
  }

  return {
    projectId,
    repoId: repoId || '',
    baseBranch: baseBranch || 'main'
  };
}

function parseList(lines, startIndex) {
  const items = [];
  let index = startIndex;
  while (index < lines.length) {
    const line = lines[index];
    if (!/^\s{2}- /.test(line)) break;
    items.push(line.replace(/^\s{2}- /, '').trim().replace(/^`|`$/g, '').replace(/^"|"$/g, ''));
    index += 1;
  }
  return { items, nextIndex: index };
}

function parseTaskBreakdown(text) {
  const lines = text.split(/\r?\n/);
  const tasks = [];
  let current = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^###\s+(Epic|Feature|Story|Task):\s+`([^`]+)`/);
    if (heading) {
      if (current) tasks.push(current);
      current = {
        task_type: heading[1].toLowerCase(),
        section_id: heading[2],
        task_id: heading[2],
        title: '',
        execution_mode: heading[1] === 'Task' ? 'executable' : 'non-executable',
        workspace_launchable: heading[1] === 'Task',
        execution_reason: heading[1] === 'Task' ? 'single-workspace implementation task' : `${heading[1].toLowerCase()} container only`,
        parent_task_id: '',
        depends_on_task_ids: [],
        blocked_by_task_ids: [],
        related_task_ids: [],
        downstream_candidates: [],
        spawned_from_task_id: '',
        repo_scope: '',
        doc_inputs: [],
        acceptance_criteria: []
      };
      continue;
    }

    if (!current) continue;

    const simpleField = [
      ['Parent', 'parent_task_id'],
      ['Task ID', 'task_id'],
      ['Title', 'title'],
      ['Execution Mode', 'execution_mode'],
      ['Workspace Launchable', 'workspace_launchable'],
      ['Execution Reason', 'execution_reason'],
      ['Repo Scope', 'repo_scope'],
      ['Spawned From', 'spawned_from_task_id']
    ];

    let matched = false;
    for (const [label, key] of simpleField) {
      const fieldMatch = line.match(new RegExp(`^- ${label}:\\s*(.*)$`));
      if (fieldMatch) {
        let value = fieldMatch[1].trim();
        value = value.replace(/^`|`$/g, '').replace(/^"|"$/g, '');
        if (key === 'workspace_launchable') {
          current[key] = value === 'true';
        } else {
          current[key] = value;
        }
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const listFields = [
      ['Depends On', 'depends_on_task_ids'],
      ['Blocked By', 'blocked_by_task_ids'],
      ['Downstream Candidates', 'downstream_candidates'],
      ['Related To', 'related_task_ids'],
      ['Inputs', 'doc_inputs'],
      ['Acceptance Criteria', 'acceptance_criteria']
    ];

    for (const [label, key] of listFields) {
      if (line.startsWith(`- ${label}:`)) {
        const { items, nextIndex } = parseList(lines, index + 1);
        current[key] = items;
        index = nextIndex - 1;
        matched = true;
        break;
      }
    }
  }

  if (current) tasks.push(current);
  return tasks;
}

function validateTask(task) {
  const missing = [];
  if (!task.task_id) missing.push('Task ID');
  if (!task.execution_mode) missing.push('Execution Mode');
  if (typeof task.workspace_launchable !== 'boolean') missing.push('Workspace Launchable');
  if (!task.execution_reason) missing.push('Execution Reason');
  if (!task.title && task.task_type === 'task') missing.push('Title');
  if (task.workspace_launchable && task.doc_inputs.length === 0) missing.push('Inputs');
  if (task.workspace_launchable && task.acceptance_criteria.length === 0) missing.push('Acceptance Criteria');
  if (task.workspace_launchable && !task.repo_scope) missing.push('Repo Scope');

  if (missing.length > 0) {
    fail('VALIDATION_ERROR', `任务 ${task.task_id} 缺少必填字段`, { task_id: task.task_id, missing });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const taskBreakdownPath = args['task-breakdown'];
  const manifestPath = args.manifest;
  const outputPath = args.output || path.join('.meta', 'vibekanban-issue-batch.yaml');

  if (!taskBreakdownPath || !manifestPath) {
    fail('INPUT_ERROR', '缺少必要参数', {
      required: ['--task-breakdown', '--manifest'],
      example: 'node scripts/generate-issue-batch.mjs --task-breakdown docs/planning/task-breakdown.md --manifest docs/meta/project-manifest.yaml --output .meta/vibekanban-issue-batch.yaml'
    });
  }

  const [taskBreakdownText, manifestText] = await Promise.all([
    readText(taskBreakdownPath),
    readText(manifestPath)
  ]).catch((error) => fail('INPUT_ERROR', '读取输入文件失败', { message: error.message }));

  const manifest = parseManifest(manifestText);
  const tasks = parseTaskBreakdown(taskBreakdownText);

  if (tasks.length === 0) {
    fail('VALIDATION_ERROR', '未从 task-breakdown 中解析出任何任务', { file: taskBreakdownPath });
  }

  tasks.forEach(validateTask);

  const batch = {
    project_id: manifest.projectId,
    repo_id: manifest.repoId,
    base_branch: manifest.baseBranch,
    issues: tasks.map((task) => ({
      task_id: task.task_id,
      title: task.title || task.section_id,
      task_type: task.task_type,
      execution_mode: task.execution_mode,
      workspace_launchable: task.workspace_launchable,
      execution_reason: task.execution_reason,
      parent_task_id: task.parent_task_id,
      depends_on_task_ids: task.depends_on_task_ids,
      blocked_by_task_ids: task.blocked_by_task_ids,
      related_task_ids: task.related_task_ids,
      downstream_candidates: task.downstream_candidates,
      spawned_from_task_id: task.spawned_from_task_id,
      repo_scope: task.repo_scope,
      doc_inputs: task.doc_inputs,
      acceptance_criteria: task.acceptance_criteria
    })),
    task_to_issue: {}
  };

  await writeText(outputPath, toYaml(batch)).catch((error) => fail('WRITE_ERROR', '写入输出文件失败', { message: error.message, output: outputPath }));

  console.log(JSON.stringify({ success: true, output: outputPath, issues: batch.issues.length }, null, 2));
}

await main();
