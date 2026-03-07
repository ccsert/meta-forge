# 阶段 4 / 5 执行清单：仓库创建与文档注入

## 阶段 4：GitHub 仓库创建

目标：创建业务仓并获得标准化仓库坐标。

已确认参数：

- `github_owner`: `ccsert`
- `github_name`: `xhs-draft-platform`
- `repo_url`: `https://github.com/ccsert/xhs-draft-platform`
- `default_branch`: `main`
- `visibility`: `private`
- `local_path`: `/home/ccsert/project/xhs-draft-platform`

执行检查项：

- [ ] GitHub 仓库已创建
- [ ] 远程地址可访问
- [ ] 本地目录已创建
- [ ] 默认分支已确认
- [ ] 首次初始化命令已准备

参考命令：

- `gh repo create ccsert/xhs-draft-platform --private --clone`
- `cd /home/ccsert/project/xhs-draft-platform`
- `git checkout -b main`

## 阶段 5：业务仓初始化与文档注入

目标：把业务仓从空仓初始化为可进入开发的项目骨架。

必须注入的文档：

- [ ] `docs/project-definition.md`
- [ ] `docs/architecture/architecture-init.md`
- [ ] `docs/planning/task-breakdown.md`
- [ ] `docs/meta/project-manifest.yaml`
- [ ] `docs/meta/issue-map.yaml`

建议同时初始化：

- [ ] `README.md`
- [ ] `.gitignore`
- [ ] `.editorconfig`
- [ ] `.env.example`
- [ ] `docs/adrs/`

注入来源：

- `docs/project-definition.md` ← 当前元仓库版本
- `docs/architecture/architecture-init.md` ← 当前元仓库版本
- `docs/planning/task-breakdown.md` ← 当前元仓库版本
- `docs/meta/project-manifest.draft.yaml` → 业务仓 `docs/meta/project-manifest.yaml`
- `docs/meta/issue-map.draft.yaml` → 业务仓 `docs/meta/issue-map.yaml`

完成标准：

- [ ] 业务仓包含核心设计文档
- [ ] `project-manifest.yaml` 已注入
- [ ] `issue-map.yaml` 主副本已建立
- [ ] 首次提交已完成
- [ ] 已推送远程

## 阶段 6 前置提醒

在业务仓创建并注入文档后，再进行：

- VibeKanban repo 绑定
- MCP 查询并回填 `organization_id` / `project_id` / `board_id` / `repo_id`
- repo scripts 配置
