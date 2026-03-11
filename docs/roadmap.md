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
- [x] 定义经验回流机制（`playbooks/experience-feedback.md`）

## Phase 5：脚本化执行层

- [x] 定义脚本接口协议
- [x] 实现 `generate-issue-batch`
- [x] 实现 `render-issue-description`
- [x] 实现 `archive-session-result`
- [x] 实现 `select-ready-task`
- [ ] 接入 VibeKanban MCP 端到端验证

## Phase 6：文档与模板完善

- [x] 补全 `prompts/` 目录（analysis / architecture / planning / implementation / review）
- [x] 补全 `templates/`（project-definition / tech-design / adr / prd）
- [x] 补全 `standards/`（coding / api / db）
- [x] 创建 `generators/` 项目脚手架目录
- [x] 补全 VibeKanban MCP 工具参考文档
- [x] 定义 issue-map 多副本同步协议
- [x] 定义 Agent 交接信号协议
- [x] 整合 Skills 体系到 AI_ENTRYPOINT.md

## Phase 7：自动化增强

- [x] 实现 `check-stage-ready` 阶段就绪验证脚本
- [x] 实现 `orchestrate-next-task` 编排下一个任务脚本
- [x] 实现 `project-status` 项目状态仪表盘脚本
- [x] 实现 `meta-cli` 统一 CLI 入口
- [x] 更新 `script-interfaces.md` 补全新脚本接口文档
- [x] 更新 `AI_ENTRYPOINT.md` 添加自然语言意图映射表
- [x] 修复 `OPERATING_MODEL.md` 幻影引用
- [ ] 实现从 VibeKanban 自动拉取最新任务状态快照
- [ ] 实现端到端 MCP issue 创建 + 关系建立 + 映射回写自动化
- [ ] 实现经验回流的半自动化（模板 + 脚本辅助）
- [ ] 实现 generator 脚本化（变量替换 + 目录创建）
