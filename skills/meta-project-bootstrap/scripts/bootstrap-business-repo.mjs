const input = JSON.parse(process.argv[2] || '{}');

const required = ['github_owner', 'github_name', 'visibility', 'default_branch', 'local_path'];
const missing = required.filter((key) => !input[key]);

const plan = {
  ready: missing.length === 0,
  missing,
  commands: missing.length === 0 ? [
    `gh repo create ${input.github_owner}/${input.github_name} --${input.visibility} --clone`,
    `cd ${input.local_path}`,
    `git checkout -B ${input.default_branch}`,
  ] : [],
};

console.log(JSON.stringify(plan, null, 2));
