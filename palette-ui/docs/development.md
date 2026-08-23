# Palette UI - 开发文档

## 环境要求

- Node.js >= 20
- pnpm >= 9

## 本地开发

```bash
# 克隆仓库
git clone <repo-url>
cd platform_demo_version_3/palette-ui

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## Monorepo 工作流

### 添加依赖到特定包

```bash
# 给 showcase-app 添加依赖
pnpm --filter @palette/showcase-app add react-router-dom

# 给 platform-shell 添加 workspace 内部依赖
pnpm --filter @palette/platform-shell add @palette/platform-layout@workspace:*
```

### 构建单个包

```bash
pnpm --filter @palette/platform-shell build
```

### 创建新 Package

1. 在 `packages/` 下创建目录
2. 添加 `package.json`（name 使用 `@palette/` scope）
3. 添加 `tsconfig.json`（extends `../../tsconfig.base.json`）
4. 添加 `src/index.ts` 作为入口
5. 运行 `pnpm install` 链接 workspace

## TypeScript 配置

所有 package 继承根目录 `tsconfig.base.json`，各 package 自行配置：

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

## 代码规范

- 使用 ESLint + Prettier，提交前运行 `pnpm lint` 和 `pnpm format:check`
- 组件文件使用 PascalCase：`AppHeader.tsx`
- 工具/Hook 文件使用 camelCase：`useAuth.ts`
- 每个 package 通过 `src/index.ts` 统一导出公共 API

## 包依赖关系（规划）

```
platform-sdk
  ├── platform-shell
  │     ├── platform-layout
  │     ├── platform-navigation
  │     └── platform-security
  ├── platform-api-client
  ├── platform-config
  ├── platform-event
  └── ui-common
```

Phase 0 仅建立包结构，Phase 1 开始实现核心能力。
