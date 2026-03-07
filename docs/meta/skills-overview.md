# 元仓库 Skills 总览

## 1. 当前已落地 Skills

### `meta-stage-gate`

作用：

- 识别当前项目阶段
- 输出阶段状态快照
- 明确允许动作与禁止动作
- 防止在 `meta-repo` 中直接滑向业务代码执行

目录：

- `skills/meta-stage-gate/SKILL.md`
- `skills/meta-stage-gate/scripts/check-stage-ready.mjs`
- `skills/meta-stage-gate/scripts/snapshot-stage-status.mjs`

适用场景：

- “我们现在到哪一步了”
- “下一步是什么”
- “现在能不能开始执行”

---

### `meta-task-description`

作用：

- 渲染 VibeKanban 任务描述
- 校验任务描述是否符合元仓库协议
- 约束 ready task 使用结构化描述，而不是自由摘要

目录：

- `skills/meta-task-description/SKILL.md`
- `skills/meta-task-description/scripts/render-vibekanban-description.mjs`
- `skills/meta-task-description/scripts/validate-issue-description.mjs`

适用场景：

- 创建执行性 issue
- 修复任务描述不合规
- 判断一个 task 是否符合 ready 标准

---

### `meta-vibekanban-sync`

作用：

- 回填 VibeKanban 关键 ID
- 解析 `issue-map`
- 准备节点同步与关系同步
- 约束 issue 同步过程的边界与幂等性

目录：

- `skills/meta-vibekanban-sync/SKILL.md`
- `skills/meta-vibekanban-sync/scripts/backfill-vibekanban-ids.mjs`
- `skills/meta-vibekanban-sync/scripts/sync-task-breakdown-to-vibekanban.mjs`
- `skills/meta-vibekanban-sync/scripts/sync-issue-relationships.mjs`

适用场景：

- “帮我回填 organization_id/project_id/repo_id”
- “把 task-breakdown 同步到 VibeKanban”
- “issue-map 现在同步了多少”

---

### `meta-project-bootstrap`

作用：

- 创建业务仓
- 生成/确认 bootstrap 命令
- 生成文档注入计划
- 约束阶段 4/5 不直接滑向执行阶段

目录：

- `skills/meta-project-bootstrap/SKILL.md`
- `skills/meta-project-bootstrap/scripts/bootstrap-business-repo.mjs`
- `skills/meta-project-bootstrap/scripts/inject-meta-docs.mjs`

适用场景：

- “帮我创建业务仓”
- “把元仓库文档注入到业务仓”
- “执行新项目的阶段 4/5”

---

## 2. 推荐使用顺序

### 场景 A：判断当前是否可以继续下一步

1. 使用 `meta-stage-gate`
2. 输出阶段状态快照
3. 明确下一步允许动作

### 场景 B：准备把任务同步到 VibeKanban

1. 使用 `meta-stage-gate`
2. 使用 `meta-task-description`
3. 使用 `meta-vibekanban-sync`

### 场景 C：发现任务已经建了，但描述不规范

1. 使用 `meta-task-description`
2. 重新渲染描述
3. 再更新 issue

---

## 3. 当前仍建议后续补齐的 Skills

- `meta-new-project`

推荐优先级：

1. 先稳定现有 4 个 skill 的实际使用效果
2. 最后补 `meta-new-project`

---

## 4. 当前建议结论

当前元仓库已经形成一个最小可用的 skills 组合：

- `meta-stage-gate`
- `meta-task-description`
- `meta-vibekanban-sync`
- `meta-project-bootstrap`

这 4 个 skill 已经覆盖当前最容易出错的四个环节：

- 阶段判断
- 任务描述协议
- VibeKanban 同步
- 业务仓 bootstrap
