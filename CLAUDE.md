# CLAUDE.md

> 本文件是 Claude Code 的项目入口。进入本仓库后请先阅读此文件。

## 项目简介

这是一个 **AI 原生工程元仓库（meta-forge）**。它不包含业务代码，而是管理所有业务项目的方法论、提示词、标准、模板和自动化脚本。

## 核心指令

**立即阅读 `AI_ENTRYPOINT.md`** — 它包含完整的阶段路由规则、意图映射表和最小必读集定义。

## 工作原则

- 不要遍历整个仓库，按阶段加载最小上下文包
- 不要跳过人工闸门（human gate）
- 不要用对话记忆代替结构化文件
- 所有产出必须是结构化格式（Markdown / YAML）

## 可用 Skills

以下 Skill 封装了最常用的流程，**优先匹配 Skill 再走手动 playbook**：

| Skill | 触发场景 | 入口文件 |
|-------|---------|---------|
| `meta-new-project` | 新项目从想法到文档基线（阶段 1-3） | `.agents/skills/meta-new-project/SKILL.md` |
| `meta-project-bootstrap` | 创建业务仓库并注入文档（阶段 4-5） | `.agents/skills/meta-project-bootstrap/SKILL.md` |
| `meta-stage-gate` | 判断当前阶段、防止阶段漂移 | `.agents/skills/meta-stage-gate/SKILL.md` |
| `meta-task-description` | 渲染/校验 VibeKanban 任务描述 | `.agents/skills/meta-task-description/SKILL.md` |
| `meta-vibekanban-sync` | 同步任务到 VibeKanban、回填 ID | `.agents/skills/meta-vibekanban-sync/SKILL.md` |
| `meta-onboard-project` | 接入已有项目，逆向回填文档基线 | `.agents/skills/meta-onboard-project/SKILL.md` |

## 快速意图映射

| 用户说 | 做什么 |
|--------|--------|
| "新项目" / "我有一个想法" | 读 `.agents/skills/meta-new-project/SKILL.md` → Stage 1 |
| "设计架构" | 读 `.agents/skills/meta-new-project/SKILL.md` → Stage 2 |
| "拆任务" | 读 `.agents/skills/meta-new-project/SKILL.md` → Stage 3 |
| "创建仓库" / "bootstrap" | 读 `.agents/skills/meta-project-bootstrap/SKILL.md` |
| "同步 VibeKanban" | 读 `.agents/skills/meta-vibekanban-sync/SKILL.md` |
| "现在到哪一步了" / "阶段检查" | 读 `.agents/skills/meta-stage-gate/SKILL.md` 或运行 `node scripts/check-stage-ready.mjs --project <id>` |
| "下一个任务" | 运行 `node scripts/orchestrate-next-task.mjs --result ... --batch ... --status ...` |
| "项目状态" / "仪表盘" | 运行 `node scripts/project-status.mjs [--project <id>]` |
| "开始写代码" | 先阶段检查，再读 `playbooks/execution-agent-run.md` |
| "接入老项目" / "导入项目" / "onboard" | 读 `.agents/skills/meta-onboard-project/SKILL.md` |

## CLI 工具

```bash
node scripts/meta-cli.mjs help          # 查看所有命令
node scripts/meta-cli.mjs status        # 项目仪表盘
node scripts/meta-cli.mjs stage --project <id>   # 阶段检查
node scripts/meta-cli.mjs next --result ... --batch ... --status ...  # 编排下一个任务
```

## 关键目录结构

```
AI_ENTRYPOINT.md          ← 通用 AI 入口（核心路由文档）
OPERATING_MODEL.md        ← 运作模型
agents/                   ← 6 个 Agent 角色定义
.agents/skills/           ← 5 个可触发 Skill
playbooks/                ← 操作手册
prompts/                  ← 提示词模板
standards/                ← 编码/API/DB/任务标准
templates/                ← 文档模板
scripts/                  ← 自动化脚本（8 个）
projects/registry.yaml    ← 项目注册表
docs/ai-context-packs.md  ← Agent 上下文包定义
docs/ai-stage-routing.md  ← 阶段路由规则
```

## 注意事项

- 本仓库使用 Node.js 24+，脚本在 `scripts/` 目录下
- YAML 解析使用自研轻量解析器（`scripts/lib/yaml.mjs`），无外部依赖
- 项目注册表在 `projects/registry.yaml`，所有业务项目在此登记
- VibeKanban 通过 MCP 协议集成，工具参考见 `docs/vibekanban-mcp-tools.md`
