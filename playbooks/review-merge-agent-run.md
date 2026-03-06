# Playbook：Review / Merge Agent 执行流

## 目标

定义 `Review / Merge Agent` 如何对单次任务结果进行复核、合并判断、冲突分流与后续建议输出。

## 适用范围

适用于：

- 任务已完成并返回 `session-result.yaml`
- 需要进行 DoD 复核
- 需要判断 merge 是否可执行
- 需要处理冲突或生成 follow-up 建议

不适用于：

- 需求澄清
- 架构设计
- 任务拆解
- 大范围重新实现

---

## 运行边界

`Review / Merge Agent` 必须遵守：

- 一次只审核一个任务结果
- 只针对当前 merge / conflict 上下文工作
- 不回头修改需求边界
- 不扩大任务实现范围

---

## 输入

- 当前任务 diff
- 测试 / lint / typecheck 结果
- `session-result.yaml`
- `docs/execution/<task-id>.md`
- merge policy
- DoD
- 当前分支与基线分支状态

---

## 输出

- merge decision
- conflict classification
- merge result 摘要
- follow-up issue 建议
- 是否可交回 orchestrator 继续推进

---

## 阶段 1：复核任务完成度

首先检查：

- 当前任务验收标准是否满足
- `session-result.yaml` 是否完整
- 执行摘要是否已写入
- DoD 是否满足

若不满足：

- 不进入 merge
- 输出复核失败原因
- 返回 `Execution Agent` 或 `Orchestrator Agent`

---

## 阶段 2：检查验证结果

必须确认：

- 关键测试结果
- lint / typecheck 结果（如适用）
- 文档更新状态
- 是否存在显式豁免

若验证失败：

- 不可标记为可安全合并
- 视情况给出 `failed_retryable` 或 `failed_escalated` 建议

---

## 阶段 3：判断 merge readiness

根据当前结果判断：

- 是否已达到 `merge_readiness = ready`
- 是否存在未解决冲突
- 是否需要先同步最新基线再判断

若尚未 ready：

- 不强行 merge
- 输出阻塞原因

---

## 阶段 4：冲突分类

若出现冲突，按 `standards/merge-policy.md` 分类：

### 可自动解决
- 文档冲突
- 轻量机械性文本冲突
- 局部低风险代码冲突

### 必须升级 issue
- DB migration 冲突
- 公共接口契约冲突
- 安全策略冲突
- 架构边界冲突
- 核心模块语义冲突

必须输出：

- 冲突分类
- 影响范围
- 处理策略
- 验证结果
- 是否建议 follow-up issue

---

## 阶段 5：给出 merge decision

建议仅输出以下决策之一：

- `auto-merge`
- `agent-resolve`
- `escalate-issue`
- `return-for-fix`

说明：

- `auto-merge`：无冲突且验证通过
- `agent-resolve`：冲突轻量且可验证
- `escalate-issue`：高风险冲突或语义冲突
- `return-for-fix`：任务结果本身未达到可合并标准

---

## 阶段 6：输出 follow-up 建议

若需要 follow-up：

- 明确建议创建新 issue
- 指明来源 issue
- 指明阻塞对象
- 指明后续建议动作

不要只写模糊的“后续再看”。

---

## 阶段 7：交回 orchestrator

复核完成后，把以下内容交回：

- merge decision
- conflict classification
- follow-up 建议
- merge result 摘要

由 `Orchestrator Agent` 决定：

- 是否执行 merge
- 是否创建 follow-up issue
- 是否继续编排下一任务

---

## 一个关键原则

`Review / Merge Agent` 的作用不是“尽量把所有冲突都自己吞掉”，而是：

- 把低风险冲突快速消化
- 把高风险冲突准确分流
- 让 merge 成为可审计、可回溯、可中断的过程
