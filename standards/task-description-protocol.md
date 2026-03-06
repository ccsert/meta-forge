# 任务描述协议

## 目标

确保 VibeKanban 中每个执行性任务的描述本身就包含足够的关系索引信息，使 agent 在单个任务上下文中也能快速定位相关任务、判断依赖状态、决定是否继续。

## 核心原则

- 任务描述不仅是自然语言说明，也是轻量索引入口
- 即使 agent 当前只拿到一个 issue，也应能从描述中找到关键关联任务
- 任务描述中的 ID 信息应服务于“查询状态”和“判断是否继续”
- 描述中的关系索引是辅助信息，真实状态仍以 VibeKanban 当前数据为准

---

## 描述中应包含的最小索引

每个执行性任务建议在描述中显式写出：

- 当前任务 ID
- 父任务 ID
- 上游依赖任务 ID 列表
- 下游后继任务 ID 列表（如已知）
- 关联任务 ID 列表
- 补偿来源任务 ID（如有）
- 项目 ID
- Repo ID
- Workspace Scope

---

## 推荐字段

建议任务描述以固定结构包含以下字段：

- `Task ID`
- `Project ID`
- `Issue ID`
- `Execution Mode`
- `Workspace Launchable`
- `Execution Reason`
- `Parent`
- `Depends On`
- `Blocks / Blocked By`
- `Related Tasks`
- `Spawned From`
- `Repo Scope`
- `Repo ID`
- `Document Inputs`
- `Acceptance Criteria`
- `Execution Notes`

---

## 为什么任务描述里也要写 ID

因为 agent 在执行过程中常需要快速回答：

- 我是否还要继续？
- 我依赖的任务是否已经 done？
- 当前阻塞来自哪个任务？
- 如果我要创建 follow-up issue，它关联谁？
- 如果有多个相关任务，我应该查看哪些？

把这些关系索引写入任务描述，可以减少 agent 只靠模糊自然语言推断。

---

## 使用规则

- 描述中的 ID 必须是稳定标识，不要只写标题
- 若标题变化，ID 仍应可追踪
- agent 在判断是否继续时，应先依据描述中的关系索引定位，再以实时任务状态做最终判断
- 当依赖关系变化时，任务描述中的索引段也应同步更新

---

## 判断是否继续的最小步骤

agent 在执行任务时，若需要判断是否继续，建议按以下顺序：

1. 读取当前任务描述中的关系索引
2. 查询 `Depends On` 对应任务的实时状态
3. 查询 `Blocked By` 或相关冲突任务状态
4. 检查是否存在 `human_gate_required`
5. 决定：继续 / 暂停 / 请求人工 / 创建 follow-up issue

---

## 注意事项

- 描述中的索引段应简洁、稳定、可机器扫描
- 不要把整棵任务树塞进单个任务描述
- 只保留对当前任务判断最有帮助的直接关联 ID
