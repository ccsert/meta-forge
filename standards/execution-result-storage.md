# 执行结果存储规范

## 目标

定义任务执行结果应该存放在哪里、保存哪些字段、谁负责写入，以及这些结果如何被后续任务与 orchestrator 消费。

## 核心原则

- 执行结果必须结构化存储，不能只散落在聊天记录里
- 执行结果需要同时服务于“任务回溯”和“后续任务上下文装配”
- 执行结果要区分项目内长期记录与元仓库侧编排记录
- 实时状态以 VibeKanban 为准，执行快照由元仓库存档

---

## 推荐双写模型

建议执行结果分两层存放：

### 1. 元仓库侧：编排记录

用于调度、追踪、回放、分析。

建议位置：

- `runs/` 目录
- 或 `projects/<project-id>/runs/` 目录

建议文件命名：

- `runs/<project-id>/<issue-id>/<workspace-id>.yaml`
- 或 `runs/<date>-<project-id>-<task-id>.yaml`

适合保存：

- issue_id
- task_id
- workspace_id
- repo_id
- base_branch
- work_branch
- result_status
- validation_status
- merge_result
- human_gate_required
- followup_actions
- relationship_snapshot
- started_at
- ended_at

### 2. 业务仓库侧：任务产物与变更痕迹

用于支持后续开发者/agent 理解任务结果。

建议位置：

- `docs/execution/`
- `docs/changelogs/`
- `docs/adrs/`（若涉及架构决策）

适合保存：

- 任务结果摘要
- 新增或变更的设计说明
- 决策补充
- 迁移说明
- 已知限制与 follow-up 建议

---

## 为什么不只放一处

如果只放业务仓库：
- 编排层很难统一追踪跨任务执行历史

如果只放元仓库：
- 业务仓库后来者很难理解某次改动的设计背景

所以推荐：
- 元仓库存“结构化执行快照”
- 业务仓库存“长期可读的项目内结果文档”

---

## 最小执行结果字段

每次 session 结束后，至少应保存：

- `project_id`
- `task_id`
- `issue_id`
- `workspace_id`
- `repo_id`
- `result_status`
- `validation_status`
- `merge_readiness`
- `merge_result`
- `human_gate_required`
- `human_gate_reason`
- `recommended_action`
- `relationship_snapshot`
- `followup_actions`
- `notes`
- `started_at`
- `ended_at`

---

## 谁负责写入

### session 负责输出

session 结束时输出结构化 `session-result.yaml`。

### orchestrator 负责归档

orchestrator 读取 session 输出后：

- 写入元仓库运行记录
- 必要时更新业务仓库文档
- 更新 VibeKanban 状态
- 决定后续任务调度

---

## 与后续任务的关系

后续任务在装配上下文时，应优先读取：

1. 当前任务依赖任务的执行结果快照
2. 业务仓库中的长期文档产物
3. VibeKanban 的实时任务状态

不要只看聊天历史。

---

## 推荐目录

建议元仓库增加：

```text
runs/
  <project-id>/
    <issue-id>/
      <workspace-id>.yaml
```

并建议业务仓库增加：

```text
docs/execution/
  <task-id>.md
```

推荐使用模板：`templates/task-execution-summary.md`

---

## 保留策略

- 元仓库运行快照：长期保留
- 业务仓库执行摘要：仅保留对后续开发有价值的内容
- 纯临时日志不进入长期文档
