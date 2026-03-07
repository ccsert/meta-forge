import { readFileSync } from 'node:fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('usage: node sync-issue-relationships.mjs <issue-map-yaml>');
  process.exit(1);
}

const text = readFileSync(filePath, 'utf8');
const section = text.split('relationships:')[1] || '';
const relationships = [];
let current = null;
for (const line of section.split('\n')) {
  const fromMatch = line.match(/^\s*- from: (.+)$/);
  if (fromMatch) {
    if (current) relationships.push(current);
    current = { from: fromMatch[1].trim() };
    continue;
  }
  if (!current) continue;
  const toMatch = line.match(/^\s*to: (.+)$/);
  const typeMatch = line.match(/^\s*type: (.+)$/);
  if (toMatch) current.to = toMatch[1].trim();
  if (typeMatch) current.type = typeMatch[1].trim();
}
if (current) relationships.push(current);
console.log(JSON.stringify({ total: relationships.length, relationships }, null, 2));
