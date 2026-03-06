# Playbook：编排下一个任务

## 目标

定义当前 session 完成后，如何基于执行结果、依赖状态和风险规则，决定是停止、解锁、自动启动下一个任务，还是请求人工介入。

## 输入

- `templates/session-result.yaml` 对应的实际结果文件
- VibeKanban 当前 issue 状态
- 任务关系图
- 项目 manifest
- callback policy
- merge policy

## 步骤 1：读取执行结果

最少读取以下字段：

- `result_status`
- `validation_status`
- `merge_readiness`
- `human_gate_required`
- `human_gate_reason`
- `relationship_snapshot`
- `followup_actions`

## 步骤 2：决定当前任务后处理

### 允许进入后续编排的条件

- `result_status` 为 `completed` 或 `completed_with_followup`
- 验证通过或存在明确豁免
- 无未处理人工闸门
- merge 已完成或策略允许继续

若不满足：

- 停止自动接续
- 必要时创建 follow-up issue
- 必要时请求人工介入

## 步骤 3：查询下游候选任务

优先来源：

1. `relationship_snapshot.downstream_candidates`
2. 当前任务描述中的 `Downstream Candidates`
3. VibeKanban 实时关系查询

## 步骤 4：筛选 ready task

一个候选任务只有在以下条件满足时，才算 ready：

- `Execution Mode = executable`
- `Workspace Launchable = true`
- `depends_on` 全部完成
- 不存在未解除 `blocked_by`
- 文档输入齐全
- 无未决人工闸门

## 步骤 5：决定下一步动作

### `manual-next`
- 更新状态后停止

### `unlock-next-on-done`
- 解锁所有符合条件的下游任务
- 不自动启动

### `start-next-on-done`
- 若仅存在一个 ready 且低风险任务，则自动启动
- 若存在多个 ready task，则只解锁，不自动启动

## 步骤 6：归档与回写

- 归档当前执行结果
- 回写 VibeKanban 任务状态
- 更新可执行任务池
- 若有自动启动，记录新旧 session 链路
