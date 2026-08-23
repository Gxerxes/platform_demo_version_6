# Palette UI Platform

Palette 企业级 UI Common Framework — 基于 React + TypeScript 的 Monorepo。

## 目录结构

```
palette-ui/
├── packages/
│   ├── ui-common/              # 通用 UI 组件
│   ├── platform-config/      # 应用配置
│   ├── platform-event/         # 事件总线
│   ├── platform-api-client/    # API 客户端
│   ├── platform-security/      # 认证与权限
│   ├── platform-navigation/    # 导航
│   ├── platform-layout/        # 布局
│   ├── platform-provider/      # Platform Provider
│   ├── platform-sdk/           # 统一 SDK 入口
│   └── platform-shell/         # Application Shell
├── apps/
│   └── showcase-app/           # 展示与验证应用
├── docs/
└── package.json
```

## 快速开始

```bash
pnpm install
pnpm dev          # 启动 showcase-app
pnpm storybook    # 启动 Storybook 开发者门户 (http://localhost:6006)
pnpm build        # 构建所有包
pnpm storybook:build  # 构建 Storybook 静态站点
pnpm lint         # ESLint 检查
pnpm format       # Prettier 格式化
pnpm test         # 运行测试
```

## 包命名规范

所有包使用 `@palette/` scope：

- `@palette/ui-common`
- `@palette/platform-shell`
- `@palette/platform-sdk`
- ...

## 开发约定

- 使用 TypeScript strict mode
- 组件使用 named export
- 每个 package 独立 `package.json` + `tsconfig.json`
- 包间依赖通过 `workspace:*` 引用
