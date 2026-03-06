# Session 编排与人工介入模型

## 目标

回答两个关键问题：

1. VibeKanban 中一个 workspace session 完成后，如何自动接续下一个任务？
2. 当 session 执行过程中遇到不确定性时，何时人工介入，何时由 agent 自主继续？

---

## 1. 核心结论

### 1.1 不建议把“自动执行下一个任务”完全放进单个 session 内部

原因：

- 单个 session 的职责应该聚焦在“完成当前 issue”
- 下一个任务是否 ready，需要读取全局依赖图与最新状态
- 下一个任务是否应该启动，取决于测试结果、合并结果、风险等级、人工闸门
- 这些判断属于 orchestration 层，不属于当前编码 session 本身

因此推荐模型是：

- 当前 session 负责完成当前任务
- session 结束后，由元仓库 orchestrator 读取结果
- orchestrator 决定是否自动启动下一个 session

### 1.2 session 内允许“请求确认”，但不负责最终编排决策

session 可以在执行中产出：

- `needs_human_input`
- `needs_arch_decision`
- `needs_scope_confirmation`
- `safe_to_continue`

但真正是否继续、暂停、升级为 issue，应由编排规则决定。

---

## 2. 推荐架构：双层回调

### 层 1：session 内回调

作用：汇报当前任务结果。

session 结束时应至少产出一个结构化结果：

- `issue_id`
- `workspace_id`
- `result_status`
- `validation_status`
- `merge_readiness`
- `human_gate_status`
- `notes`
- `followup_actions`

### 层 2：orchestrator 回调

作用：读取 session 结果，并推进整个任务网络。

orchestrator 在 session 完成后执行：

1. 更新 issue 状态
2. 执行 cleanup
3. 判断是否允许 merge
4. 判断是否允许自动解锁下游任务
5. 判断是否允许自动启动下一个 session
6. 如不允许，创建人工介入点或 follow-up issue

---

## 3. session 结果状态模型

建议每次 session 结束都归一到以下状态之一：

### `completed`
任务已完成，验证通过，可进入 merge / unlock 流程。

### `completed_with_followup`
主任务完成，但产生补充事项；可进入 merge，但需自动创建 follow-up issue。

### `blocked_requires_human`
任务被阻塞，必须人工决策后才能继续。

### `blocked_requires_doc`
任务被阻塞，缺少必要文档或 ADR，应先补文档任务。

### `failed_retryable`
本次执行失败，但属于可重试问题，如环境、脚本、偶发错误。

### `failed_escalated`
失败且不宜自动重试，应升级为新 issue 或人工处理。

---

## 4. 是否自动启动下一个任务的判定规则

只有同时满足以下条件，orchestrator 才能自动启动下一个 session：

- 当前 session `result_status = completed` 或 `completed_with_followup`
- 当前任务通过 DoD 或存在显式豁免
- 合并已完成，或当前策略允许 merge 后再启动
- 没有待处理的人工闸门
- 下游任务的 `depends_on` 已全部满足
- 下游任务本身通过“执行单元检查”
- 下游任务文档输入齐全
- 候选下游任务唯一，或存在明确优先级规则

如果不满足，不能自动接续。

---

## 5. 为什么不要无条件自动接续

因为最常见的问题不是“找不到下一个任务”，而是“找到了多个看起来都能做的任务”。

例如：

- A 完成后同时解锁 B、C
- B 是高风险数据库任务，C 是低风险前端任务
- 如果没有优先级和风险策略，agent 自动选错会放大成本

所以推荐：

- 只有在“唯一 ready task”时自动启动
- 多个 ready task 时，只做解锁，不做自动启动
- 由人或上层调度策略挑选下一个任务

---

## 6. 人工介入模型

### 6.1 应人工介入的场景

以下情况应明确暂停并请求人工输入：

- 需求语义不清，且会影响实现方向
- 架构边界不清，需要新增/修改 ADR
- 数据模型或接口契约有不兼容变更
- 安全、权限、合规决策不明确
- 合并冲突涉及核心模块语义
- 存在多个合理实现方向，成本/收益差异明显
- 下游任务选择存在业务优先级判断

### 6.2 可由 agent 自主继续的场景

以下情况通常无需人工介入：

- 局部实现细节选择
- 低风险重构
- 文档补充
- 轻量冲突解决
- 格式化、命名、结构微调
- 已有 ADR / 文档明确覆盖的问题

### 6.3 推荐中间机制：agent 先自判，再升级

不要把所有疑问都直接丢给人。

推荐流程：

1. agent 先检查文档与 ADR 是否已覆盖
2. 若已覆盖，则按文档继续
3. 若未覆盖，但存在低风险默认策略，则按默认策略继续并记录
4. 若会影响接口、架构、数据或业务语义，则升级为人工介入

这意味着：

- 不是“人工 or 自动”二选一
- 而是“agent 先按协议自判，超出边界再人工介入”

---

## 7. 推荐的人机协作状态字段

### 7.1 任务描述中的关系索引也参与判断

当 agent 需要判断“当前是否应继续”时，不应只看当前任务标题和自然语言说明，还应读取任务描述中的关系索引字段，例如：

- `Depends On`
- `Blocked By`
- `Related Tasks`
- `Spawned From`
- `Repo ID`

推荐方式是：

- 先用任务描述中的 ID 索引定位相关任务
- 再查询这些任务的实时状态
- 最后再决定继续、暂停、升级或请求人工


建议在任务或 session 结果中增加：

- `human_gate_required`: true / false
- `human_gate_reason`: scope / architecture / product / security / merge-conflict
- `recommended_action`: continue / pause / create-followup / ask-human
- `next_step_hint`: 一段给人或下一个 agent 的结构化说明

---

## 8. 推荐的自动接续策略

建议默认采用：`unlock-next-on-done`

含义：

- 当前任务完成后，先解锁下游任务
- 不默认自动启动下一个任务
- 若仅存在一个 ready 且低风险任务，可在 `start-next-on-done` 策略下自动启动

### 三档策略

#### `manual-next`
- 完成当前任务后停止
- 由人决定下一任务

#### `unlock-next-on-done`
- 自动解锁下游任务
- 不自动启动

#### `start-next-on-done`
- 若唯一 ready task 且风险可接受，则自动启动下一 session

默认推荐使用第二档，第三档只用于非常稳定的流水线型任务。

---

## 9. 推荐的编排决策顺序

session 完成后，orchestrator 应按顺序判断：

1. 当前任务是否完成？
2. 是否通过验证？
3. 是否需要人工闸门？
4. 是否允许 merge？
5. 是否产生 follow-up issue？
6. 是否存在下游 ready task？
7. 下游任务是否唯一且低风险？
8. 决定：停止 / 解锁 / 自动启动下一个 session

---

## 10. 最实用的结论

你现在这套系统，最稳妥的默认值应该是：

- session 内专注完成当前任务
- session 结束后返回结构化结果
- orchestrator 负责解锁后续任务
- 默认不直接自动启动下一个任务
- 只有在唯一 ready 且低风险时才自动接续
- 需要架构/需求/安全判断时，明确进入人工闸门

这会比“让单个 agent 一路自己跑下去”稳定得多。
