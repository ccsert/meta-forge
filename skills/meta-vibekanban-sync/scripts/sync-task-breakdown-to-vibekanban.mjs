import { readFileSync } from 'node:fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('usage: node sync-task-breakdown-to-vibekanban.mjs <issue-map-yaml>');
  process.exit(1);
}

const text = readFileSync(filePath, 'utf8');
const mappingSection = (text.split('mappings:')[1] || '').split('relationships:')[0] || '';
const lines = mappingSection.split('\n');
const mappings = [];
let current = null;
for (const line of lines) {
  const taskMatch = line.match(/^\s*- task_id: (.+)$/);
  if (taskMatch) {
    if (current) mappings.push(current);
    current = { task_id: taskMatch[1].trim() };
    continue;
  }
  if (!current) continue;
  const issueMatch = line.match(/^\s*issue_id: "(.*)"$/);
  const statusMatch = line.match(/^\s*status: (.+)$/);
  const typeMatch = line.match(/^\s*type: (.+)$/);
  const titleMatch = line.match(/^\s*title: (.+)$/);
  if (issueMatch) current.issue_id = issueMatch[1];
  if (statusMatch) current.status = statusMatch[1].trim();
  if (typeMatch) current.type = typeMatch[1].trim();
  if (titleMatch) current.title = titleMatch[1].trim();
}
if (current) mappings.push(current);

const pending = mappings.filter((item) => !item.issue_id);
const synced = mappings.filter((item) => item.issue_id);
console.log(JSON.stringify({ total: mappings.length, synced, pending }, null, 2));
