# 项目生成器

> 用于初始化新业务仓库的脚手架模板与生成规则。

---

## 概述

`generators/` 目录存放新业务仓库创建时的初始化模板和脚手架配置。当阶段 4-5（仓库创建与文档注入）执行时，生成器负责提供标准化的项目骨架。

---

## 目录结构

```
generators/
├── README.md          # 本文件
├── web-fullstack/     # Web 全栈项目模板
├── api-service/       # API 服务项目模板
└── cli-tool/          # CLI 工具项目模板
```

---

## 使用规则

1. 在 `projects/registry.yaml` 中注册项目时，`type` 字段决定使用哪个生成器
2. 生成器只负责创建项目骨架（目录结构、初始配置文件），不负责业务代码
3. 核心设计文档由元仓库注入，不由生成器生成

---

## 每个生成器应包含

- `README.md` — 模板说明
- `template/` — 文件模板目录
  - `.gitignore`
  - `.editorconfig`
  - `README.md`
  - `.env.example`
  - `package.json`（或对应语言的项目文件）
  - `docs/` 基础目录结构
- `generator.yaml` — 生成配置（可选）

---

## 与元仓库流程的关系

```
阶段 4（仓库创建）
  → 创建 GitHub 仓库
  → 克隆到本地

阶段 5（文档注入）
  → 使用 generators/{type}/template/ 创建基础骨架
  → 从元仓库注入核心文档
  → 首次提交
```

---

## 后续规划

- 首版以手动参照模板为主
- 后续考虑实现 `bootstrap-business-repo.mjs` 脚本自动化执行
- 支持模板变量替换（项目名、仓库地址等）
