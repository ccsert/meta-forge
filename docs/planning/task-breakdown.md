# 任务拆解：小红书 AI 草稿投递平台

## 元信息

- Project ID: `xhs-draft-platform`
- Issue ID: `TBD`
- Version: `v1`
- Generated At: `2026-03-07`

## 拆解原则

- 先验证核心链路，再扩展能力边界
- 优先创建可在单 workspace 中闭环的执行性任务
- 先文档与骨架，后集成与自动化
- 先单账号稳定性，后多账号调度
- 先强约束去重，后复杂策略优化

---

## Epic Tree

### Epic: `EPIC-001`
- Goal: 建立项目可开发骨架与基础领域模型，为后续草稿投递与 AI 编排提供稳定基础。
- Acceptance:
  - [ ] 业务仓基础技术栈可启动
  - [ ] 前后端与 worker 结构清晰
  - [ ] 数据模型与基础设施选型可落地
- Children:
  - `FEATURE-001`
  - `FEATURE-002`
  - `FEATURE-003`

### Feature: `FEATURE-001`
- Parent: `EPIC-001`
- Goal: 初始化轻量化业务仓骨架。
- Acceptance:
  - [ ] `Hono` API 可启动
  - [ ] `React 19 + Vite + shadcn/ui` Web 可启动
  - [ ] worker 进程骨架已建立
- Children:
  - `STORY-001`
  - `STORY-002`

### Story: `STORY-001`
- Parent: `FEATURE-001`
- Goal: 搭建后端与 worker 基础骨架。
- Acceptance:
  - [ ] API 与 worker 项目结构建立完成
  - [ ] 本地开发命令与环境变量样例可用
- Children:
  - `TASK-001`
  - `TASK-002`

### Task: `TASK-001`
- Parent: `STORY-001`
- Task ID: `TASK-001`
- Title: 初始化 `Hono` API 服务骨架与基础路由
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单模块基础搭建任务
- Repo Scope: `apps/api`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - API 项目骨架
  - 健康检查路由
  - 环境变量样例
  - README 启动说明
- Acceptance Criteria:
  - [ ] `Hono` API 项目可启动
  - [ ] 存在基础路由分层结构
  - [ ] 提供健康检查接口
  - [ ] 提供 `.env.example` 与运行说明
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On: []
- Blocked By: []
- Downstream Candidates:
  - `TASK-002`
  - `TASK-003`
  - `TASK-005`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Task: `TASK-002`
- Parent: `STORY-001`
- Task ID: `TASK-002`
- Title: 初始化 worker 进程骨架与队列接入基础设施
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单模块基础搭建任务
- Repo Scope: `apps/worker`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - worker 项目骨架
  - 队列消费入口
  - 基础日志能力
- Acceptance Criteria:
  - [ ] worker 进程可独立启动
  - [ ] 可连接 `Redis`
  - [ ] 具备草稿任务队列消费入口
  - [ ] 基础日志输出规范已建立
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-001`
- Blocked By: []
- Downstream Candidates:
  - `TASK-008`
  - `TASK-010`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Story: `STORY-002`
- Parent: `FEATURE-001`
- Goal: 搭建管理后台基础骨架。
- Acceptance:
  - [ ] 管理后台可启动
  - [ ] 基础布局、导航、页面占位已建立
- Children:
  - `TASK-003`

### Task: `TASK-003`
- Parent: `STORY-002`
- Task ID: `TASK-003`
- Title: 初始化 `React 19 + Vite + shadcn/ui` 管理后台骨架
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单模块基础搭建任务
- Repo Scope: `apps/web`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - Web 项目骨架
  - 基础布局与导航
  - 任务、账号、素材页面占位
- Acceptance Criteria:
  - [ ] Web 项目可启动
  - [ ] 已接入 `shadcn/ui`
  - [ ] 存在基础布局与导航
  - [ ] 至少提供账号列表、任务列表、素材列表页面占位
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-001`
- Blocked By: []
- Downstream Candidates:
  - `TASK-012`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Feature: `FEATURE-002`
- Parent: `EPIC-001`
- Goal: 建立数据模型与基础存储结构。
- Acceptance:
  - [ ] 账号、素材、任务、通知等核心实体已定义
  - [ ] 数据库迁移与基础仓储层可落地
- Children:
  - `STORY-003`
  - `STORY-004`

### Story: `STORY-003`
- Parent: `FEATURE-002`
- Goal: 落库核心实体模型。
- Acceptance:
  - [ ] 核心表结构清晰
  - [ ] 基础迁移可运行
- Children:
  - `TASK-004`
  - `TASK-005`

### Task: `TASK-004`
- Parent: `STORY-003`
- Task ID: `TASK-004`
- Title: 设计并实现用户、账号、画像基础数据模型
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单领域模型任务
- Repo Scope: `packages/db` 或 `apps/api/src/modules/accounts`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 用户与账号相关表结构
  - 画像表结构
  - 基础仓储接口或 ORM schema
- Acceptance Criteria:
  - [ ] 定义 `users`
  - [ ] 定义 `xhs_accounts`
  - [ ] 定义 `content_profiles`
  - [ ] 支持账号与用户归属关系
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-001`
- Blocked By: []
- Downstream Candidates:
  - `TASK-006`
  - `TASK-008`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Task: `TASK-005`
- Parent: `STORY-003`
- Task ID: `TASK-005`
- Title: 设计并实现素材、草稿任务、通知基础数据模型
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单领域模型任务
- Repo Scope: `packages/db` 或 `apps/api/src/modules/assets`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 素材与使用记录表结构
  - 草稿任务与草稿快照表结构
  - 登录事件与通知日志表结构
- Acceptance Criteria:
  - [ ] 定义 `media_assets`
  - [ ] 定义 `media_usage_logs`
  - [ ] 定义 `post_tasks` 与 `post_drafts`
  - [ ] 定义 `login_events` 与 `notification_logs`
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-001`
- Blocked By: []
- Downstream Candidates:
  - `TASK-007`
  - `TASK-009`
  - `TASK-011`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Story: `STORY-004`
- Parent: `FEATURE-002`
- Goal: 建立基础 API 读写能力。
- Acceptance:
  - [ ] 账号与素材基础 API 可用
  - [ ] 草稿任务创建与查询 API 可用
- Children:
  - `TASK-006`
  - `TASK-007`

### Task: `TASK-006`
- Parent: `STORY-004`
- Task ID: `TASK-006`
- Title: 实现账号与内容画像管理 API
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单领域 API 任务
- Repo Scope: `apps/api/src/modules/accounts`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 账号创建、列表、详情、画像配置 API
  - DTO 与基础校验
- Acceptance Criteria:
  - [ ] 可创建账号
  - [ ] 可查询账号列表与详情
  - [ ] 可配置账号画像
  - [ ] 返回结构清晰稳定
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-004`
- Blocked By: []
- Downstream Candidates:
  - `TASK-012`
  - `TASK-014`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Task: `TASK-007`
- Parent: `STORY-004`
- Task ID: `TASK-007`
- Title: 实现素材上传、列表与任务创建基础 API
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单领域 API 任务
- Repo Scope: `apps/api/src/modules/assets` 与 `apps/api/src/modules/tasks`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 素材上传与查询 API
  - 草稿任务创建与查询 API
- Acceptance Criteria:
  - [ ] 可上传素材元数据并持久化
  - [ ] 可查询素材列表
  - [ ] 可创建草稿任务
  - [ ] 可查询草稿任务状态
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-005`
- Blocked By: []
- Downstream Candidates:
  - `TASK-009`
  - `TASK-012`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Feature: `FEATURE-003`
- Parent: `EPIC-001`
- Goal: 建立开发与部署基础设施。
- Acceptance:
  - [ ] 本地联调方式清晰
  - [ ] 基础质量检查命令建立
- Children:
  - `STORY-005`

### Story: `STORY-005`
- Parent: `FEATURE-003`
- Goal: 建立本地运行与质量校验基础。
- Acceptance:
  - [ ] 本地开发脚本可用
  - [ ] lint / typecheck / test 命令初步建立
- Children:
  - `TASK-008`

### Task: `TASK-008`
- Parent: `STORY-005`
- Task ID: `TASK-008`
- Title: 建立本地开发脚本与基础质量检查链路
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 工程基础任务
- Repo Scope: `package.json` 与项目根配置
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 本地启动脚本
  - lint / typecheck / test 命令
  - README 开发说明
- Acceptance Criteria:
  - [ ] 可通过统一命令启动开发环境
  - [ ] 存在 lint 命令
  - [ ] 存在 typecheck 命令
  - [ ] 存在基础 test 命令或测试约定
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-002`
  - `TASK-003`
- Blocked By: []
- Downstream Candidates:
  - `TASK-016`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

---

### Epic: `EPIC-002`
- Goal: 打通“单账号 AI 图文生成并写入小红书草稿”的 MVP 主链路。
- Acceptance:
  - [ ] 单账号草稿任务可从创建走到成功
  - [ ] 登录失效时可通知并恢复
  - [ ] 图片使用记录可正确写入
- Children:
  - `FEATURE-004`
  - `FEATURE-005`
  - `FEATURE-006`

### Feature: `FEATURE-004`
- Parent: `EPIC-002`
- Goal: 验证 Playwright 单账号草稿写入链路。
- Acceptance:
  - [ ] Playwright 会话可复用
  - [ ] 能检测未登录状态并生成二维码截图
  - [ ] 能成功保存图文草稿
- Children:
  - `STORY-006`
  - `STORY-007`

### Story: `STORY-006`
- Parent: `FEATURE-004`
- Goal: 建立账号会话与登录恢复基础能力。
- Acceptance:
  - [ ] 持久化 session 目录策略落地
  - [ ] 登录检查与二维码截图可用
- Children:
  - `TASK-009`
  - `TASK-010`

### Task: `TASK-009`
- Parent: `STORY-006`
- Task ID: `TASK-009`
- Title: 实现 Playwright 账号会话持久化与登录态检测
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单条执行链路核心任务
- Repo Scope: `apps/worker/src/playwright`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 账号 session 管理器
  - 登录态检测逻辑
  - 基础截图能力
- Acceptance Criteria:
  - [ ] 每个账号使用独立持久化目录
  - [ ] 可检测是否进入登录页或扫码页
  - [ ] 可输出二维码区域截图或登录态异常截图
  - [ ] 会话信息可供后续任务复用
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-002`
  - `TASK-005`
- Blocked By: []
- Downstream Candidates:
  - `TASK-010`
  - `TASK-013`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Task: `TASK-010`
- Parent: `STORY-006`
- Task ID: `TASK-010`
- Title: 实现登录事件状态流转与任务恢复机制
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单链路任务恢复能力建设
- Repo Scope: `apps/worker/src/jobs` 与 `apps/api/src/modules/login-events`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 登录事件状态机
  - 扫码等待与恢复逻辑
  - 任务超时处理逻辑
- Acceptance Criteria:
  - [ ] 未登录任务可标记为 `waiting_scan`
  - [ ] 登录成功后可恢复原任务
  - [ ] 超时任务可标记为人工介入
  - [ ] 关键状态变化有日志记录
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-009`
- Blocked By: []
- Downstream Candidates:
  - `TASK-013`
  - `TASK-015`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Story: `STORY-007`
- Parent: `FEATURE-004`
- Goal: 建立保存草稿的页面自动化能力。
- Acceptance:
  - [ ] 支持上传图片与填写文案
  - [ ] 支持保存草稿并记录执行结果
- Children:
  - `TASK-011`

### Task: `TASK-011`
- Parent: `STORY-007`
- Task ID: `TASK-011`
- Title: 实现小红书图文上传与保存草稿 Playwright 执行器
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 核心业务自动化任务
- Repo Scope: `apps/worker/src/playwright`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 图文上传执行器
  - 标题正文填写逻辑
  - 草稿保存结果回写逻辑
- Acceptance Criteria:
  - [ ] 支持多图上传
  - [ ] 支持填写标题与正文
  - [ ] 支持等待图片处理完成后保存草稿
  - [ ] 成功与失败均回写任务状态与截图
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-009`
  - `TASK-005`
- Blocked By: []
- Downstream Candidates:
  - `TASK-015`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Feature: `FEATURE-005`
- Parent: `EPIC-002`
- Goal: 建立 AI 图文生成与素材分配链路。
- Acceptance:
  - [ ] 生成标题、正文、标签与图片组合
  - [ ] 能执行账号级与用户级素材去重
- Children:
  - `STORY-008`
  - `STORY-009`

### Story: `STORY-008`
- Parent: `FEATURE-005`
- Goal: 建立 AI 内容生成流程。
- Acceptance:
  - [ ] 存在结构化 AI 输出
  - [ ] 支持基于画像和主题生成候选文案
- Children:
  - `TASK-012`

### Task: `TASK-012`
- Parent: `STORY-008`
- Task ID: `TASK-012`
- Title: 基于 `Mastra` 实现图文内容生成编排器
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单领域 AI 编排任务
- Repo Scope: `apps/api/src/modules/content` 或 `packages/ai`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - AI 编排服务
  - 固定输出 schema
  - 草稿内容快照落库逻辑
- Acceptance Criteria:
  - [ ] 可输入账号画像与主题生成内容
  - [ ] 输出至少包含标题、正文、标签建议
  - [ ] 输出结构经过 schema 校验
  - [ ] 可将生成结果保存为草稿快照
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-003`
  - `TASK-006`
  - `TASK-007`
- Blocked By: []
- Downstream Candidates:
  - `TASK-014`
  - `TASK-015`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Story: `STORY-009`
- Parent: `FEATURE-005`
- Goal: 建立素材去重与分配逻辑。
- Acceptance:
  - [ ] 实现账号级去重
  - [ ] 实现用户级近期去重
  - [ ] 形成最终图片候选组合
- Children:
  - `TASK-013`

### Task: `TASK-013`
- Parent: `STORY-009`
- Task ID: `TASK-013`
- Title: 实现素材哈希、使用记录与去重分配服务
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单领域规则实现任务
- Repo Scope: `apps/api/src/modules/assets` 或 `packages/domain-assets`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 文件哈希与感知哈希处理逻辑
  - 使用记录查询能力
  - 去重分配服务
- Acceptance Criteria:
  - [ ] 可记录文件哈希与感知哈希
  - [ ] 同账号已使用图片会被过滤
  - [ ] 同用户近期已使用图片会被高优先级过滤或降权
  - [ ] 可输出满足数量要求的图片候选结果
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-005`
  - `TASK-009`
- Blocked By: []
- Downstream Candidates:
  - `TASK-015`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Feature: `FEATURE-006`
- Parent: `EPIC-002`
- Goal: 打通二维码通知与端到端草稿任务闭环。
- Acceptance:
  - [ ] 未登录可通知用户扫码
  - [ ] 草稿任务能完整从创建走到成功或待人工处理
- Children:
  - `STORY-010`
  - `STORY-011`

### Story: `STORY-010`
- Parent: `FEATURE-006`
- Goal: 建立通知发送能力。
- Acceptance:
  - [ ] 支持至少一个通知渠道
  - [ ] 可发送二维码截图与任务信息
- Children:
  - `TASK-014`

### Task: `TASK-014`
- Parent: `STORY-010`
- Task ID: `TASK-014`
- Title: 实现登录二维码通知 Provider 与发送日志
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单渠道通知任务
- Repo Scope: `apps/api/src/modules/notifications` 或 `packages/notifications`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
- Expected Outputs:
  - 通知 provider 抽象
  - 首个通知渠道实现
  - 发送日志与失败回写
- Acceptance Criteria:
  - [ ] 支持发送二维码图片或链接
  - [ ] 支持发送账号名与任务信息
  - [ ] 发送成功/失败均落日志
  - [ ] 渠道实现可替换扩展
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-006`
  - `TASK-010`
- Blocked By: []
- Downstream Candidates:
  - `TASK-015`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Story: `STORY-011`
- Parent: `FEATURE-006`
- Goal: 完成 MVP 端到端整合。
- Acceptance:
  - [ ] 单账号端到端可跑通
  - [ ] 关键状态可在后台查看
- Children:
  - `TASK-015`

### Task: `TASK-015`
- Parent: `STORY-011`
- Task ID: `TASK-015`
- Title: 打通单账号草稿任务端到端闭环并完成验收
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单条 MVP 主链路集成任务
- Repo Scope: `apps/api` + `apps/worker` + `apps/web`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
  - `docs/planning/task-breakdown.md`
- Expected Outputs:
  - 单账号完整执行链路
  - 基础任务状态展示
  - MVP 验收记录
- Acceptance Criteria:
  - [ ] 可创建单账号草稿任务
  - [ ] 可生成内容并分配图片
  - [ ] 未登录时可发送二维码通知
  - [ ] 登录后可恢复并保存草稿
  - [ ] 关键状态可被查询和展示
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-011`
  - `TASK-012`
  - `TASK-013`
  - `TASK-014`
- Blocked By: []
- Downstream Candidates:
  - `TASK-016`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

---

### Epic: `EPIC-003`
- Goal: 提升多账号执行稳定性、可观测性与运营可用性。
- Acceptance:
  - [ ] 多账号任务可调度
  - [ ] 后台可查看关键执行状态
  - [ ] 失败任务可重试与诊断
- Children:
  - `FEATURE-007`
  - `FEATURE-008`

### Feature: `FEATURE-007`
- Parent: `EPIC-003`
- Goal: 实现多账号调度与稳定性增强。
- Acceptance:
  - [ ] 同账号串行执行
  - [ ] 支持失败重试、限速与人工介入
- Children:
  - `STORY-012`

### Story: `STORY-012`
- Parent: `FEATURE-007`
- Goal: 强化队列调度与任务恢复策略。
- Acceptance:
  - [ ] 多账号并发策略可控
  - [ ] 失败与超时处理清晰
- Children:
  - `TASK-016`

### Task: `TASK-016`
- Parent: `STORY-012`
- Task ID: `TASK-016`
- Title: 实现多账号队列调度、限速、重试与人工介入机制
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 稳定性增强任务
- Repo Scope: `apps/worker/src/jobs` 与 `apps/api/src/modules/tasks`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
  - `docs/planning/task-breakdown.md`
- Expected Outputs:
  - 多账号调度策略
  - 重试与限速配置
  - 人工介入状态与处理入口
- Acceptance Criteria:
  - [ ] 同账号任务不会并行执行
  - [ ] 可配置任务重试次数与退避策略
  - [ ] 可标记任务为人工介入
  - [ ] 可查看失败原因与最近执行记录
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-008`
  - `TASK-015`
- Blocked By: []
- Downstream Candidates:
  - `TASK-017`
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

### Feature: `FEATURE-008`
- Parent: `EPIC-003`
- Goal: 增强管理后台的运营可见性。
- Acceptance:
  - [ ] 提供任务详情、账号状态、通知记录等核心页面
  - [ ] 支持查看执行截图与关键日志摘要
- Children:
  - `STORY-013`

### Story: `STORY-013`
- Parent: `FEATURE-008`
- Goal: 完善后台任务与账号监控视图。
- Acceptance:
  - [ ] 提供任务详情与状态流展示
  - [ ] 提供账号登录健康状态展示
- Children:
  - `TASK-017`

### Task: `TASK-017`
- Parent: `STORY-013`
- Task ID: `TASK-017`
- Title: 实现任务详情、账号状态与通知记录后台页面
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: 单前端功能任务
- Repo Scope: `apps/web/src/pages`
- Workspace Scope: single-workspace
- Inputs:
  - `docs/project-definition.md`
  - `docs/architecture/architecture-init.md`
  - `docs/planning/task-breakdown.md`
- Expected Outputs:
  - 任务详情页面
  - 账号状态页面
  - 通知记录页面
- Acceptance Criteria:
  - [ ] 可查看任务状态流与关键日志摘要
  - [ ] 可查看账号登录状态与最近活跃时间
  - [ ] 可查看二维码通知发送记录
  - [ ] 页面状态与接口字段一致
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-015`
  - `TASK-016`
- Blocked By: []
- Downstream Candidates: []
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX

---

## 推荐执行顺序

建议按以下顺序推进，而不是并行铺开全部任务：

1. `TASK-001` 初始化 API 骨架
2. `TASK-003` 初始化 Web 骨架
3. `TASK-002` 初始化 worker 骨架
4. `TASK-004` / `TASK-005` 落基础数据模型
5. `TASK-009` 验证 Playwright 会话与登录检测
6. `TASK-011` 打通保存草稿执行器
7. `TASK-006` / `TASK-007` 落基础业务 API
8. `TASK-012` 接入 AI 编排
9. `TASK-013` 落素材去重分配
10. `TASK-010` / `TASK-014` 打通登录恢复与通知
11. `TASK-015` 完成单账号 MVP 验收
12. `TASK-016` / `TASK-017` 做多账号与后台增强

---

## Ready Task 建议

如果你们准备进入业务仓开发，首批 ready task 建议只放以下 3 个：

- `TASK-001`
- `TASK-003`
- `TASK-002`

其中真正最优先的是：

- `TASK-001`：先把 `Hono` API 骨架立起来
- `TASK-003`：再把管理后台骨架立起来
- `TASK-002`：随后搭建 worker 与队列入口

---

## 人工闸门建议

在进入业务仓初始化前，建议人工确认以下事项：

- [ ] 项目代号是否确定为 `xhs-draft-platform`
- [ ] 通知渠道首选是否确定为企业微信或飞书
- [ ] 数据层方案是否确定使用 `PostgreSQL + Redis`
- [ ] AI 编排层是否确定优先采用 `Mastra`
- [ ] 首版目标是否确认只做“写入草稿”，不做自动正式发布
