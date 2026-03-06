# 元仓库路线图

## Phase 1：协议固化

- [x] 固化项目注册表 schema
- [x] 固化 project manifest 模板
- [x] 固化任务关系模型
- [x] 固化 merge policy
- [x] 定义回调策略文档

## Phase 2：项目创建闭环

- [x] 完善 `playbooks/new-project.md`
- [x] 定义 `gh repo create` 标准流程
- [x] 定义业务仓库初始化注入清单
- [x] 定义 registry 回写动作
- [x] 定义 repo_id 持久化规则

## Phase 3：任务编排闭环

- [x] 定义 task-breakdown 到 issue 的映射
- [x] 定义 issue relationship 创建顺序
- [x] 定义 ready task 选择规则
- [x] 定义 workspace session 启动协议

## Phase 4：执行与回流闭环

- [x] 定义 cleanup callback
- [x] 定义自动解锁下游任务
- [x] 定义自动 merge 与冲突补偿
- [ ] 定义经验回流机制


## Phase 5：脚本化执行层

- [x] 定义脚本接口协议
- [ ] 实现 `generate-issue-batch`
- [ ] 实现 `render-issue-description`
- [ ] 实现 `archive-session-result`
- [ ] 接入 VibeKanban MCP
