# Palette BFF Enterprise Architecture

## Overview

Palette BFF is a consumer-oriented API layer — not a simple reverse proxy. It owns authentication integration, session management, token lifecycle, API composition, and cross-cutting enterprise concerns.

## Module Responsibilities

| Package | Responsibility |
|---------|----------------|
| `authentication/` | Login, logout, user, session, token APIs |
| `security/` | Spring Security (OIDC + Mock), headers, authorization |
| `proxy/` | Downstream proxy + demo business APIs |
| `platform/context/` | Request ID, correlation ID, trace propagation |
| `platform/audit/` | Structured audit events (AUDIT logger) |
| `platform/ratelimit/` | Per-consumer rate limiting |
| `platform/resilience/` | Downstream timeouts, GET retry |
| `platform/observability/` | MDC structured logging |
| `configuration/` | Properties, Redis session, method security |
| `exception/` | Standard error contract |
| `api/` | Versioned API path constants |

## API Versioning

| Path | Status |
|------|--------|
| `/api/**` | Legacy (backward compatible) |
| `/palette/api/v1/**` | Versioned public contract |

Both paths are served by the same controllers.

## Authentication Models

### Browser Applications
```
Browser → OIDC Authorization Code → BFF Session → HttpOnly PALETTE_SESSION cookie
```

### Machine / Third-Party (optional)
Enable `palette.auth.machine.enabled=true` for JWT Bearer validation alongside session auth.

```yaml
palette:
  auth:
    machine:
      enabled: true
      issuer-uri: ${OIDC_ISSUER_URI}
      audience: palette-bff
```

## Session Storage

| Environment | Store |
|-------------|-------|
| local / dev | In-memory (`palette.session.store=memory`) |
| prod | Redis (`palette.session.store=redis`) |

Production validator fails fast if mock mode or in-memory session is used.

## Error Contract

```json
{
  "code": "UNAUTHENTICATED",
  "message": "Authentication required",
  "requestId": "abc-123",
  "timestamp": "2026-08-23T10:00:00Z",
  "path": "/palette/api/v1/trades"
}
```

## Request Flow

```
Consumer
   │
   ▼
PaletteRequestContextFilter (request/correlation ID)
   │
   ▼
RateLimitFilter
   │
   ▼
SecurityHeadersFilter
   │
   ▼
Spring Security (OIDC / Mock / JWT)
   │
   ▼
Controller
   │
   ▼
DownstreamProxyService (timeout, GET retry)
   │
   ▼
Downstream Service
```

## Configuration Hierarchy

```
application.yml (defaults)
  + application-{profile}.yml (local/dev/sit/uat/prod)
  + environment variables / secrets
```

## Production Checklist

- [ ] `palette.auth.mode=oidc`
- [ ] `palette.session.store=redis` + Redis credentials via env
- [ ] `palette.cors.allowed-origins` configured (no `*`)
- [ ] `OIDC_CLIENT_SECRET` from secret manager
- [ ] `springdoc` disabled in prod
- [ ] `palette.rate-limit.enabled=true`
- [ ] Docker / K8s health probes on `/actuator/health/liveness` and `/readiness`

## Deferred (Future Work)

See [BFF Roadmap & Known Limitations](../docs/bff-roadmap.md) for the full list.

- Redis-backed distributed rate limiting
- Resilience4j circuit breaker
- Idempotency-Key support for write APIs
- Full consumer registry (client ID, scopes, rate policies)
- Contract tests / schema validation automation
