# Playbook：批量创建 VibeKanban Issues

## 目标

将 `templates/task-breakdown.md` 产出的结构化任务树，稳定映射为 VibeKanban 中的 issue、关系与可执行标识。

## 输入

- `docs/planning/task-breakdown.md`
- `docs/meta/project-manifest.yaml`
- `projects/registry.yaml`
- `templates/vibekanban-issue-description.md`
- `standards/task-description-protocol.md`
- `standards/executable-task-policy.md`
- `standards/task-relationship-model.md`

## 输出

- 已创建的 issue 列表
- 任务 ID → issue_id 映射表
- 已建立的任务关系
- 标记为 `workspace_launchable: true` 的可执行任务清单
- 持久化的 `issue-map.yaml`

## 创建原则

- 先创建节点，再建立关系
- 先写任务描述，再设置依赖关系
- 所有任务都可进入 VibeKanban，但不是所有任务都可执行
- 可执行性必须显式落在 issue 描述与映射清单中

## 步骤 1：预校验任务拆解

创建前逐项检查：

- [ ] 每个任务都有稳定 `Task ID`
- [ ] 每个任务都声明了 `Execution Mode`
- [ ] 每个任务都声明了 `Workspace Launchable`
- [ ] 每个任务都声明了 `Execution Reason`
- [ ] 每个任务都带有 `Parent` 或明确说明是根节点
- [ ] `Depends On` / `Blocked By` / `Related To` 已区分
- [ ] 执行性任务具备文档输入、验收标准、repo scope

若不满足，先修正 `task-breakdown.md`，不要直接创建 issue。

## 步骤 2：生成 issue 创建清单

建议先在元仓库生成一份机器可读清单，参考 `templates/vibekanban-issue-batch.yaml`。

每个条目至少包含：

- `task_id`
- `title`
- `execution_mode`
- `workspace_launchable`
- `execution_reason`
- `parent_task_id`
- `depends_on_task_ids`
- `blocked_by_task_ids`
- `related_task_ids`
- `repo_id`
- `repo_scope`

## 步骤 3：按层级创建 issue

推荐顺序：

1. Epic
2. Feature
3. Story
4. Task

原因：

- 便于在描述中写入父级信息
- 便于后续建立 `parent_of` 关系

## 步骤 4：渲染 issue 描述

每个 issue 的描述应基于 `templates/vibekanban-issue-description.md` 渲染，至少填入：

- 身份字段：`Task ID` / `Project ID` / `Issue ID`
- 可执行字段：`Execution Mode` / `Workspace Launchable` / `Execution Reason`
- 关系字段：`Depends On` / `Blocked By` / `Related Tasks` / `Spawned From`
- 仓库字段：`Repo ID` / `Repo Scope` / `Base Branch`
- 文档字段：`Document Inputs`
- 交付字段：`Acceptance Criteria`

## 步骤 5：回写 Task ID → issue_id 映射

每创建一个 issue，就要立即回写映射表，避免后续无法建立关系。

推荐使用 `templates/issue-map.yaml` 作为持久化模板，并遵守 `docs/vibekanban-mcp-idempotency.md` 中的幂等规则。

建议至少维护一份以下结构：

```yaml
task_to_issue:
  TASK-001: issue-uuid-1
  TASK-002: issue-uuid-2
```

## 步骤 6：建立任务关系

基于 `standards/task-relationship-model.md` 建立：

- `parent_of`
- `depends_on`
- `blocks`
- `relates_to`
- `spawned_from`

规则：

- 父子关系与依赖关系分开创建
- `subtask` 不自动等于 `depends_on`
- 若任务是补偿 issue，必须创建 `spawned_from`

## 步骤 7：标记可执行任务池

创建完成后，额外产出一个“可启动任务池”，仅包含：

- `execution_mode = executable`
- `workspace_launchable = true`

这些任务才允许进入 ready 队列并触发 `start_workspace_session`。

## 步骤 8：创建后验证

创建完成后检查：

- [ ] 每个任务都有 issue_id
- [ ] 每个执行性任务都带可执行性字段
- [ ] 关系索引已写入描述
- [ ] 实时关系已在 VibeKanban 建立
- [ ] 可执行任务池已生成

## 推荐运行顺序

1. 先生成 batch 清单
2. 再批量创建 issue
3. 再回写映射表
4. 再批量建关系
5. 最后生成可执行任务池

## 一个关键约束

不要在创建 issue 的同时就自动启动所有可执行任务。

正确顺序应是：

1. 创建任务
2. 建立关系
3. 校验依赖图
4. 选出 ready task
5. 再启动 workspace session
