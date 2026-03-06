# 任务关系模型

## 目标

统一元仓库与 VibeKanban 中的任务关系表达，避免“父子关系”和“依赖关系”混淆。

## 关系类型

### `parent_of`
表示结构分解关系。

- Epic → Feature
- Feature → Story
- Story → Task

说明：
- 只表示层级归属
- 不自动表示执行顺序

### `depends_on`
表示执行前置条件。

说明：
- A depends_on B，表示 A 必须等待 B 完成
- 这是 ready task 判断的核心依据

### `blocks`
表示显式阻塞。

说明：
- 常用于缺陷、冲突、外部决策等待
- 可与 `depends_on` 同时存在，但语义更强

### `relates_to`
表示信息关联，不影响调度。

### `spawned_from`
表示补偿性任务来源。

适用场景：
- 合并冲突新建 issue
- 回调阶段自动生成的后续任务
- 代码审查衍生修复任务

## 调度规则

- 任务是否 ready，仅由 `depends_on` 和 `blocks` 判断
- `parent_of` 只用于展示层级与汇总进度
- `relates_to` 不参与调度
- `spawned_from` 用于追踪来源链路
