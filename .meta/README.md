# `.meta/` 工作目录说明

## 定位

`.meta/` 是元仓库中脚本运行时的**临时工作目录**，用于存放脚本的中间产物与运行结果。

**与 `docs/meta/` 的区别**：

| 目录 | 定位 | 内容 | 持久性 |
|------|------|------|--------|
| `.meta/` | 脚本工作目录 | 生成的 batch、描述、临时快照 | 临时，可随时重生成 |
| `docs/meta/` | 项目元数据 | project-manifest、issue-map、闸门清单 | 持久，已纳入版本控制 |

---

## `.meta/` 包含的内容

| 文件/目录 | 生成方式 | 说明 |
|-----------|----------|------|
| `vibekanban-issue-batch.yaml` | `npm run generate-issue-batch` | issue 批量创建清单 |
| `descriptions/` | `npm run render-issue-description` | 各 task 的渲染后描述 |
| `ready-task-selection.yaml` | `npm run select-ready-task` | ready task 选择结果 |
| `session-result-sample.yaml` | 手动 / 模板参考 | session result 示例 |
| `sample-task-breakdown.md` | 手动 | task-breakdown 脚本测试输入 |

---

## 规则

- `.meta/` 下的文件不应被视为权威数据源
- 权威数据存放在 `docs/meta/`（元仓库）或业务仓库 `docs/meta/`
- `.meta/` 的内容可以随时通过脚本重新生成
- `.meta/` 应加入 `.gitignore`（如需版本化仅保留示例文件）
