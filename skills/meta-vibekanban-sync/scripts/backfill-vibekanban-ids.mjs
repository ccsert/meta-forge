import { readFileSync, writeFileSync } from 'node:fs';

const [filePath, idsJson] = process.argv.slice(2);
if (!filePath || !idsJson) {
  console.error('usage: node backfill-vibekanban-ids.mjs <file> <ids-json>');
  process.exit(1);
}

const ids = JSON.parse(idsJson);
let text = readFileSync(filePath, 'utf8');

for (const key of ['organization_id', 'project_id', 'repo_id', 'board_id']) {
  if (ids[key] !== undefined && ids[key] !== null) {
    const value = String(ids[key]);
    const pattern = new RegExp(`${key}:\\s*"[^"]*"`);
    if (pattern.test(text)) {
      text = text.replace(pattern, `${key}: "${value}"`);
    }
  }
}

writeFileSync(filePath, text);
console.log(JSON.stringify({ updated: filePath, backfilled: ids }, null, 2));
