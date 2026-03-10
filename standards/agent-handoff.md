# Agent 交接信号协议

> 定义 agent 之间交接时使用的结构化信号，确保调度决策有据可依。

---

## 目标

Agent 之间交接不应依赖自然语言描述，而应通过标准化的 `session-result.yaml` 字段值来驱动调度决策。

---

## session-result 状态枚举

### `result_status`

| 值 | 含义 | 后续动作 |
|----|------|----------|
| `completed` | 任务已完成，验证通过 | 进入 merge / unlock 流程 |
| `completed_with_warnings` | 完成但有告警 | 人工确认后再 merge |
| `partial` | 部分完成，需继续 | 创建 follow-up task |
| `blocked_requires_human` | 被阻塞，需人工介入 | 创建人工介入点 |
| `failed_recoverable` | 失败但可恢复 | 重试或创建修复 task |
| `failed_escalated` | 失败且需升级 | 创建升级 issue，通知相关方 |

### `validation_status`

| 值 | 含义 |
|----|------|
| `all_passed` | 所有验证通过 |
| `tests_failed` | 测试失败 |
| `lint_failed` | Lint 检查失败 |
| `typecheck_failed` | 类型检查失败 |
| `not_applicable` | 无验证步骤 |

### `merge_readiness`

| 值 | 含义 |
|----|------|
| `ready` | 可直接 merge |
| `needs_review` | 需要人工 review 后 merge |
| `has_conflicts` | 存在冲突，需先解决 |
| `not_ready` | 不满足 merge 条件 |

### `human_gate_status`

| 值 | 含义 |
|----|------|
| `not_required` | 无需人工介入 |
| `needs_human_input` | 需要人工提供信息 |
| `needs_arch_decision` | 需要架构决策 |
| `needs_scope_confirmation` | 需要范围确认 |
| `safe_to_continue` | 已确认可继续 |

---

## Orchestrator 调度决策矩阵

Orchestrator 根据 session-result 组合判断下一步：

| result_status | validation | merge_readiness | 决策 |
|---|---|---|---|
| `completed` | `all_passed` | `ready` | 自动 merge → 解锁下游 → 启动下一任务 |
| `completed` | `all_passed` | `needs_review` | 等待人工 review → merge 后解锁 |
| `completed` | `tests_failed` | 任意 | 不 merge → 交回 Execution Agent 修复 |
| `completed_with_warnings` | 任意 | 任意 | 人工确认后再决定 |
| `partial` | 任意 | `not_ready` | 创建 follow-up task → 继续未完成部分 |
| `blocked_requires_human` | 任意 | 任意 | 创建人工介入点 → 等待人工响应 |
| `failed_recoverable` | 任意 | 任意 | 重试一次 → 仍失败则升级 |
| `failed_escalated` | 任意 | 任意 | 创建升级 issue → 不自动推进 |

---

## followup_actions 合法值

| 值 | 含义 |
|----|------|
| `unlock_downstream` | 解锁依赖当前任务的下游任务 |
| `start_next_task` | 自动启动下一个 ready task |
| `create_followup_issue` | 创建 follow-up issue |
| `request_human_review` | 请求人工 review |
| `retry_execution` | 重新执行当前任务 |
| `escalate_to_orchestrator` | 升级到 Orchestrator 决策 |
| `archive_result` | 归档运行结果 |
| `experience_feedback` | 回流经验到元仓库 |

---

## 约束

- 不允许在测试失败时自动启动后续任务
- 不允许在 merge 冲突未决时解锁依赖该任务的核心任务
- 自动创建的 follow-up issue 必须带来源 `issue_id`
- Orchestrator 不得跳过调度决策矩阵自行判断
