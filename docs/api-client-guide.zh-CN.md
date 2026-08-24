# Palette API Client 开发指南

本文说明业务应用如何在不直接接触 Axios 或 TanStack Query 内部实现的情况下，配置并使用 Palette 企业级 API 客户端。

## 架构职责

```
业务应用
    │ 应用配置 (palette.config.ts)
    ▼
@palette/platform-config  →  resolvePlatformConfig
    ▼
@palette/platform-provider (PalettePlatformProvider)
    ├─ @palette/platform-security  (认证 / 401 响应)
    └─ @palette/platform-api-client (Axios + TanStack Query)
            ▼
          BFF
```

- **配置**：`@palette/platform-config`
- **HTTP 传输**：`@palette/platform-api-client`（内部 Axios）
- **服务端状态**：TanStack Query（平台创建 `QueryClient`）
- **认证**：`@palette/platform-security`（BFF Cookie 会话）
- **组合**：`PaletteApp` / `PalettePlatformProvider`

业务应用**不应**手动创建 `Axios` 实例、`QueryClient`、拦截器或认证 Header。

## 配置优先级

最终配置由三层合并得到：

```
平台默认值 + 运行时配置 + 应用配置 = 已解析配置
```

合并规则为**深合并**，嵌套字段（如 `api.timeout`）可单独覆盖，不会丢失兄弟默认值。

### 平台默认值

| 配置项 | 默认值 |
|--------|--------|
| `api.timeout` | `30000` |
| `api.withCredentials` | `true` |
| `query.staleTime` | `30000` |
| `query.gcTime` | `300000` |
| `query.retry` | `1` |
| `query.refetchOnWindowFocus` | `false` |
| `query.refetchOnReconnect` | `true` |

### 应用配置示例

在 `palette.config.ts` 中：

```typescript
import type { PalettePlatformConfig } from '@palette/platform-sdk';

export const platformConfig: PalettePlatformConfig = {
  api: {
    baseUrl: '/api',
    timeout: 30_000,
    withCredentials: true,
  },
  query: {
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  auth: {
    enabled: true,
  },
  metadata: {
    applicationId: 'trading-app',
    clientVersion: '0.6.0',
  },
};
```

将 `platformConfig` 传给 `PaletteApp` 即可，无需再挂载 `QueryClientProvider`。

## API Client 用法

通过 `useApiClient()` 获取平台托管的客户端：

```typescript
import { useApiClient } from '@palette/platform-sdk';

export const tradesService = {
  getTrades(api: ReturnType<typeof useApiClient>) {
    return api.get<Trade[]>('/trades');
  },
};
```

平台自动附加：

- `X-Request-ID` / `X-Correlation-ID`
- `X-Application-ID`（来自 `metadata.applicationId`）
- `X-Client-Version`（来自 `metadata.clientVersion`）
- BFF 会话 Cookie（`withCredentials: true`）

## TanStack Query 用法

从 SDK 导入 Hook，不要自行 `new QueryClient()`：

```typescript
import { useQuery, useApiClient } from '@palette/platform-sdk';
import { createQueryKeyFactory } from '@palette/platform-sdk';

export const tradeKeys = createQueryKeyFactory('trades');

export function useTrades() {
  const api = useApiClient();
  return useQuery({
    queryKey: tradeKeys.lists(),
    queryFn: () => api.get<Trade[]>('/trades'),
  });
}
```

**Query Key 约定**：业务域 Key 放在应用内（如 `features/trades/trades.keys.ts`），平台只提供 `createQueryKeyFactory` 工具，不包含 `users`、`trades` 等业务概念。

`createQueryKeyFactory` 同时提供分页 Key：

```typescript
tradeKeys.pageLists()                        // ['trades', 'page-list']
tradeKeys.pageList({ page: 2, pageSize: 10 }) // ['trades', 'page-list', { page: 2, pageSize: 10 }]
```

## 分页

平台提供统一的分页请求/响应模型，业务应用无需自行拼接 `page` / `pageSize` 或解析多种后端格式。

### 类型

```typescript
interface PageRequest {
  page?: number;      // 从 1 开始，默认 1
  pageSize?: number;  // 默认 20
}

interface PageResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

`normalizePageResponse` 自动兼容：

- Palette 标准 `{ items, page, pageSize, total, ... }`
- Spring Page `{ content, number, size, totalElements, ... }`（`number` 为 0-based，会自动转为 1-based）
- 普通数组（作为单页结果包装）

### API Client

```typescript
const page = await api.getPage<Trade>('/trades', { page: 1, pageSize: 10 });
// page.items, page.total, page.hasNext ...
```

### TanStack Query

使用 `usePaginatedQuery` 管理页码状态，并在翻页时保留上一页数据：

```typescript
export function useTradesPage() {
  const api = useApiClient();
  return usePaginatedQuery({
    queryKey: tradeKeys.pageLists(),
    queryFn: (pageRequest) => api.getPage<Trade>('/trades', pageRequest),
    initialPageSize: 10,
  });
}

// 组件内
const { items, page, pageSize, total, setPage, setPageSize, hasNext, hasPrevious } = useTradesPage();
```

BFF 约定：当请求携带 `page` / `pageSize` 查询参数时，返回 `PageResponse` 结构；未携带时仍可返回普通数组（向后兼容）。


推荐目录结构：

```
src/features/trades/
├── api.ts           # service / API 调用
├── trades.keys.ts   # query keys
├── trades.query.ts  # useQuery / useMutation
└── types.ts
```

## 错误处理

HTTP 与网络错误统一归一化为 `ApiError`：

```typescript
export interface ApiError {
  status: number;
  code: string;
  message: string;
  data?: unknown;
  requestId?: string;
}
```

支持的状态码映射包括：`400`、`401`、`403`、`404`、`409`、`422`、`429`、`500`，以及 `NETWORK_ERROR`、`TIMEOUT_ERROR`。

**重要**：API Client **不会**在拦截器中执行 `window.location.href` 跳转。401 时通过 EventBus 发布 `AUTH_EXPIRED`，由 `platform-security` / `platform-provider` 决定后续动作（如跳转登录页）。

## 认证集成

- BFF 使用 Cookie 会话时，保持 `api.withCredentials: true`（默认已开启）。
- API Client 不实现 OIDC 登录或 Token 刷新；这些由 BFF 与安全模块负责。
- 401 → `ApiError` + `AUTH_EXPIRED` 事件 → `AuthProvider` 处理。

## 高级用法（通常不需要）

仅在测试或特殊场景下可直接使用工厂函数：

```typescript
import { createApiClient, createQueryClient, resolvePlatformConfig } from '@palette/platform-sdk';
```

常规业务开发应始终通过 `PaletteApp` + `useApiClient` + `useQuery`。

## 参考实现

参见 `palette-ui/apps/trading-app`：

- `src/palette.config.ts` — 平台配置
- `src/features/trades/trades.keys.ts` — Query Key
- `src/features/trades/trades.query.ts` — `useTradesPage`（分页）
- `src/pages/TradesPage.tsx` — 分页表格消费
