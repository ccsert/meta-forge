# Playbook：Execution Agent 执行流

## 目标

定义 `Execution Agent` 在接到一个 ready task 后，如何在单个 workspace 中完成实现、自验证、结果输出与升级判断。

## 适用范围

仅适用于：

- `execution_mode = executable`
- `workspace_launchable = true`
- 已经通过 ready task 选择

不适用于：

- 文档补齐型任务
- 决策型任务
- 未完成前置依赖的任务
- 需要全局多任务联动的任务

---

## 运行边界

`Execution Agent` 必须遵守：

- 一次只处理一个 `task_id`
- 一次只绑定一个 `workspace_id`
- 只消费当前任务相关上下文
- 不自行扩展任务范围
- 不自行改变全局计划

---

## 输入

- 当前 issue / task 描述
- 任务文档输入
- 依赖任务执行摘要
- `docs/meta/project-manifest.yaml`
- `docs/meta/issue-map.yaml`
- 当前 workspace 代码状态
- 相关 standards / templates

---

## 输出

- 代码变更
- 文档变更
- `session-result.yaml`
- `docs/execution/<task-id>.md`
- 必要时的 follow-up 建议

---

## 阶段 1：启动前确认

在正式开始前必须确认：

- 当前任务是可执行任务
- 任务具备明确文档输入
- `depends_on` 已满足
- 无未决人工闸门
- 当前任务范围可在单 workspace 中闭环

若任一条件不满足：

- 停止执行
- 返回阻塞原因
- 交回 `Orchestrator Agent`

---

## 阶段 2：同步最新代码

严格执行 `playbooks/pre-task-sync.md`：

1. `git fetch --all --prune`
2. 更新 `base_branch`
3. 同步当前任务分支
4. 检查是否存在高风险冲突

若同步失败或冲突高风险：

- 不继续编码
- 输出 `blocked_requires_human` 或 `failed_escalated`

---

## 阶段 3：装配最小上下文

只装配当前任务真正需要的信息：

- 当前任务描述
- 文档输入
- 依赖任务摘要
- 项目 manifest
- 当前 repo 代码状态

不要加载：

- 无关 issue 的完整历史
- 整个任务树全文
- 不相关的旧对话

---

## 阶段 4：执行实现

在 workspace 中完成：

- 代码实现
- 测试补充或更新
- 文档更新
- 必要的配置或脚本更新

执行中要始终遵守：

- 不越界实现无关需求
- 不同时处理多个无关问题
- 优先依据已有文档与 ADR 决策

---

## 阶段 5：执行中判断是否需要升级

若遇到问题，按以下顺序处理：

1. 先看文档 / ADR 是否已覆盖
2. 若已覆盖，按文档继续
3. 若未覆盖但属于低风险默认策略，继续并记录
4. 若涉及架构、接口、数据、安全、需求语义，升级为人工介入

典型升级结果：

- `blocked_requires_human`
- `blocked_requires_doc`
- `failed_escalated`

---

## 阶段 6：自验证

完成实现后，必须进行：

- 代码检查
- 测试执行
- 任务验收标准核对
- 文档更新核对

若验证未通过：

- 不应标记为 `completed`
- 根据情况输出 `failed_retryable` 或 `failed_escalated`

---

## 阶段 7：产出结果文件

### 1. 结构化 session 结果

必须写出：

- `session-result.yaml`
- 至少包含 `result_status`、`validation_status`、`human_gate_required`、`recommended_action`

### 2. 项目内执行摘要

必须写出：

- `docs/execution/<task-id>.md`

摘要应包含：

- 任务完成了什么
- 改了哪些范围
- 如何验证
- 是否有 follow-up
- 是否存在限制或风险

---

## 阶段 8：返回 orchestrator

`Execution Agent` 完成后，不直接决定全局调度。

应把以下内容交回：

- `session-result.yaml`
- 执行摘要
- 是否需要人工闸门
- 是否建议创建 follow-up issue

由 `Orchestrator Agent` 决定下一步：

- 归档
- 解锁下游
- 启动下一任务
- 转交 `Review / Merge Agent`

---

## 推荐状态输出

优先使用以下状态：

- `completed`
- `completed_with_followup`
- `blocked_requires_human`
- `blocked_requires_doc`
- `failed_retryable`
- `failed_escalated`

---

## 一个关键原则

`Execution Agent` 的成功标准不是“尽量多做事”，而是：

- 在清晰边界内稳定完成一个任务
- 在边界外及时停下并升级
- 让结果可验证、可回溯、可交接
