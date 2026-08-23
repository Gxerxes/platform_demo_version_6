# Palette Platform - 开发指南

## 1. 项目概述

Palette 是公司级 Enterprise Platform，为 Post-Trade 业务提供统一的前端 UI Framework 和 BFF 基础能力。

## 2. 仓库结构

```
platform_demo_version_3/
├── palette-ui/          # 前端 Monorepo
├── palette-bff/           # BFF 服务（Phase 4）
├── docs/                  # 平台级文档
├── .gitlab-ci.yml         # CI/CD 配置
└── README.md
```

## 3. 环境搭建

### 前置条件

| 工具 | 版本 |
|------|------|
| Node.js | >= 20 |
| pnpm | >= 9 |
| Git | >= 2.30 |

### 本地启动

```bash
cd palette-ui
pnpm install
pnpm dev        # http://localhost:3000
```

## 4. 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 showcase-app 开发服务器 |
| `pnpm storybook` | 启动 Storybook 开发者门户 (http://localhost:6006) |
| `pnpm storybook:build` | 构建 Storybook 静态站点 |
| `pnpm build` | 构建所有 workspace 包 |
| `pnpm lint` | ESLint 检查 |
| `pnpm lint:fix` | 自动修复 lint 问题 |
| `pnpm format` | Prettier 格式化 |
| `pnpm test` | 运行单元测试 |
| `pnpm typecheck` | TypeScript 类型检查 |

## 5. 开发流程

1. 从 `main` 创建 feature 分支（见 [分支策略](./branching-strategy.md)）
2. 在对应 package 中开发
3. 运行 `pnpm lint && pnpm test && pnpm build` 确保通过
4. 提交代码（见 [提交规范](./commit-convention.md)）
5. 创建 Merge Request，等待 Code Review
6. 合并到 `main`，CI 自动构建

## 6. Package 开发指南

### 创建新组件（以 ui-common 为例）

```bash
# 在 packages/ui-common/src/ 下创建组件
# 通过 src/index.ts 导出

# 在 showcase-app 中验证
pnpm dev
```

### 包间依赖

```json
{
  "dependencies": {
    "@palette/platform-layout": "workspace:*"
  }
}
```

## 7. 发布流程

见 [版本与发布策略](./versioning-and-release.md)。

## 8. 联系方式

Platform Team — 负责 Palette 的设计、开发、发布和维护。
