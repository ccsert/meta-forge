# 新项目人工闸门清单：小红书 AI 草稿投递平台

## 适用阶段

本清单用于 `playbooks/new-project.md` 中阶段 1、阶段 2、阶段 3 完成后的人工确认，确认通过后再进入仓库创建、业务仓初始化与 VibeKanban 绑定。

---

## 阶段 1：项目定义闸门

对应文档：`docs/project-definition.md`

检查项：

- [ ] 项目名称与代号确认无误
- [ ] 项目目标描述清晰，且与“自动写入草稿”定位一致
- [ ] 用户角色划分合理
- [ ] 核心功能范围完整覆盖当前业务诉求
- [ ] 非目标范围明确，未误把“自动正式发布”纳入首版
- [ ] 业务约束、人工协同原则、风控原则可接受
- [ ] 里程碑与首版范围可执行
- [ ] 技术选型方向已确认采用轻量化方案

当前建议结论：

- 项目代号：`xhs-draft-platform`
- 首版定位：`AI 辅助生成 + 自动写入草稿 + 用户人工发布`
- 首版不包含：自动正式发布

阶段结论：

- [ ] 通过
- [ ] 不通过，需继续修订 `docs/project-definition.md`

---

## 阶段 2：架构初始化闸门

对应文档：`docs/architecture/architecture-init.md`

检查项：

- [ ] 系统边界已明确
- [ ] 模块划分合理，未过早拆成复杂微服务
- [ ] API、worker、AI 编排、通知、素材服务职责清晰
- [ ] 首版数据流覆盖草稿生成、登录恢复、图片去重三条主线
- [ ] 核心领域模型满足当前 MVP 需要
- [ ] 接口边界足以支撑后续任务拆解
- [ ] 技术选型与轻量化目标一致
- [ ] 关键风险与缓解策略可接受

当前建议结论：

- 前端：`React 19 + Vite + shadcn/ui`
- 后端：`Hono`
- AI 编排：优先评估 `Mastra`
- 异步任务：`BullMQ + Redis`
- 数据持久化：`PostgreSQL`
- 浏览器自动化：`Playwright`

阶段结论：

- [ ] 通过
- [ ] 不通过，需继续修订 `docs/architecture/architecture-init.md`

---

## 阶段 3：任务拆解闸门

对应文档：`docs/planning/task-breakdown.md`

检查项：

- [ ] Epic / Feature / Story / Task 层级清晰
- [ ] 每个执行性任务都可在单 workspace 中闭环
- [ ] 每个任务都具备明确输入文档
- [ ] 每个任务都具备明确验收标准
- [ ] 依赖关系 `depends_on` 已明确
- [ ] 推荐执行顺序符合“先骨架、后主链路、再增强”的策略
- [ ] 首批 ready task 数量适中，未一次性放太多任务

当前建议首批 ready task：

- `TASK-001`
- `TASK-003`
- `TASK-002`

阶段结论：

- [ ] 通过
- [ ] 不通过，需继续修订 `docs/planning/task-breakdown.md`

---

## 阶段 4 前置确认

若前三阶段均通过，再继续确认以下信息，用于进入仓库创建与登记阶段：

- [ ] GitHub 仓库 owner 已确定
- [ ] GitHub 仓库名已确定
- [ ] 仓库可见性已确定
- [ ] 默认分支已确定
- [ ] 本地目录已确定
- [ ] VibeKanban organization / project 已确定或可后补
- [x] 首个通知渠道已确定（飞书）

建议待确认字段：

- `github_owner`: `ccsert`
- `github_name`: `xhs-draft-platform`
- `repo_url`: `https://github.com/ccsert/xhs-draft-platform`
- `default_branch`: `main`
- `visibility`: `private`
- `local_path`: `/home/ccsert/project/xhs-draft-platform`
- `vibekanban.organization_id`: `TBD`
- `vibekanban.project_id`: `05e17528-f380-456c-979d-8f4f1af9f196`
- `vibekanban.repo_id`: `3f769223-4139-4a05-8d86-fca3c3b8612e`
- `notification_provider`: `Feishu`

说明：

- `vibekanban.organization_id`、`vibekanban.project_id`、`vibekanban.repo_id` 需要在 GitHub 仓库创建并在 VibeKanban 中完成 repo/project 绑定后，再通过 MCP 查询并回填。
- 当前阶段这些字段保持空值是符合流程的。
- 当前项目名按仓库名对齐，使用 `xhs-draft-platform`。

---

## 当前规范化结论

当前项目已形成以下文档基线：

- `docs/project-definition.md`
- `docs/architecture/architecture-init.md`
- `docs/planning/task-breakdown.md`

下一步应按规范进入：

1. 人工确认三份核心文档
2. 创建业务仓库
3. 注入文档与 `project-manifest`
4. 绑定 VibeKanban
5. 回写 registry / graph / issue-map
6. 再选择 ready task 进入执行
