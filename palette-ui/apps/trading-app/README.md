# Palette Trading App — Reference Implementation

业务组参考实现（Reference Implementation），展示如何基于 Palette Platform 构建完整的 Post-Trade 业务应用。

## 功能覆盖

| 能力 | 实现 |
|------|------|
| Login / Logout | `PaletteApp` + BFF Mock 认证 |
| Navigation | `navigation.tsx` + 权限过滤 |
| Permission | `PermissionGuard` + BFF 权限同步 |
| Dashboard | `GET /api/dashboard/summary` |
| Table | Trades / Settlements 列表页 |
| Form | New Trade 表单 + `POST /api/trades` |
| API Call | `features/trades/api.ts` 封装 |
| Error Handling | `ApiError` + Alert 展示 |
| Session Expiration | 401 → 自动跳转 `/api/auth/login` |

## 项目结构

```
src/
├── App.tsx                 # 路由 + PaletteApp 入口
├── palette.config.ts       # 应用与平台配置
├── navigation.tsx          # 导航与权限定义
├── features/trades/
│   ├── api.ts              # BFF API 封装（推荐模式）
│   └── types.ts            # 业务类型
└── pages/                  # 页面组件
    ├── DashboardPage.tsx
    ├── TradesPage.tsx
    ├── NewTradePage.tsx
    ├── SettlementsPage.tsx
    ├── ReportsPage.tsx
    └── AdminPage.tsx
```

## 本地运行

```bash
# 终端 1：BFF（Mock 模式）
cd palette-bff
mvn spring-boot:run -Dspring-boot.run.profiles=local

# 终端 2：Trading App
cd palette-ui
pnpm install
pnpm dev:trading    # http://localhost:3001
```

## 业务组接入步骤

1. 复制 `apps/trading-app/` 作为新项目模板
2. 修改 `palette.config.ts` 中的 `appName`、主题色
3. 在 `navigation.tsx` 定义业务导航与 `permission` 字段
4. 在 BFF 配置对应权限（OIDC claims 或 Mock permissions）
5. 在 `features/` 下按领域封装 API，页面只调用 feature API
6. 使用 `PermissionGuard` 保护按钮和页面区域

## 权限清单（Mock 模式）

| Permission | 用途 |
|------------|------|
| `dashboard:view` | Dashboard 页面 |
| `trades:view` | 交易列表 |
| `trades:create` | 新建交易 |
| `settlements:view` | 结算列表 |
| `reports:view` | 日报 |
| `admin:view` | 管理页面 |

## 与 Showcase 的区别

| | Showcase App | Trading App |
|--|--------------|-------------|
| 端口 | 3000 | 3001 |
| 定位 | 平台能力验证 | 业务参考实现 |
| 页面 | SDK Demo、组件展示 | 完整业务场景 |
| API | 单一 `/trades` | Dashboard、Trades、Settlements、Reports |
