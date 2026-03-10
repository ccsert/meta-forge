# 编码规范

> 适用于所有由本元仓库管理的业务项目。

---

## 通用原则

- 代码即文档：变量名、函数名、类名应自解释
- 单一职责：每个函数/模块只做一件事
- 最小惊讶原则：代码行为应与名称暗示一致
- 优先组合而非继承

---

## 命名规范

| 类型 | 规则 | 示例 |
|------|------|------|
| 变量 | camelCase | `userName`, `taskId` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 函数 | camelCase，动词开头 | `getUserById`, `handleSubmit` |
| 类/组件 | PascalCase | `TaskRunner`, `UserCard` |
| 文件（TS/JS） | kebab-case | `task-runner.ts`, `user-card.tsx` |
| 文件（组件） | PascalCase（React 组件） | `UserCard.tsx` |
| CSS 类 | kebab-case | `task-item`, `header-nav` |
| 数据库表 | snake_case | `draft_tasks`, `user_accounts` |
| 数据库字段 | snake_case | `created_at`, `task_id` |
| API 路由 | kebab-case | `/api/draft-tasks`, `/api/users/:id` |
| 环境变量 | UPPER_SNAKE_CASE | `DATABASE_URL`, `REDIS_URL` |

---

## TypeScript 规范

- 启用 `strict` 模式
- 禁止使用 `any`，必要时使用 `unknown` + type guard
- 优先使用 `interface` 定义对象形状，`type` 用于联合/交叉类型
- 函数参数和返回值应显式标注类型
- 使用 `const` 优先于 `let`，禁止 `var`
- 使用 `===` 而非 `==`

---

## 代码质量

### 禁止

- `console.log` / `console.warn` 残留于生产代码（使用 logger）
- 空的 `catch` 块
- 未使用的变量和导入
- 硬编码密钥/密码/配置值
- `TODO` / `FIXME` 残留（必须记录为新 task 或 issue）

### 推荐

- 函数长度不超过 30 行
- 嵌套不超过 3 层
- 提前返回（guard clause）优于深层嵌套
- 使用 `Optional chaining (?.)` 和 `Nullish coalescing (??)`

---

## 错误处理

- 外部输入（用户输入、API 响应）必须验证
- 数据库操作必须处理错误
- 异步操作使用 `try/catch` 或错误传播
- 错误消息应包含上下文信息，便于排查
- 不要吞掉错误（静默忽略）

---

## 安全规范

- 不信任任何外部输入
- SQL 使用参数化查询
- API 端点做身份认证和权限检查
- 敏感数据不写入日志
- 密钥/Token 使用环境变量管理
- 遵循最小权限原则

---

## 测试规范

- 核心业务逻辑必须有单元测试
- 关键路径必须有集成测试
- 测试文件与源文件同目录或 `__tests__/` 目录
- 测试命名：`describe('模块名')` + `it('should 行为描述')`
- 使用工厂函数创建测试数据，不硬编码

---

## Git 提交规范

格式：`<type>(<scope>): <subject>`

| type | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复缺陷 |
| docs | 文档变更 |
| refactor | 重构（不改变外部行为） |
| test | 测试相关 |
| chore | 构建/工具/配置变更 |

- subject 不超过 72 字符
- 使用中文或英文均可，但同一项目内应统一
- 每个提交应是一个原子变更
