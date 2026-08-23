# Palette BFF Development Guide

This guide is for engineers developing, extending, and operating the Palette BFF.

## 1. Overview

`palette-bff` is the unified **Backend-for-Frontend** service of the Palette Enterprise Platform, built on **Spring Boot 3** and **Spring Security 6**.

Core responsibilities:

- OIDC browser authentication and session management
- Server-side access token / refresh token lifecycle
- User information and permission context
- Stable, versioned consumer-facing API contracts
- Business API proxying (forwards requests with bearer tokens)
- Cross-cutting enterprise capabilities: request tracing, audit, rate limiting, downstream resilience, standardized errors

Business applications and frontends **must not** handle OIDC tokens directly. All authentication is owned by the BFF.

Related docs:

- [Enterprise Architecture](./bff-enterprise-architecture.md)
- [Chinese Development Guide](./bff-development-guide.zh-CN.md)
- [Known Limitations & Roadmap](./bff-roadmap.md)

---

## 2. Prerequisites

| Tool | Version |
|------|---------|
| Java | 21+ |
| Maven | 3.9+ |
| Redis | 6+ (production session store, optional for local) |

---

## 3. Quick Start

### 3.1 Local Development (Mock Mode)

No IdP required — ideal for UI integration and feature development:

```bash
cd palette-bff
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

| URL | Description |
|-----|-------------|
| http://localhost:8080 | BFF service |
| http://localhost:8080/swagger-ui.html | Swagger UI |
| http://localhost:8080/v3/api-docs | OpenAPI JSON |

### 3.2 Verify Endpoints

```bash
# Health check
curl http://localhost:8080/actuator/health

# Current user (auto-authenticated in mock mode)
curl http://localhost:8080/api/auth/user

# Versioned API
curl http://localhost:8080/palette/api/v1/auth/user

# Demo business data
curl http://localhost:8080/api/trades
```

### 3.3 OIDC Mode

```bash
export OIDC_ISSUER_URI=https://your-idp/realms/palette
export OIDC_CLIENT_ID=palette-bff
export OIDC_CLIENT_SECRET=your-secret

mvn spring-boot:run
```

Visit `GET /api/auth/login` in a browser to start the OIDC Authorization Code flow.

---

## 4. Project Structure

```
palette-bff/src/main/java/com/palette/bff/
├── PaletteBffApplication.java
├── api/                    # API version path constants
├── authentication/         # Login, logout, session, token
├── configuration/          # Config, CORS, Redis session, method security
├── exception/              # Unified exception and error responses
├── logging/                # Structured request logging
├── platform/
│   ├── audit/              # Audit logging
│   ├── context/            # Request context (Request ID / Correlation ID)
│   ├── observability/      # MDC logging
│   ├── ratelimit/          # Rate limiting
│   └── resilience/         # Downstream proxy resilience
├── proxy/                  # API proxy and demo business APIs
├── security/               # Spring Security, authorization
└── user/                   # User info mapping
```

---

## 5. Authentication Modes

| Mode | Config | Use Case |
|------|--------|----------|
| `mock` | `palette.auth.mode=mock` | Local dev with auto-injected demo user |
| `oidc` | `palette.auth.mode=oidc` (default) | Enterprise IdP integration |

### 5.1 Browser Authentication Flow

```
Browser → Palette UI → Palette BFF → Enterprise IdP
                         │
                    Session Cookie (PALETTE_SESSION)
                         │
                    Browser ← BFF ← IdP
```

Business API calls:

```
React → BFF (Session Cookie) → Access Token → Downstream Service
```

### 5.2 Machine / Third-Party Authentication (Optional)

For M2M or third-party consumers, separate from browser sessions:

```yaml
palette:
  auth:
    machine:
      enabled: true
      issuer-uri: ${OIDC_ISSUER_URI}
      audience: palette-bff
```

When enabled, JWT Bearer tokens are accepted. Refresh tokens remain server-side only.

---

## 6. API Design

### 6.1 Path Versioning

| Path Prefix | Status | Description |
|-------------|--------|-------------|
| `/api/**` | Legacy (compatible) | Used by existing frontends |
| `/palette/api/v1/**` | Recommended | Versioned public contract |

Both prefixes are served by the same controllers with identical behavior.

### 6.2 Authentication APIs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/login` or `/palette/api/v1/auth/login` | Initiate login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/user` | Current user |
| GET | `/api/auth/session` | Session info |
| GET | `/api/auth/status` | Auth status (token metadata only, no token values) |

### 6.3 Mock Business APIs (`local` profile)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/summary` | Dashboard summary |
| GET | `/api/trades` | Trade list |
| POST | `/api/trades` | Create trade |
| GET | `/api/settlements` | Settlement list |
| GET | `/api/reports/daily` | Daily report |

Default mock permissions: `dashboard:view`, `trades:view`, `trades:create`, `reports:view`, `settlements:view`, `admin:view`

### 6.4 Proxy APIs

When `palette.proxy.enabled=true`, `/api/**` (except `/api/auth/**`) and `/palette/api/v1/**` are proxied to `palette.proxy.base-url` with Bearer access tokens attached automatically.

---

## 7. Error Responses

Standard error format:

```json
{
  "code": "UNAUTHENTICATED",
  "message": "Authentication required",
  "requestId": "abc-123-def",
  "timestamp": "2026-08-23T10:00:00Z",
  "path": "/palette/api/v1/trades",
  "details": null
}
```

| Code | HTTP | Description |
|------|------|-------------|
| `UNAUTHENTICATED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Validation failed |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `DOWNSTREAM_TIMEOUT` | 504 | Downstream timeout |
| `DOWNSTREAM_UNAVAILABLE` | 502 | Downstream unavailable |
| `INTERNAL_ERROR` | 500 | Internal server error |

The `requestId` in the error body matches the `X-Request-Id` response header.

---

## 8. Request Context

Every request establishes tracing context:

| Header | Description |
|--------|-------------|
| `X-Request-Id` | Unique request ID (auto-generated if missing) |
| `X-Correlation-Id` | Correlation ID for cross-service tracing |
| `X-Trace-Id` | Trace ID |
| `X-Consumer-Id` | Consumer identifier (tracing only, not authentication) |
| `X-Application-Id` | Application identifier |

Downstream proxy calls automatically propagate these headers.

---

## 9. Authorization

Permissions are sourced from IdP claims (`permissions` or `roles`) or mock configuration, validated via `AuthorizationService`:

```java
@PreAuthorize("@authorizationService.hasPermission('trades:create')")
public Map<String, Object> createTrade(...) { ... }
```

UI-level permission checks use `PermissionGuard`; **server-side validation is mandatory**.

---

## 10. Configuration Reference

### 10.1 Key Properties

| Property | Description | Default |
|----------|-------------|---------|
| `palette.auth.mode` | `oidc` / `mock` | `oidc` |
| `palette.auth.login-success-url` | Post-login redirect | `http://localhost:3000` |
| `palette.auth.machine.enabled` | Enable JWT M2M auth | `false` |
| `palette.session.store` | `memory` / `redis` | `memory` |
| `palette.proxy.enabled` | Enable API proxy | `true` |
| `palette.proxy.base-url` | Downstream base URL | `http://localhost:9090` |
| `palette.rate-limit.enabled` | Enable rate limiting | `false` |
| `palette.cors.allowed-origins` | CORS allowlist | `http://localhost:3000` |

### 10.2 Environment Profiles

| Profile | Purpose |
|---------|---------|
| `local` | Mock auth, proxy disabled, local UI integration |
| `prod` | Redis session, rate limiting, Swagger disabled, fail-fast validation |

Configuration hierarchy:

```
application.yml → application-{profile}.yml → environment variables / secrets
```

### 10.3 Production OIDC

```bash
export OIDC_ISSUER_URI=https://idp.example.com/realms/palette
export OIDC_CLIENT_ID=palette-bff
export OIDC_CLIENT_SECRET=<from-secret-manager>
export REDIS_HOST=redis.internal
export REDIS_PASSWORD=<from-secret-manager>
```

```bash
java -jar palette-bff.jar --spring.profiles.active=prod
```

---

## 11. Frontend Integration

```bash
# Terminal 1: BFF
cd palette-bff && mvn spring-boot:run -Dspring-boot.run.profiles=local

# Terminal 2: UI
cd palette-ui && pnpm dev:trading
```

Frontend config:

```ts
export const platformConfig: PalettePlatformConfig = {
  api: { baseUrl: '/api' },
  auth: { enabled: true },
};
```

Vite proxy (**must preserve the `/api` prefix**):

```ts
proxy: {
  '/api': { target: 'http://localhost:8080', changeOrigin: true },
}
```

---

## 12. Testing

```bash
# Run all tests
mvn clean test

# Build package
mvn clean package
```

Test coverage includes: health checks, mock auth, business APIs, Swagger, v1 paths, request context, authorization service.

---

## 13. Container Deployment

```bash
mvn clean package -DskipTests
docker build -t palette-bff:latest .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e OIDC_ISSUER_URI=... \
  -e OIDC_CLIENT_SECRET=... \
  -e REDIS_HOST=... \
  palette-bff:latest
```

Kubernetes health probes:

- Liveness: `GET /actuator/health/liveness`
- Readiness: `GET /actuator/health/readiness`

---

## 14. Development Conventions

1. Use versioned public APIs at `/palette/api/v1/` while keeping `/api/` backward compatible
2. **Never expose** access tokens, refresh tokens, or stack traces in responses
3. **Validate permissions server-side** — do not trust client-provided identity headers
4. **Keep secrets out of source control** — use env vars or secret managers
5. **Annotate new endpoints** with Swagger and update this guide
6. **Consider idempotency** for write operations (see [roadmap](./bff-roadmap.md))

---

## 15. FAQ

**Q: Frontend gets 401 and login redirect fails?**  
Ensure the Vite proxy does not strip the `/api` prefix and the BFF is running.

**Q: CORS errors?**  
Add your frontend origin to `palette.cors.allowed-origins` in `application-local.yml`.

**Q: Prod startup fails?**  
`ProductionConfigValidator` rejects mock mode, in-memory sessions, and default OIDC secrets.

**Q: Should Swagger be disabled in production?**  
Yes. See `application-prod.yml` for `springdoc` settings.
