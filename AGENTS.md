# AGENTS.md

> **AI 原生工程元仓库（meta-forge）** — 本仓库不包含业务代码，管理所有业务项目的方法论、提示词、标准、模板和自动化脚本。
>
> **核心路由文档：`AI_ENTRYPOINT.md`** — 包含完整的阶段路由规则、意图映射表和最小必读集定义。进入本仓库后请先阅读。

## Project Skills

This repository defines project-local skills under `.agents/skills/`.
When working in this repository, prefer these project-local skills before falling back to global skills when the workflow matches.

### Available project-local skills
- `meta-stage-gate`: Determine the current project stage, output a stage snapshot, and prevent stage drift. (path: `.agents/skills/meta-stage-gate/SKILL.md`)
- `meta-task-description`: Render and validate VibeKanban issue descriptions against the meta-repo protocol. (path: `.agents/skills/meta-task-description/SKILL.md`)
- `meta-vibekanban-sync`: Resolve VibeKanban IDs, sync task nodes, sync relationships, and keep `issue-map` aligned. (path: `.agents/skills/meta-vibekanban-sync/SKILL.md`)
- `meta-project-bootstrap`: Create/bootstrap business repositories and inject core meta-repo documents. (path: `.agents/skills/meta-project-bootstrap/SKILL.md`)
- `meta-new-project`: Drive stage 1-3 of the new-project flow from idea to document baseline. (path: `.agents/skills/meta-new-project/SKILL.md`)
- `meta-onboard-project`: Onboard an existing project into meta-forge by auditing the codebase and backfilling standard documents. (path: `.agents/skills/meta-onboard-project/SKILL.md`)

## Usage rule

- If a user request clearly matches one of the project-local skills above, use that skill for the turn.
- Prefer project-local skills for this repository because they encode the repository-specific workflow.
- Use global/system skills only when no project-local skill covers the request or when the user explicitly asks for them.

## 快速意图映射

| 用户说 | 做什么 |
|--------|--------|
| "新项目" / "我有一个想法" | 读 `.agents/skills/meta-new-project/SKILL.md` → Stage 1 |
| "设计架构" | 读 `.agents/skills/meta-new-project/SKILL.md` → Stage 2 |
| "拆任务" | 读 `.agents/skills/meta-new-project/SKILL.md` → Stage 3 |
| "创建仓库" / "bootstrap" | 读 `.agents/skills/meta-project-bootstrap/SKILL.md` |
| "同步 VibeKanban" | 读 `.agents/skills/meta-vibekanban-sync/SKILL.md` |
| "阶段检查" / "状态" | 读 `.agents/skills/meta-stage-gate/SKILL.md` 或 `node scripts/meta-cli.mjs stage --project <id>` |
| "下一个任务" | `node scripts/meta-cli.mjs next --result ... --batch ... --status ...` |
| "项目状态" / "仪表盘" | `node scripts/meta-cli.mjs status [--project <id>]` |
| "开始写代码" | 先 `meta-stage-gate`，再 `playbooks/execution-agent-run.md` |
| "接入老项目" / "导入项目" / "onboard" | 读 `.agents/skills/meta-onboard-project/SKILL.md` |

## CLI 工具

```bash
node scripts/meta-cli.mjs help          # 查看所有命令
node scripts/meta-cli.mjs status        # 项目仪表盘
node scripts/meta-cli.mjs stage --project <id>   # 阶段检查
node scripts/meta-cli.mjs next --result ... --batch ... --status ...  # 编排下一个任务
```

## 工作原则

- 不要遍历整个仓库，按阶段加载最小上下文包（见 `docs/ai-context-packs.md`）
- 不要跳过人工闸门（human gate）
- 不要用对话记忆代替结构化文件
- 所有产出必须是结构化格式（Markdown / YAML）

## 多工具入口

本仓库支持多种 AI 编码工具，每个工具有对应的薄适配文件，都指向 `AI_ENTRYPOINT.md` 作为通用核心：

| 工具 | 入口文件 | 说明 |
|------|---------|------|
| VS Code GitHub Copilot | `AGENTS.md`（本文件） | Skills 自动发现 + 意图路由 |
| OpenAI Codex CLI | `CODEX.md` | Sandbox 场景，无外部依赖 |
| Claude Code | `CLAUDE.md` | 完整 Skill 表 + 意图映射 |
| OpenCode | `.opencode.md` | 同上 |
