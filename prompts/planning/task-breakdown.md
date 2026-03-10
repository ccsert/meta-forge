# Prompt：任务拆解

## 元信息

| 字段 | 值 |
|------|----|
| ID | prompt-planning-001 |
| 版本 | v1.0 |
| 分类 | planning |
| 使用阶段 | 任务拆解 |
| 最后更新 | 2026-03-10 |

---

## 目的

根据已确认的 `project-definition.md` 和 `architecture-init.md`，产出结构化的任务树 `task-breakdown.md`，覆盖 Epic → Feature → Story → Task 四级层次。

---

## 使用时机

- 进入阶段 3（任务拆解）时
- `project-definition.md` 和 `architecture-init.md` 均已通过人工闸门
- 当前缺少 `task-breakdown.md`

前置条件：

- `project-definition.md` 已确认
- `architecture-init.md` 已确认

---

## 输入

- `project-definition.md`
- `architecture-init.md`
- `standards/task-relationship-model.md`
- `standards/task-execution-unit.md`
- `standards/document-baseline.md`
- `standards/dod.md`
- `templates/task-breakdown.md`

---

## Prompt 正文

```
你是一个项目规划专家，负责将项目定义与架构设计转化为结构化的任务拆解树。

当前任务：基于已确认的项目定义和架构文档，生成 `task-breakdown.md`。

拆解规则：

1. 使用四级层次：Epic → Feature → Story → Task
2. 每个节点使用固定 ID 格式：`EPIC-001`、`FEATURE-001`、`STORY-001`、`TASK-001`
3. 所有节点必须声明 `Parent`

对于每个执行性 Task，必须包含：
- Task ID
- Title
- Execution Mode（executable / non-executable / documentation / decision / planning）
- Workspace Launchable（true / false）
- Execution Reason
- Repo Scope
- Workspace Scope
- Inputs（文档输入列表）
- Expected Outputs
- Acceptance Criteria（可验证的条件列表）
- DoD Profile
- Depends On
- Blocked By
- Downstream Candidates
- Related To
- Spawned From
- Merge Policy
- Callback Policy
- Executor

关系规则：
- `parent_of` 只表示结构分解关系，不表示执行顺序
- `depends_on` 表示执行前置条件，是 ready task 判定的核心依据
- `blocks` 表示显式阻塞
- `relates_to` 表示信息关联，不参与调度
- `spawned_from` 表示补偿性任务来源

可执行任务准入检查：
- 目标是否明确且可在单 workspace 中闭环？
- 输入文档是否足够开始工作？
- 完成后能否独立验证？
- 出现冲突时能否判断升级策略？

如果上述任一答案为否，该任务应继续拆分或先补文档。

约束规则：
- 不要跳过 Epic/Feature/Story 直接展开大量 Task
- 每个 Task 的验收标准必须是可检验的具体条件
- 不接受模糊描述如"把 XX 做好"、"先搭个架子"
- 按模块优先排列，相同模块的 Task 应在结构上相邻
- 推荐首批 Task 解锁尽量少的依赖
```

---

## 输出格式

输出为完整的 `task-breakdown.md` 内容，遵循 `templates/task-breakdown.md` 的固定结构。

---

## 质量检查

- [ ] Epic / Feature / Story / Task 层级清晰
- [ ] 每个 Task 有明确验收标准
- [ ] `depends_on` 与 `parent_of` 已区分
- [ ] 每个执行性 Task 可在单 workspace 中独立闭环
- [ ] 每个执行性 Task 都有明确文档输入
- [ ] 风险任务已识别
- [ ] repo_scope 与文档输入已标注
