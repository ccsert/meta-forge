# 操作总检查单

> 用一页清单串起元仓库当前的完整工作流，作为日常操作入口。

## 0. AI 启动检查单

- [ ] 先读取 `AI_ENTRYPOINT.md`
- [ ] 判断当前阶段
- [ ] 选择当前 agent 角色
- [ ] 只加载当前阶段最小上下文包
- [ ] 不默认读取整个仓库

## 1. 新项目创建检查单

参考：`playbooks/new-project.md`

- [ ] 完成 `project-definition.md`
- [ ] 完成 `architecture-init.md`
- [ ] 完成 `task-breakdown.md`
- [ ] 确认文档基线满足要求，参考 `standards/document-baseline.md`
- [ ] 创建 GitHub 仓库
- [ ] 初始化本地项目骨架
- [ ] 注入核心文档与 `project-manifest.yaml`
- [ ] 初始化业务仓库 `docs/meta/issue-map.yaml` 主副本
- [ ] 在 `projects/registry.yaml` 中登记项目
- [ ] 在 `projects/graph.yaml` 中登记依赖图节点
- [ ] 绑定 VibeKanban repo / project / board 信息

## 2. 创建 VibeKanban 任务检查单

参考：`playbooks/create-vibekanban-issues.md`

- [ ] 每个任务都有稳定 `Task ID`
- [ ] 每个任务都声明 `Execution Mode`
- [ ] 每个任务都声明 `Workspace Launchable`
- [ ] 每个任务都声明 `Execution Reason`
- [ ] 每个执行性任务具备文档输入、验收标准、repo scope
- [ ] 先生成 batch 清单
- [ ] 先创建 issue 节点
- [ ] 回写 `task_id -> issue_id` 映射
- [ ] 更新持久化 `issue-map.yaml`，避免重复创建
- [ ] 建立 `parent_of` / `depends_on` / `blocks` / `relates_to` / `spawned_from`
- [ ] 生成可执行任务池

## 3. 启动任务前检查单

参考：`playbooks/run-task.md`、`playbooks/pre-task-sync.md`

- [ ] 当前任务是执行性任务
- [ ] `Execution Mode = executable`
- [ ] `Workspace Launchable = true`
- [ ] 当前任务可在单 workspace 中闭环
- [ ] 文档输入齐全
- [ ] `depends_on` 全部满足
- [ ] 无未决人工闸门
- [ ] 已执行 `git fetch --all --prune`
- [ ] `base_branch` 已同步到远程最新
- [ ] 当前任务分支已同步基线

## 4. 任务执行中检查单

参考：`docs/session-orchestration.md`

- [ ] 优先依据文档与 ADR 执行，不依赖口头上下文
- [ ] 遇到不确定性先自判，再决定是否升级
- [ ] 若涉及架构/接口/数据/安全/需求语义，进入人工闸门
- [ ] 持续维护任务描述中的关系索引是否仍有效
- [ ] 若发现依赖变化，更新任务描述与关系记录

## 5. 任务结束检查单

参考：`playbooks/merge-workspace.md`、`standards/dod.md`

- [ ] 满足任务验收标准
- [ ] 完成单 workspace 自验证
- [ ] 相关测试通过
- [ ] 文档已更新
- [ ] 输出 `session-result.yaml`
- [ ] 写入业务仓库 `docs/execution/<task-id>.md`
- [ ] 需要时执行 merge 或冲突分流
- [ ] 需要时创建 follow-up issue

## 6. 编排下一任务检查单

参考：`playbooks/orchestrate-next-task.md`

- [ ] 读取当前 session result
- [ ] 判断当前任务是否允许进入后续编排
- [ ] 查询下游候选任务
- [ ] 筛选 ready task
- [ ] 根据 callback policy 决定停止 / 解锁 / 自动启动
- [ ] 归档运行结果到元仓库 `runs/`
- [ ] 更新可执行任务池
- [ ] 记录新旧 session 链路

## 7. 默认决策原则

- 默认采用 `unlock-next-on-done`
- 默认不自动连续启动多个任务
- 只有唯一 ready 且低风险任务才考虑自动启动
- 在板上的任务不一定可执行
- 可执行性必须显式标识，不能靠猜
