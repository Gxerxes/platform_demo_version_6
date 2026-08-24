# @palette/platform-api-client

Enterprise HTTP client SDK for Palette. Axios-based, framework-agnostic core; React integration (Provider, TanStack Query) lives under `src/react/`.

> **Languages:** [English](./README.en.md) · [简体中文](./README.md)  
> Platform guide: [docs/api-client-guide.zh-CN.md](../../../docs/api-client-guide.zh-CN.md)

## Architecture

```text
Business / third-party application
        │ createApiClient(config)
        ▼
mergeConfig (deep merge, inputs never mutated)
        ▼
Isolated Axios instance
        ├── Request ID / Metadata / Auth
        ├── Consumer interceptors
        ├── Retry (idempotent methods, optional)
        ├── Error normalization → ApiError
        └── Lifecycle hooks
        ▼
        BFF / external APIs
```

**Responsibility boundaries**

| Layer | Responsibility |
|---|---|
| `client/`, `config/`, `interceptors/`, etc. | Pure HTTP SDK — no React, no EventBus |
| `react/` | `ApiClientProvider`, Query integration, EventBus bridge |

## Project structure

```text
src/
├── client/           ApiClient, createApiClient
├── config/           ApiClientConfig, defaults, mergeConfig
├── interceptors/     Request / response / error pipeline
├── auth/             AuthConfig (dependency injection)
├── error/            ApiError, ErrorCode, normalizeError
├── retry/            Retry policy and interceptor
├── observability/    ApiLogger, log sanitization
├── hooks/            Lifecycle hooks (observe only, no mutation)
├── utils/            requestId generator
├── react/            ApiClientProvider, PlatformQueryClientProvider
├── pagination.ts     Pagination types and utilities
├── createQueryClient.ts
├── queryKeys.ts
└── index.ts          Single public entry point
```

## Installation

Workspace dependency inside the monorepo:

```bash
pnpm add @palette/platform-api-client
```

Peer dependency: `react` ^18 (required only for React Provider / Query hooks).

## Quick start

### Standalone client (recommended: app-level singleton)

```typescript
// apps/trading-app/src/platform/apiClient.ts
import { createApiClient } from '@palette/platform-api-client';

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_BFF_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: { 'X-Application': 'trading-app' },
  auth: {
    enabled: true,
    getAccessToken: () => authService.getAccessToken(),
    onUnauthorized: () => authService.logout(),
  },
});

// Business code
import { apiClient } from '@/platform/apiClient';
const user = await apiClient.get<User>('/users/me');
```

### Palette application (Provider)

```tsx
import { ApiClientProvider, useApiClient } from '@palette/platform-api-client';

<ApiClientProvider config={platformConfig}>
  <App />
</ApiClientProvider>
```

```typescript
const api = useApiClient();
const trades = await api.get<Trade[]>('/trades');
```

EventBus events (`API_REQUEST`, `API_RESPONSE`, `ERROR`, `AUTH_EXPIRED`) are bridged via hooks in `react/ApiClientProvider` only. The core layer does not depend on EventBus.

## Configuration

`mergeConfig` deep-merges application config onto platform defaults. **Input objects are never mutated.**

### Defaults

| Field | Default | Description |
|-------|---------|-------------|
| `baseURL` | `''` | API base path |
| `timeout` | `10000` | Timeout (ms) |
| `withCredentials` | `true` | Send cookies (BFF sessions) |
| `auth.enabled` | `true` | Attach Bearer token when available |
| `retry.enabled` | `false` | Retry disabled by default |
| `retry.retries` | `0` | Max retry attempts |
| `retry.retryDelay` | `500` | Exponential backoff base (ms) |
| `retry.retryOn` | `502,503,504` | Retriable status codes |
| `retry.retryMethods` | `GET,HEAD,OPTIONS,PUT,DELETE` | Idempotent methods |
| `requestId.enabled` | `true` | Auto-generate request ID |
| `requestId.headerName` | `X-Request-ID` | Request ID header |
| `requestId.correlationHeaderName` | `X-Correlation-ID` | Correlation ID header |

### Full configuration example

```typescript
import { createApiClient } from '@palette/platform-api-client';

const apiClient = createApiClient({
  baseURL: '/palette/api',
  timeout: 15_000,
  withCredentials: true,
  headers: { 'X-Application': 'trading-app' },
  metadata: {
    applicationId: 'trading-app',
    clientVersion: '1.0.0',
  },
  auth: {
    enabled: true,
    getAccessToken: async () => authStore.getToken(),
    onUnauthorized: async () => authStore.logout(),
  },
  retry: {
    enabled: true,
    retries: 2,
    retryDelay: 500,
    retryOn: [502, 503, 504],
  },
  interceptors: {
    request: [
      async (config) => {
        config.headers.set('X-Tenant', 'apac');
        return config;
      },
    ],
  },
  hooks: {
    beforeRequest: async (ctx) => console.log('→', ctx.method, ctx.url),
    afterResponse: async (ctx) => console.log('←', ctx.status, ctx.durationMs),
    onError: async (error) => console.log('✗', error.code),
  },
  logger: console,
  requestId: { enabled: true },
});
```

## HTTP methods

```typescript
await apiClient.get<T>(url, config?);
await apiClient.post<T>(url, data?, config?);
await apiClient.put<T>(url, data?, config?);
await apiClient.patch<T>(url, data?, config?);
await apiClient.delete<T>(url, config?);
await apiClient.request<T>({ method, url, data?, ...config });
await apiClient.getPage<T>(url, pageRequest?, config?);
```

`ApiRequestConfig`:

```typescript
interface ApiRequestConfig {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}
```

## Interceptor pipeline

**Request**

1. Request ID
2. Metadata (`X-Application-ID`, `X-Client-Version`)
3. Auth (Bearer token)
4. Consumer request interceptors
5. `beforeRequest` hook

**Response**

1. Platform logging
2. Consumer response interceptors
3. `afterResponse` hook

**Error**

1. Retry (when enabled, idempotent methods only)
2. Normalize to `ApiError`
3. `onUnauthorized` (401)
4. Consumer error interceptors
5. `onError` hook

**Interceptors vs hooks**

| | Interceptors | Hooks |
|---|---|---|
| Purpose | Modify request/response/error pipeline | Observe lifecycle events |
| Failure impact | Can abort the request | Isolated — does not break requests |

## Authentication

Injected via configuration. **No dependency** on `platform-security`, Redux, or Zustand:

```typescript
auth: {
  enabled: true,
  getAccessToken: () => token,
  onUnauthorized: () => logout(),
}
```

- When a token is available, `Authorization: Bearer <token>` is attached automatically
- An existing `Authorization` header set by the consumer is **never overwritten**
- BFF cookie sessions: omit `getAccessToken`, keep `withCredentials: true`
- External APIs: `auth: { enabled: false }`

The client **does not store tokens** and **does not redirect the browser** from interceptors.

## Error handling

```typescript
import { ApiError, ErrorCode, normalizeError } from '@palette/platform-api-client';

try {
  await apiClient.get('/orders');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.code);       // ErrorCode.UNAUTHORIZED
    console.log(error.status);     // 401
    console.log(error.requestId);  // distributed tracing
    console.log(error.details);    // response body
  }
}

// Non-ApiError cases (e.g. ErrorBoundary)
const plain = normalizeError(error); // { code, message, status?, requestId?, details? }
```

Supported codes include `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `REQUEST_TIMEOUT`, `TOO_MANY_REQUESTS`, `INTERNAL_SERVER_ERROR`, `BAD_GATEWAY`, `SERVICE_UNAVAILABLE`, `NETWORK_ERROR`, and more (see `ErrorCode`).

## Retry

Disabled by default. `POST` is not in the default retriable methods.

```typescript
retry: {
  enabled: true,
  retries: 3,
  retryDelay: 500,  // 500ms → 1000ms → 2000ms
  retryOn: [502, 503, 504],
}
```

Never retried: `401`, `403`, `404`.

## Pagination

```typescript
import { createQueryKeyFactory, usePaginatedQuery } from '@palette/platform-api-client';

export const tradeKeys = createQueryKeyFactory('trades');

// Direct call
const page = await apiClient.getPage<Trade>('/trades', { page: 1, pageSize: 20 });

// TanStack Query
function useTradesPage() {
  const api = useApiClient();
  return usePaginatedQuery({
    queryKey: tradeKeys.pageLists(),
    queryFn: (req) => api.getPage<Trade>('/trades', req),
    initialPageSize: 10,
  });
}
```

`normalizePageResponse` supports Palette page shape, Spring Page, and plain arrays.

## Multiple instances

```typescript
export const bffClient = createApiClient({ baseURL: '/api' });
export const reportingClient = createApiClient({ baseURL: '/reporting-api' });
export const externalClient = createApiClient({
  baseURL: 'https://external.example.com',
  auth: { enabled: false },
  withCredentials: false,
});
```

Each instance has isolated configuration and interceptors.

## Observability

```typescript
createApiClient({ logger: console });
```

Logs are automatically sanitized — `Authorization`, cookies, tokens, passwords, and other sensitive fields are redacted.

## TanStack Query

```typescript
import {
  createQueryClient,
  PlatformQueryClientProvider,
  usePaginatedQuery,
} from '@palette/platform-api-client';
```

In Palette apps, `PalettePlatformProvider` typically mounts the Query client. Business code uses `useQuery` exported from `@palette/platform-sdk`.

## Public API

Import only from the package root:

```typescript
// Core
createApiClient, ApiClient, mergeConfig, DEFAULT_API_CLIENT_CONFIG
ApiError, ErrorCode, normalizeError

// Types
ApiClientConfig, ApiRequestConfig, AuthConfig, PageRequest, PageResponse
ApiRequestInterceptor, ApiResponseInterceptor, ApiErrorInterceptor
BeforeRequestHook, AfterResponseHook, OnErrorHook

// Pagination
normalizePageResponse, resolvePageRequest, toPageQueryParams, createQueryKeyFactory
DEFAULT_PAGE, DEFAULT_PAGE_SIZE

// React
ApiClientProvider, useApiClient
PlatformQueryClientProvider, usePlatformQueryClient
createQueryClient, usePaginatedQuery
```

Do **not** import from internal paths such as `@palette/platform-api-client/src/...`.

## Security

1. Tokens are never stored inside the client — retrieved dynamically via `getAccessToken`
2. Tokens, cookies, and passwords are never logged
3. `withCredentials` is configurable per instance
4. External APIs should explicitly set `auth: { enabled: false }`

## Development

```bash
pnpm --filter @palette/platform-api-client build
pnpm --filter @palette/platform-api-client typecheck
pnpm test   # run full test suite from palette-ui root
```
