# Node 自动化脚手架

## 当前状态

仓库已增加最小 Node 脚手架：

- `package.json`
- `scripts/generate-issue-batch.mjs`
- `scripts/render-issue-description.mjs`
- `scripts/archive-session-result.mjs`
- `scripts/select-ready-task.mjs`
- `scripts/lib/cli.mjs`
- `scripts/lib/fs.mjs`
- `scripts/lib/yaml.mjs`

## 当前可用命令

```bash
npm run generate-issue-batch -- \
  --task-breakdown docs/planning/task-breakdown.md \
  --manifest docs/meta/project-manifest.yaml \
  --output .meta/vibekanban-issue-batch.yaml
```

## 说明

- 第一版采用零依赖 Node 实现，先保证文件流可用
- 后续若脚本数量增多，可再升级到 TypeScript


```bash
npm run render-issue-description -- \
  --batch .meta/vibekanban-issue-batch.yaml \
  --task-id TASK-001 \
  --output .meta/descriptions/TASK-001.md
```


```bash
npm run archive-session-result -- \
  --input .meta/session-result-sample.yaml \
  --output runs/sample-project/issue-123/workspace-123.yaml
```


```bash
npm run select-ready-task -- \
  --batch .meta/vibekanban-issue-batch.yaml \
  --status templates/task-status-snapshot.yaml \
  --output .meta/ready-task-selection.yaml
```
