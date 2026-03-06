# 元仓库任务模型到 VibeKanban 的映射

## 任务类型映射

### 不直接启动 workspace 的任务

这些任务应显式标记：`execution_mode: non-executable|documentation|decision|planning`，并设置 `workspace_launchable: false`。


- 文档补齐任务
- 架构澄清任务
- ADR 决策任务
- 调研任务
- 父级汇总任务（Epic / 大 Feature）

这些任务可以存在于 VibeKanban，但默认不应直接启动编码 session。

### 可启动 workspace 的任务

这些任务应显式标记：`execution_mode: executable`，并设置 `workspace_launchable: true`。


- 单 workspace 可闭环的开发任务
- 可独立验证的缺陷修复任务
- 低风险、边界清晰的重构任务
- 明确输入输出的文档实现任务

## 创建规则

一个 issue 只有在满足以下条件时，才应被标记为可执行：

- 有明确 `repo_scope`
- 有明确 `doc_inputs`
- 有明确 `acceptance_criteria`
- 有明确 `depends_on`
- 通过执行单元检查

## 编排规则

- VibeKanban 负责存储任务与关系
- 元仓库负责判断 issue 是否适合启动 session
- session 完成后的下一任务选择由 orchestrator 决定

## 批量创建顺序

- 先从 `task-breakdown.md` 生成 batch 清单
- 再创建 issue 节点
- 再回写 `task_id -> issue_id` 映射
- 再建立任务关系
- 最后生成可执行任务池

推荐参考：`playbooks/create-vibekanban-issues.md`


## 描述字段约定

每个执行性 issue 的描述中，建议显式包含以下关系索引字段：

- `Task ID`
- `Project ID`
- `Issue ID`
- `Parent`
- `Depends On`
- `Blocked By`
- `Related Tasks`
- `Spawned From`
- `Repo ID`

用途：

- 便于 agent 在单任务上下文中快速查询关联任务
- 便于判断依赖是否满足、阻塞是否解除、是否应继续执行
- 便于 follow-up issue 与 merge 冲突补偿任务建立来源链路


## 可执行性字段约定

每个 issue 建议增加以下显式字段：

- `Execution Mode`
- `Workspace Launchable`
- `Execution Reason`

规则：

- 在板上的任务不一定可执行
- 只有 `Execution Mode = executable` 且 `Workspace Launchable = true` 的任务，才可进入 workspace session
- Epic、Feature、文档、决策、规划类任务可以存在于 VibeKanban，但通常不拉起编码工作空间


## 幂等创建要求

通过 VibeKanban MCP 创建 issue 时，必须：

- 先读取 `issue-map.yaml`
- 先按 `task_id` 检查是否已创建
- 创建成功后立即回写 `task_id -> issue_id`
- 重跑时跳过已创建任务，避免重复建单

推荐参考：`docs/vibekanban-mcp-idempotency.md` 与 `playbooks/use-vibekanban-mcp.md`
