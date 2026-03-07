const input = JSON.parse(process.argv[2] || '{}');

const toList = (value) => {
  if (!value || value.length === 0) return '`[]`';
  return '`[' + value.join(', ') + ']`';
};

const docInputs = (input.document_inputs || [])
  .map((item) => `- \`${item}\``)
  .join('\n') || '- `docs/project-definition.md`';

const acceptance = (input.acceptance_criteria || [])
  .map((item) => `- [ ] ${item}`)
  .join('\n') || '- [ ] acceptance criteria missing';

const text = `# ${input.title || 'Untitled Task'}

## Task Identity
- Task ID: \`${input.task_id || 'TBD'}\`
- Project ID: \`${input.project_id || 'TBD'}\`
- Issue ID: \`${input.issue_id || 'TBD'}\`
- Parent: \`${input.parent || 'TBD'}\`

## Execution Classification
- Execution Mode: \`${input.execution_mode || 'non-executable'}\`
- Workspace Launchable: \`${String(input.workspace_launchable ?? false)}\`
- Execution Reason: \`${input.execution_reason || 'unspecified'}\`
- Workspace Scope: \`${input.workspace_scope || 'n/a'}\`
- Executor: \`${input.executor || 'CODEX'}\`

## Relationships
- Depends On: ${toList(input.depends_on)}
- Blocked By: ${toList(input.blocked_by)}
- Related Tasks: ${toList(input.related_tasks)}
- Downstream Candidates: ${toList(input.downstream_candidates)}
- Spawned From: \`${input.spawned_from || ''}\`

## Repo Context
- Repo ID: \`${input.repo_id || 'TBD'}\`
- Repo Scope: \`${input.repo_scope || 'TBD'}\`
- Base Branch: \`${input.base_branch || 'main'}\`

## Document Inputs
${docInputs}

## Goal
${input.goal || 'Goal missing.'}

## Acceptance Criteria
${acceptance}

## Execution Notes
${input.execution_notes || 'No extra notes.'}
`;

console.log(text);
