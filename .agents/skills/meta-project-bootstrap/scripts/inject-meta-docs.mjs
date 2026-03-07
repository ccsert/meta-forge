const input = JSON.parse(process.argv[2] || '{}');
const target = input.target_repo_path || '<target-repo>';

const files = [
  ['docs/project-definition.md', `${target}/docs/project-definition.md`],
  ['docs/architecture/architecture-init.md', `${target}/docs/architecture/architecture-init.md`],
  ['docs/planning/task-breakdown.md', `${target}/docs/planning/task-breakdown.md`],
  ['docs/meta/project-manifest.draft.yaml', `${target}/docs/meta/project-manifest.yaml`],
  ['docs/meta/issue-map.draft.yaml', `${target}/docs/meta/issue-map.yaml`],
];

console.log(JSON.stringify({
  target,
  files,
  required_directories: [
    `${target}/docs/architecture`,
    `${target}/docs/planning`,
    `${target}/docs/meta`,
    `${target}/docs/adrs`,
  ],
}, null, 2));
