#!/usr/bin/env node
import path from 'node:path';
import { parseArgs, fail } from './lib/cli.mjs';
import { readText, writeText } from './lib/fs.mjs';
import { fromYaml, toYaml } from './lib/yaml.mjs';

function requireFields(result, fields) {
  const missing = fields.filter((field) => {
    const value = result[field];
    if (Array.isArray(value)) return value === undefined;
    if (value && typeof value === 'object') return value === undefined;
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    fail('VALIDATION_ERROR', 'session result 缺少关键字段', { missing });
  }
}

function normalizeResult(result, overrides) {
  const normalized = {
    ...result,
    project_id: overrides.projectId || result.project_id,
    task_id: overrides.taskId || result.task_id,
    issue_id: overrides.issueId || result.issue_id,
    workspace_id: overrides.workspaceId || result.workspace_id,
    repo_id: overrides.repoId || result.repo_id,
    archived_at: new Date().toISOString()
  };

  if (!normalized.relationship_snapshot || typeof normalized.relationship_snapshot !== 'object') {
    normalized.relationship_snapshot = {
      parent: '',
      depends_on: [],
      blocked_by: [],
      related_tasks: [],
      downstream_candidates: []
    };
  }

  if (!Array.isArray(normalized.followup_actions)) {
    normalized.followup_actions = [];
  }

  return normalized;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = args.input;

  if (!inputPath) {
    fail('INPUT_ERROR', '缺少必要参数', {
      required: ['--input'],
      example: 'node scripts/archive-session-result.mjs --input .meta/session-result.yaml --output runs/sample-project/issue-uuid/workspace-uuid.yaml'
    });
  }

  const inputText = await readText(inputPath).catch((error) => fail('INPUT_ERROR', '读取输入文件失败', { message: error.message, input: inputPath }));
  const parsed = fromYaml(inputText);
  const normalized = normalizeResult(parsed, {
    projectId: args['project-id'],
    taskId: args['task-id'],
    issueId: args['issue-id'],
    workspaceId: args['workspace-id'],
    repoId: args['repo-id']
  });

  requireFields(normalized, [
    'project_id',
    'task_id',
    'issue_id',
    'workspace_id',
    'repo_id',
    'result_status',
    'validation_status',
    'merge_readiness',
    'sync_status',
    'human_gate_required',
    'recommended_action',
    'relationship_snapshot',
    'followup_actions'
  ]);

  const outputPath = args.output || path.join('runs', normalized.project_id, normalized.issue_id, `${normalized.workspace_id}.yaml`);
  await writeText(outputPath, toYaml(normalized)).catch((error) => fail('WRITE_ERROR', '写入输出文件失败', { message: error.message, output: outputPath }));

  console.log(JSON.stringify({ success: true, output: outputPath, issue_id: normalized.issue_id, workspace_id: normalized.workspace_id }, null, 2));
}

await main();
