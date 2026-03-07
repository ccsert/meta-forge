import { existsSync } from 'node:fs';
import path from 'node:path';

const cwd = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const check = (p) => existsSync(path.join(cwd, p));

const result = {
  cwd,
  project_definition: check('docs/project-definition.md'),
  architecture_init: check('docs/architecture/architecture-init.md'),
  task_breakdown: check('docs/planning/task-breakdown.md'),
};

if (!result.project_definition) {
  result.current_stage = 'stage-1-project-definition';
} else if (!result.architecture_init) {
  result.current_stage = 'stage-2-architecture-init';
} else if (!result.task_breakdown) {
  result.current_stage = 'stage-3-task-breakdown';
} else {
  result.current_stage = 'stage-1-3-doc-baseline-complete';
}

console.log(JSON.stringify(result, null, 2));
