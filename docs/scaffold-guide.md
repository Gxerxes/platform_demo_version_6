# Palette App 脚手架指南

Phase 7 交付 `create-palette-app`，让业务组快速创建标准 Palette 企业应用。

## 快速使用

在 `palette-ui` Monorepo 内：

```bash
cd palette-ui
pnpm create-app settlement-app
pnpm install
pnpm --filter @palette/settlement-app dev
```

发布后也可使用标准命令：

```bash
pnpm create palette-app settlement-app
```

## 命令选项

```bash
pnpm create-app <app-name> [options]

Options:
  --port <number>     开发服务器端口（默认从 3002 起自动分配）
  --title <name>      应用显示名称
  --dir <path>        输出目录
  --standalone        在 Monorepo 外创建，使用已发布的 @palette/* 版本
```

## 生成的项目结构

```
settlement-app/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── palette.config.ts
│   ├── navigation.tsx
│   └── pages/
│       ├── DashboardPage.tsx
│       └── SettingsPage.tsx
├── palette.config.ts
├── vite.config.ts
├── package.json
└── README.md
```

## 脚手架包含的能力

| 能力 | 说明 |
|------|------|
| PaletteApp | Shell + Auth + Navigation 开箱即用 |
| BFF 代理 | Vite `/api` → `localhost:8080` |
| Auth | `auth.enabled: true`，对接 BFF |
| 权限导航 | `navigation.tsx` 中配置 permission |
| 示例页面 | Dashboard + Settings |

## 创建后的步骤

1. **注册 dev 脚本**（可选）— 在 `palette-ui/package.json` 添加：

   ```json
   "dev:settlement-app": "pnpm --filter @palette/settlement-app dev"
   ```

2. **配置 BFF CORS** — 在 `palette-bff` 的 `application-local.yml` 添加新端口：

   ```yaml
   palette:
     cors:
       allowed-origins:
         - http://localhost:3000
         - http://localhost:3001
         - http://localhost:3002
   ```

3. **定义业务权限** — 在 BFF Mock 配置或 IdP 中添加应用所需 permissions

4. **开发业务逻辑** — 参考 [Trading App 指南](./example-app-guide.md)

## Monorepo vs Standalone

| 模式 | 使用场景 | SDK 依赖 |
|------|----------|----------|
| Monorepo（默认） | 在 `palette-ui` 内开发 | `workspace:*` + Vite alias |
| Standalone | 独立仓库 | `^0.7.0` 从公司 npm registry |

```bash
# Standalone
pnpm create palette-app my-app --standalone
```

## 与 Reference Implementation 的关系

| 项目 | 定位 |
|------|------|
| `create-palette-app` 模板 | 最小可运行起点 |
| `apps/trading-app` | 完整业务参考实现 |

建议：用脚手架创建应用，参考 Trading App 添加 Table、Form、Feature API 等模式。

## 相关文档

- [开发指南](./development-guide.md)
- [Example App 指南](./example-app-guide.md)
- [BFF 指南](./bff-guide.md)
