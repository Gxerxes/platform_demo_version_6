# Trading App 开发指南

Phase 6 交付的 `palette-example-trading`（`apps/trading-app`）是业务组的标准参考实现。

## 快速开始

```bash
# BFF
cd palette-bff && mvn spring-boot:run -Dspring-boot.run.profiles=local

# Trading App
cd palette-ui && pnpm dev:trading
```

访问 http://localhost:3001

## BFF Mock API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/dashboard/summary` | Dashboard 汇总数据 |
| GET | `/api/trades` | 交易列表 |
| POST | `/api/trades` | 创建交易 `{ symbol, side, quantity }` |
| GET | `/api/settlements` | 结算记录 |
| GET | `/api/reports/daily` | 日报 |

以上接口仅在 `palette.auth.mode=mock` 时可用。

## 推荐开发模式

### 1. 配置分离

```ts
// palette.config.ts
export const paletteConfig = { appName: 'My App', ... };
export const platformConfig = {
  api: { baseUrl: '/api' },
  auth: { enabled: true },
};
```

### 2. Feature API 封装

不要在页面中直接写 `api.get('/trades')`，应在 `features/` 目录封装：

```ts
export function createTradingApi(api: ApiClient) {
  return {
    getTrades: () => api.get<Trade[]>('/trades'),
    createTrade: (payload) => api.post<Trade>('/trades', payload),
  };
}
```

### 3. 权限三层控制

1. **导航** — `navigation.tsx` 中 `permission` 字段，Shell 自动过滤
2. **页面/区域** — `<PermissionGuard permission="trades:create">`
3. **BFF** — 后端 API 鉴权（生产环境必须）

### 4. 错误处理

```ts
try {
  await tradingApi.getTrades();
} catch (err) {
  const message = err instanceof ApiError ? err.message : 'Unknown error';
  showError(message);
}
```

Session 过期（401）由 Platform SDK 自动处理，无需业务代码介入。

## 从模板创建新业务应用

1. 复制 `apps/trading-app` 到 `apps/my-business-app`
2. 更新 `package.json` 的 `name` 和 `vite.config.ts` 端口
3. 在根 `package.json` 添加 `dev:my-app` 脚本
4. 替换 `features/` 和 `pages/` 为业务逻辑

## 相关文档

- [Trading App README](../palette-ui/apps/trading-app/README.md)
- [BFF 开发指南](./bff-guide.md)
- [Palette Getting Started](../palette-ui/docs/GettingStarted.mdx)
