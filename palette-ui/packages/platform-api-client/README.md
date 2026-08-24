# @palette/platform-api-client

Enterprise HTTP client for Palette — Axios-based, framework-agnostic core with optional React integration.

## Structure

```text
src/
├── client/          ApiClient + createApiClient factory
├── config/          ApiClientConfig, defaults, mergeConfig
├── interceptors/    request / response / error pipeline
├── auth/            AuthConfig (dependency injection)
├── error/           ApiError, ErrorCode, normalizeError
├── retry/           retry policy + interceptor
├── observability/   ApiLogger + metadata sanitization
├── hooks/           lifecycle hooks (observe only)
├── utils/           requestId generator
├── react/           ApiClientProvider, Query integration
├── pagination.ts
└── index.ts         public API
```

## Quick Start

```typescript
import { createApiClient } from '@palette/platform-api-client';

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_BFF_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  auth: {
    enabled: true,
    getAccessToken: () => authService.getAccessToken(),
    onUnauthorized: () => authService.logout(),
  },
});

const user = await apiClient.get<User>('/users/me');
```

## Configuration

| Field | Default | Description |
|-------|---------|-------------|
| `baseURL` | `''` | API base path |
| `timeout` | `10000` | Request timeout (ms) |
| `withCredentials` | `true` | Send cookies (BFF sessions) |
| `auth.enabled` | `true` | Attach Bearer token when available |
| `retry.enabled` | `false` | Retry idempotent requests |
| `requestId.enabled` | `true` | Generate `X-Request-ID` |

## Interceptor Pipeline

**Request:** Request ID → Metadata → Auth → Consumer interceptors → Hooks

**Response:** Platform logging → Consumer interceptors → Hooks

**Error:** Retry → Normalize → Unauthorized → Consumer error interceptors → Hooks

## Error Handling

```typescript
import { ApiError, ErrorCode } from '@palette/platform-api-client';

try {
  await apiClient.get('/orders');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.code, error.status, error.requestId);
  }
}
```

## React (Palette Apps)

```tsx
<ApiClientProvider config={platformConfig}>
  <App />
</ApiClientProvider>
```

```typescript
const api = useApiClient();
```

EventBus integration lives in the React provider layer — the core client has no React or EventBus dependency.

## Public API

Import only from `@palette/platform-api-client`:

```typescript
createApiClient, ApiClient, ApiError, ErrorCode, mergeConfig, normalizeError
createQueryClient, usePaginatedQuery, useApiClient  // React
```

Internal modules are not part of the public contract.
