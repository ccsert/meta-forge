# 元仓库自动化编排蓝图

> 目标：让元仓库成为“项目孵化 + 任务编排 + 仓库初始化 + 开发执行 + 合并回流”的统一控制面。

---

## 1. 北极星目标

元仓库需要支持以下完整闭环：

1. 人与 AI 在元仓库中澄清业务需求
2. 基于 prompts / standards / playbooks / skills 产出业务项目初始文档
3. 自动创建 GitHub 仓库并完成本地初始化
4. 将设计文档注入业务仓库，作为后续开发上下文
5. 在元仓库中登记项目、仓库、VibeKanban 关联信息
6. 基于 VibeKanban 管理任务、依赖、子任务、阻塞关系
7. 通过 workspace session 拉起具体开发
8. 任务完成后触发回调、解锁后续任务或执行清理
9. 自动合并 worktree / workspace 代码；冲突按策略处理
10. 经验沉淀回元仓库，持续优化提示词工程

---

## 2. 系统边界

### 2.1 元仓库负责什么

- 定义流程：项目立项、架构设计、任务拆解、开发执行、合并回流
- 定义协议：项目元数据、任务元数据、依赖图、回调策略、合并策略
- 提供上下文：prompts、standards、templates、playbooks
- 记录映射：project_id、repo_id、workspace_id、issue_id、branch、PR、状态
- 作为自动化入口：驱动 gh、git、VibeKanban MCP、Codex

### 2.2 VibeKanban 负责什么

- 作为任务状态机
- 存储 issue、依赖、关联关系、负责人、标签
- 通过 workspace session 启动实际编码任务
- 提供任务流转与工作区关联能力

### 2.3 业务仓库负责什么

- 存放真实业务代码与文档
- 承载 AI 生成并持续维护的项目设计资产
- 执行测试、构建、CI/CD、部署

---

## 3. 建议的元仓库核心目录

```text
meta-forge/
  docs/
    meta-orchestration-blueprint.md
    roadmap.md
  playbooks/
    new-project.md
    run-task.md
    merge-workspace.md
  prompts/
    analysis/
    architecture/
    planning/
    execution/
    merge/
  standards/
    dod.md
    project-registry-schema.md
    task-relationship-model.md
    merge-policy.md
  templates/
    project-definition.md
    architecture-init.md
    task-breakdown.md
    project-manifest.yaml
    task-context.md
  projects/
    registry.yaml
    graph.yaml
```

其中：

- `registry.yaml` 管项目主档案
- `graph.yaml` 管跨项目/跨仓库依赖图
- `project-manifest.yaml` 作为单项目机器可读配置
- `task-relationship-model.md` 定义 VibeKanban issue 的关系映射语义

---

## 4. 核心对象模型

### 4.1 Project（项目）

建议项目至少包含：

- `id`：元仓库内部稳定 ID
- `name`
- `status`：planning / active / paused / archived
- `business_repo`：GitHub 仓库信息
- `vibekanban`：organization_id / project_id / board_id
- `docs`：PRD、架构文档、ADR、任务拆解路径
- `automation`：默认分支、初始化模板、合并策略、回调策略

### 4.2 Repo（仓库）

建议记录：

- `repo_id`：VibeKanban repo_id
- `github_owner`
- `github_name`
- `clone_path`
- `default_branch`
- `setup_script`
- `cleanup_script`
- `dev_server_script`

### 4.3 Task（任务）

建议在元仓库侧定义统一抽象，不直接依赖某个 UI 文案：

执行性任务必须满足一个额外前提：**可以在单独 workspace session 中独立执行并独立验证**。

- `task_type`：epic / feature / story / task / bug / chore
- `issue_id`
- `title`
- `acceptance_criteria`
- `dod_profile`
- `dependencies`
- `subtasks`
- `related_tasks`
- `repo_scope`
- `doc_inputs`
- `executor`
- `callback_policy`
- `merge_policy`
- `workspace_scope`
- `expected_outputs`

### 4.4 Workspace Run（执行实例）

用于跟踪一次 agent 执行：

- `workspace_id`
- `issue_id`
- `repo_id`
- `branch`
- `base_branch`
- `executor`
- `started_at`
- `ended_at`
- `result`
- `merge_result`
- `followup_issue_id`

---

## 5. 建议的端到端主流程

### 阶段 A：项目孵化

1. 在元仓库中通过对话澄清需求
2. 生成 `project-definition.md`
3. 生成 `architecture-init.md`
4. 生成 `task-breakdown.md`
5. 人工闸门确认

### 阶段 B：项目落库

1. 使用 `gh repo create` 创建 GitHub 仓库
2. 本地初始化仓库骨架
3. 注入设计文档：`docs/project-definition.md`、`docs/architecture/`、`docs/adrs/`
4. 首次提交并推送
5. 在 VibeKanban 中登记 repo，并写入 setup / cleanup / dev server script
6. 回写元仓库 `projects/registry.yaml`

### 阶段 C：任务入板

1. 按 `task-breakdown.md` 创建 Epic / Feature / Story / Task
2. 只将满足单 workspace 闭环条件的条目创建为执行性任务
3. 建立 issue 关系：依赖、父子、关联、阻塞
4. 将 issue_id 映射写回项目清单或任务索引
5. 根据 ready 状态挑选任务进入执行

### 阶段 D：任务执行

1. 读取 ready issue
2. 组装任务上下文：任务卡 + 依赖结果 + 文档基线 + prompts + standards
3. 调用 `start_workspace_session`
4. 在工作区完成编码、测试、文档更新
5. 更新 issue 状态

### 阶段 E：收尾回调

任务 done 后触发：

1. 执行 repo cleanup script 或元仓库约定清理动作
2. 扫描依赖图，查找被该任务解锁的后续任务
3. 若后续任务满足条件，则自动创建/启动下一次 workspace session
4. 记录执行日志与结果

### 阶段 F：合并与冲突处理

1. 尝试自动合并工作分支
2. 若可自动解决且不影响语义，则 agent 自行处理并验证
3. 若冲突涉及架构、接口、迁移或需求歧义，则创建新 issue
4. 新 issue 必须回填：冲突文件、原因、建议决策、阻塞对象

---

## 6. VibeKanban 关系映射建议

建议先在元仓库中定义统一关系语义，再映射到 VibeKanban：

- `parent_of`：父子层级
- `depends_on`：前置依赖
- `blocks`：阻塞关系
- `relates_to`：弱关联
- `spawned_from`：由某次合并冲突或回调生成

原则：

- 一个可执行开发任务必须具备明确 `depends_on`
- `subtask` 只表达分解，不自动表达依赖
- 依赖与父子关系必须分开记录
- 冲突补偿 issue 必须带 `spawned_from`

---

## 7. 回调机制建议

你提到的“任务完成后的回调”建议不要只依赖 prompt，而要分两层：

### 7.1 Repo 层回调

利用 VibeKanban repo 的 `cleanup_script`：

适合执行：

- 停止 dev server
- 清理临时文件
- 收尾日志
- 归档构建产物

### 7.2 Orchestrator 层回调

由元仓库 playbook / script 负责：

- 查询当前 issue 是否 done
- 查询后继依赖是否全部满足
- 自动更新后续 issue 状态
- 自动启动下一 workspace session
- 创建 follow-up issue

结论：

- `cleanup_script` 只做本地工作区清理
- “解锁下一个任务”“自动拉起新任务”应该由元仓库 orchestration 层负责

---

## 8. 合并策略建议

建议定义三级策略：

### 8.1 `auto-merge`

适用于：

- 文档改动
- 低风险局部代码改动
- 通过测试且无冲突

### 8.2 `agent-resolve`

适用于：

- 轻微文本冲突
- 明显可机械解决的代码冲突
- 解决后可通过测试验证

### 8.3 `escalate-issue`

适用于：

- DB migration 冲突
- 公共接口语义冲突
- 需求理解冲突
- 多任务并发改动同一核心模块

当进入 `escalate-issue`：

- 创建新 issue
- 关联原 issue
- 标记阻塞链路
- 产出冲突分析摘要

---

## 9. 现阶段最值得优先补的能力

按优先级建议如下：

### P0：先把协议定清楚

1. 项目注册表 schema
2. 项目级机器清单 `project-manifest.yaml`
3. 任务关系模型
4. 合并策略
5. 回调策略

### P1：打通新项目创建闭环

1. new-project playbook 补成“可执行版”
2. 定义 gh 创建仓库流程
3. 定义业务仓库初始化注入内容
4. 定义 registry 回写规则
5. 定义 repo_id / issue_id / workspace_id 的持久化位置

### P2：打通任务执行闭环

1. 从 task-breakdown 生成 issue
2. 批量建立依赖关系
3. 选择 ready task
4. 启动 workspace session
5. 任务完成后自动回调

### P3：打通自动合并闭环

1. 检测 workspace 完成状态
2. 自动 merge / rebase
3. 冲突分类
4. 可解冲突自动修复
5. 不可解冲突自动建 issue

---

## 10. 建议的第一批落地文件

为了让这个仓库从“概念”进入“可执行”，建议先补齐：

1. `standards/project-registry-schema.md`
2. `standards/task-relationship-model.md`
3. `standards/merge-policy.md`
4. `standards/callback-policy.md`
5. `templates/project-manifest.yaml`
6. `playbooks/merge-workspace.md`
7. `docs/roadmap.md`

这 6 个文件会把你现在口头描述的关键协议固定下来。

---

## 11. 推荐执行顺序

### Sprint 1：协议层
- 固化 registry schema
- 固化 task relationship model
- 固化 merge policy
- 固化 project manifest template

### Sprint 2：项目初始化层
- 完善 new-project playbook
- 接入 gh repo create
- 接入项目文档注入
- 接入 registry 持久化

### Sprint 3：任务编排层
- task-breakdown → VibeKanban issue
- issue relationship 建立
- ready task 选择策略
- workspace session 启动

### Sprint 4：执行闭环层
- cleanup callback
- downstream task unlock
- auto merge
- merge conflict issue 补偿

---

## 12. 一个关键判断

你现在最缺的不是 prompt 数量，而是“协议稳定层”。

如果没有稳定的：

- 项目清单结构
- 任务关系模型
- 回调触发点
- 合并冲突分类标准
- ID 持久化规则

那么后面 prompt 再多，也会因为状态不可追踪而失控。

所以当前最正确的方向是：

> 先把元仓库升级为“协议驱动的编排系统”，再去扩 prompt 和自动化脚本。

---

## 13. 两条新增约束

### 13.1 执行性任务必须是单工作空间执行单元

一个进入 VibeKanban 并准备被 agent 执行的任务，必须满足：

- 单 workspace 可完成
- 单 workspace 可验证
- 输入文档充分
- 改动边界明确

否则它不应被直接创建为执行任务，而应先继续拆解或补文档。

### 13.2 项目必须先建立文档基线

项目在大规模创建执行性任务前，至少应有：

- `project-definition.md`
- `architecture-init.md`
- `task-breakdown.md`
- ADR / 关键决策记录
- `project-manifest.yaml`

文档基线不足时，优先创建文档型任务，而不是代码型任务。
