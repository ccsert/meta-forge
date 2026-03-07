import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const cwd = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const files = {
  project_definition: path.join(cwd, 'docs/project-definition.md'),
  architecture_init: path.join(cwd, 'docs/architecture/architecture-init.md'),
  task_breakdown: path.join(cwd, 'docs/planning/task-breakdown.md'),
  manifest_draft: path.join(cwd, 'docs/meta/project-manifest.draft.yaml'),
  issue_map_draft: path.join(cwd, 'docs/meta/issue-map.draft.yaml'),
};

const result = {
  cwd,
  checks: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, existsSync(value)])),
  vibekanban: {
    organization_id: false,
    project_id: false,
    repo_id: false,
  },
};

const manifestPath = files.manifest_draft;
if (existsSync(manifestPath)) {
  const text = readFileSync(manifestPath, 'utf8');
  result.vibekanban.organization_id = /organization_id:\s*"[^"]+"/.test(text);
  result.vibekanban.project_id = /project_id:\s*"[^"]+"/.test(text);
  result.vibekanban.repo_id = /repo_id:\s*"[^"]+"/.test(text);
}

console.log(JSON.stringify(result, null, 2));
