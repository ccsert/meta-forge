import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const cwd = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const has = (p) => existsSync(path.join(cwd, p));
const read = (p) => readFileSync(path.join(cwd, p), 'utf8');

const docs = {
  project_definition: has('docs/project-definition.md'),
  architecture_init: has('docs/architecture/architecture-init.md'),
  task_breakdown: has('docs/planning/task-breakdown.md'),
  manifest_draft: has('docs/meta/project-manifest.draft.yaml'),
  issue_map_draft: has('docs/meta/issue-map.draft.yaml'),
};

let currentStage = 'route-a-project-definition-missing';
if (docs.project_definition) currentStage = 'route-b-architecture-missing';
if (docs.project_definition && docs.architecture_init) currentStage = 'route-c-task-breakdown-missing';
if (docs.project_definition && docs.architecture_init && docs.task_breakdown) currentStage = 'new-project-stage-3-or-later';

const completed = [];
const partial = [];
const pending = [];

if (docs.project_definition) completed.push('阶段 1：项目定义'); else pending.push('阶段 1：项目定义');
if (docs.architecture_init) completed.push('阶段 2：架构初始化'); else if (docs.project_definition) pending.push('阶段 2：架构初始化');
if (docs.task_breakdown) completed.push('阶段 3：任务拆解'); else if (docs.architecture_init) pending.push('阶段 3：任务拆解');
if (docs.manifest_draft && docs.issue_map_draft) partial.push('阶段 4/5 材料草案已存在');

let idsResolved = false;
if (docs.manifest_draft) {
  const manifest = read('docs/meta/project-manifest.draft.yaml');
  idsResolved = /organization_id:\s*"[^"]+"/.test(manifest) && /project_id:\s*"[^"]+"/.test(manifest) && /repo_id:\s*"[^"]+"/.test(manifest);
}
if (idsResolved) partial.push('阶段 6：VibeKanban 绑定主链路');

const output = {
  cwd,
  current_stage: currentStage,
  completed,
  partial,
  pending,
  allowed_next_actions: [
    '输出阶段状态快照',
    '指出下一步 playbook',
    '说明哪些动作仍被禁止',
  ],
  forbidden_actions: [
    '在阶段未明确前直接进入业务代码实现',
    '将部分完成误判为整体完成',
    '跳过人工闸门直接切换阶段',
  ],
};

console.log(JSON.stringify(output, null, 2));
