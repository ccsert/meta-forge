# API 设计规范

> 适用于所有由本元仓库管理的业务项目中的 HTTP API。

---

## 通用原则

- RESTful 风格优先
- API 路由使用 kebab-case
- 资源名使用复数形式
- 请求与响应统一使用 JSON
- 所有响应包含统一结构

---

## 路由规范

### URL 结构

```
/api/{version}/{resource}/{id?}/{sub-resource?}
```

示例：

```
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/users/:id/accounts
```

### 版本策略

- 首版使用 `/api/v1/`
- 版本号仅在破坏性变更时递增

---

## 请求规范

### 查询参数

- 分页：`page`、`page_size`
- 排序：`sort_by`、`sort_order`（asc / desc）
- 过滤：使用具名参数，如 `status=active`

### 请求体

- 使用 `application/json`
- 字段名使用 snake_case
- 必填字段在文档中标注

---

## 响应规范

### 成功响应

```json
{
  "code": 0,
  "data": { ... },
  "message": "ok"
}
```

### 列表响应

```json
{
  "code": 0,
  "data": {
    "items": [ ... ],
    "total": 100,
    "page": 1,
    "page_size": 20
  },
  "message": "ok"
}
```

### 错误响应

```json
{
  "code": 40001,
  "data": null,
  "message": "用户名不能为空",
  "errors": [
    { "field": "username", "message": "required" }
  ]
}
```

---

## HTTP 状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 查询/更新成功 |
| 201 | Created | 创建成功 |
| 204 | No Content | 删除成功 |
| 400 | Bad Request | 参数校验失败 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突 |
| 422 | Unprocessable Entity | 业务规则校验失败 |
| 500 | Internal Server Error | 服务端异常 |

---

## 认证与授权

- 使用 Bearer Token（JWT 或 session-based）
- Token 放在 `Authorization` header
- 不在 URL 参数中传递 Token
- 敏感操作需要二次确认或额外权限校验

---

## 幂等性

| 方法 | 幂等性 | 说明 |
|------|--------|------|
| GET | 是 | 读取操作 |
| PUT | 是 | 全量更新 |
| DELETE | 是 | 删除操作 |
| POST | 否 | 创建操作（使用幂等键时可为是） |
| PATCH | 否 | 部分更新 |

---

## 文档要求

- 每个 API 端点应在架构文档或 API 文档中注册
- 至少标注：路由、方法、描述、所属模块、请求/响应示例
