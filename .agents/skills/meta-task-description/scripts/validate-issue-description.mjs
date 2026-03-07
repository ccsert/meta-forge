import { readFileSync } from 'node:fs';

const text = process.argv[2]
  ? readFileSync(process.argv[2], 'utf8')
  : '';

const requiredHeaders = [
  '## Task Identity',
  '## Execution Classification',
  '## Relationships',
  '## Repo Context',
  '## Document Inputs',
  '## Goal',
  '## Acceptance Criteria',
  '## Execution Notes',
];

const requiredFields = [
  'Task ID:',
  'Project ID:',
  'Issue ID:',
  'Execution Mode:',
  'Workspace Launchable:',
  'Execution Reason:',
  'Repo ID:',
  'Repo Scope:',
  'Base Branch:',
];

const missing_headers = requiredHeaders.filter((header) => !text.includes(header));
const missing_fields = requiredFields.filter((field) => !text.includes(field));

const result = {
  compliant: missing_headers.length === 0 && missing_fields.length === 0,
  missing_headers,
  missing_fields,
};

console.log(JSON.stringify(result, null, 2));
