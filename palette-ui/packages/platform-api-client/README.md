# @palette/platform-api-client

Enterprise-grade, configurable HTTP client SDK for the Palette platform.

Framework-agnostic core (Axios-based) with optional React integration for Palette applications.

## Overview

`@palette/platform-api-client` provides:

- Configurable Axios instance factory (`createApiClient`)
- Dependency-injected authentication
- Request ID / correlation ID support
- Unified error normalization (`ApiError`)
- Optional retry with exponential backoff
- Consumer interceptors and lifecycle hooks
- Safe observability logging (sensitive data redaction)
- Pagination utilities
- TanStack Query helpers (React)

## Installation

This package is part of the Palette monorepo:

```bash
pnpm add @palette/platform-api-client
```

Peer dependency: React 18+ (only required for React providers/hooks).

## Quick Start

```typescript
import { createApiClient } from '@palette/platform-api-client';

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_BFF_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    'X-Application': 'trading-app',
  },
});

const user = await apiClient.get<User>('/users/me');
```

## Configuration

```typescript
import { createApiClient, mergeConfig, DEFAULT_API_CLIENT_CONFIG } from '@palette/platform-api-client';

const apiClient = createApiClient({
  baseURL: '/palette/api',
  timeout: 15_000,
  withCredentials: true,
  auth: {
    enabled: true,
    getAccessToken: () => authService.getAccessToken(),
    onUnauthorized: () => authService.logout(),
  },
  retry: {
    enabled: true,
    retries: 2,
    retryDelay: 500,
    retryOn: [502, 503, 504],
  },
  requestId: {
    enabled: true,
    headerName: 'X-Request-ID',
  },
  logger: console,
});
```

Consumer configuration deep-merges onto platform defaults. Input objects are never mutated.

Legacy Palette alias `baseUrl` is supported alongside `baseURL`.

## Authentication Integration

Authentication is injected through configuration — the client does **not** import `platform-security`, Redux, or Zustand.

```typescript
createApiClient({
  auth: {
    enabled: true,
    getAccessToken: async () => tokenStore.get(),
    onUnauthorized: async () => {
      await authService.logout();
    },
  },
});
```

- When a token is returned, `Authorization: Bearer <token>` is attached.
- Existing `Authorization` headers supplied by the consumer are **not** overwritten.
- For BFF cookie sessions, omit `getAccessToken` and set `withCredentials: true`.

## BFF Usage

```typescript
const bffClient = createApiClient({
  baseURL: '/api',
  withCredentials: true,
  auth: { enabled: true },
});
```

401 responses trigger `onUnauthorized` and normalize to `ApiError` with code `UNAUTHORIZED`. The client does **not** perform browser redirects.

## Interceptors

```typescript
createApiClient({
  interceptors: {
    request: [
      async (config) => {
        config.headers.set('X-Tenant', 'apac');
        return config;
      },
    ],
    response: [(response) => response],
    error: [(error) => Promise.reject(error)],
  },
});
```

### Pipeline Order

**Request**

1. Platform request ID
2. Platform metadata headers
3. Authentication
4. Consumer request interceptors

**Response**

1. Platform response interceptors (logging)
2. Consumer response interceptors

**Error**

1. Retry (idempotent methods, when enabled)
2. Error normalization → `ApiError`
3. Unauthorized handler
4. Consumer error interceptors
5. Lifecycle `onError` hooks

## Lifecycle Hooks

Hooks observe events; they do not modify the HTTP pipeline.

```typescript
createApiClient({
  hooks: {
    beforeRequest: async (ctx) => {
      console.log('starting', ctx.url);
    },
    afterResponse: async (ctx) => {
      console.log('completed', ctx.status, ctx.durationMs);
    },
    onError: async (error) => {
      console.log('failed', error.code);
    },
  },
});
```

Hook failures are isolated and logged safely.

## Error Handling

```typescript
import { ApiError, ErrorCode } from '@palette/platform-api-client';

try {
  await apiClient.get('/orders');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.code);      // e.g. UNAUTHORIZED
    console.log(error.status);    // e.g. 401
    console.log(error.requestId); // tracing
  }
}
```

Supported mappings include `401`, `403`, `404`, `408`, `429`, `500`, `502`, `503`, network errors, and timeouts.

## Retry

Disabled by default. Only idempotent methods retry by default: `GET`, `HEAD`, `OPTIONS`, `PUT`, `DELETE`.

```typescript
retry: {
  enabled: true,
  retries: 3,
  retryDelay: 500, // exponential: 500ms, 1000ms, 2000ms
  retryOn: [502, 503, 504],
}
```

`POST` is never retried unless explicitly added to `retryMethods`.

## Request ID

```typescript
requestId: {
  enabled: true,
  headerName: 'X-Request-ID',
  correlationHeaderName: 'X-Correlation-ID',
}
```

Existing request IDs supplied by consumers are preserved.

## Observability

```typescript
createApiClient({
  logger: {
    debug: (msg, meta) => console.debug(msg, meta),
    info: (msg, meta) => console.info(msg, meta),
    warn: (msg, meta) => console.warn(msg, meta),
    error: (msg, meta) => console.error(msg, meta),
  },
});
```

Sensitive headers and body fields (`Authorization`, tokens, passwords) are redacted automatically.

## Runtime Configuration

```typescript
const runtimeConfig = await loadRuntimeConfig();

export const apiClient = createApiClient({
  baseURL: runtimeConfig.apiBaseUrl,
  timeout: runtimeConfig.timeout,
});
```

Never hardcode environment-specific URLs inside this package.

## Multiple API Clients

```typescript
export const bffClient = createApiClient({ baseURL: '/api' });
export const reportingClient = createApiClient({ baseURL: '/reporting-api' });
export const externalClient = createApiClient({
  baseURL: 'https://external-service',
  auth: { enabled: false },
  withCredentials: false,
});
```

Each instance is isolated — no shared mutable configuration or interceptors.

## Pagination

```typescript
const page = await apiClient.getPage<Trade>('/trades', { page: 1, pageSize: 20 });
```

React helper:

```typescript
const { items, page, setPage, total } = usePaginatedQuery({
  queryKey: tradeKeys.pageLists(),
  queryFn: (pageRequest) => apiClient.getPage<Trade>('/trades', pageRequest),
});
```

## Security Considerations

1. Tokens are never stored inside the client.
2. Tokens are retrieved dynamically via injected auth config.
3. Tokens and cookies are never logged.
4. `withCredentials` is configurable per instance.
5. Disable auth for external APIs with `auth: { enabled: false }`.

## React Integration (Palette Apps)

For Palette shell applications, use the provider instead of creating clients in every component:

```tsx
<ApiClientProvider config={platformConfig}>
  <App />
</ApiClientProvider>
```

```typescript
const api = useApiClient();
```

## Migration Guide

| Before (v0.x) | After (v1.x) |
|---------------|--------------|
| `new ApiClient({ baseUrl })` | `createApiClient({ baseUrl })` |
| `import { ApiError } from '.../errors'` | `import { ApiError } from '@palette/platform-api-client'` |
| `error.data` | `error.details` (`error.data` still works, deprecated) |
| `TIMEOUT_ERROR` code | `REQUEST_TIMEOUT` code |

Public HTTP method signatures (`get`, `post`, `put`, `patch`, `delete`, `getPage`) remain compatible.

## Architecture

```text
Business Application
        │ Configuration
        ▼
createApiClient (factory)
        ├── mergeConfig
        ├── Axios Instance (isolated)
        ├── Request Interceptors
        ├── Response Interceptors
        ├── Retry Policy
        ├── Error Normalization
        └── Lifecycle Hooks
        ▼
        BFF / External APIs
```

## Public API

Import only from the package root:

```typescript
import {
  createApiClient,
  ApiClient,
  ApiError,
  ErrorCode,
  mergeConfig,
} from '@palette/platform-api-client';
```

Do not import from internal paths.
