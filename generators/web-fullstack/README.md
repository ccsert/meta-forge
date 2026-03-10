# Web 全栈项目模板

> 适用于 `type: web-fullstack` 的业务项目。

---

## 适用场景

- 前后端一体的 Web 应用
- 包含 API + 前端 UI + 后台 Worker 的项目

---

## 推荐目录结构

```
{{project_name}}/
├── README.md
├── .gitignore
├── .editorconfig
├── .env.example
├── package.json
├── tsconfig.json
├── apps/
│   ├── api/              # 后端 API 服务
│   │   ├── src/
│   │   └── package.json
│   ├── web/              # 前端应用
│   │   ├── src/
│   │   └── package.json
│   └── worker/           # 后台 Worker 服务
│       ├── src/
│       └── package.json
├── packages/
│   └── shared/           # 共享类型/工具
│       ├── src/
│       └── package.json
├── docs/
│   ├── project-definition.md        ← 元仓库注入
│   ├── architecture/
│   │   └── architecture-init.md     ← 元仓库注入
│   ├── planning/
│   │   └── task-breakdown.md        ← 元仓库注入
│   ├── meta/
│   │   ├── project-manifest.yaml    ← 元仓库注入
│   │   └── issue-map.yaml           ← 元仓库注入
│   ├── adrs/
│   └── execution/
└── scripts/
```

---

## 初始化步骤

1. 创建 GitHub 仓库
2. 克隆到本地
3. 按上述结构创建目录
4. 初始化 `package.json`（monorepo 配置）
5. 注入元仓库核心文档
6. 首次提交并推送

---

## 注意事项

- 具体技术栈由项目定义决定，本模板只提供结构参考
- `docs/` 下的核心文档由元仓库注入，不手动创建
- `scripts/` 可按项目需要添加
