# Palette BFF 开发指南

本文档面向在 Palette 平台上开发、扩展和运维 BFF 的工程师。

## 1. 概述

`palette-bff` 是 Palette 企业平台的统一 **Backend-for-Frontend** 服务，基于 **Spring Boot 3** 与 **Spring Security 6** 构建。

BFF 的核心职责：

- OIDC 浏览器认证与 Session 管理
- Access Token / Refresh Token 服务端生命周期管理
- 用户信息与权限上下文
- 面向消费者的稳定 API 契约（含版本化）
- 业务 API 代理（携带 Token 转发至下游服务）
- 横切企业能力：请求追踪、审计、限流、下游弹性、标准化错误

业务应用和前端**不应**直接处理 OIDC Token；所有认证由 BFF 统一负责。

相关文档：

- [企业架构说明](./bff-enterprise-architecture.md)
- [英文开发指南](./bff-development-guide.en.md)
- [已知限制与后续工作](./bff-roadmap.md)

---

## 2. 环境要求

| 工具 | 版本 |
|------|------|
| Java | 21+ |
| Maven | 3.9+ |
| Redis | 6+（生产环境 Session 存储，可选） |

---

## 3. 快速开始

### 3.1 本地开发（Mock 模式）

无需 IdP，适合 UI 联调与功能开发：

```bash
cd palette-bff
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

| 地址 | 说明 |
|------|------|
| http://localhost:8080 | BFF 服务 |
| http://localhost:8080/swagger-ui.html | Swagger UI |
| http://localhost:8080/v3/api-docs | OpenAPI JSON |

### 3.2 验证接口

```bash
# 健康检查
curl http://localhost:8080/actuator/health

# 当前用户（Mock 自动认证）
curl http://localhost:8080/api/auth/user

# 版本化 API
curl http://localhost:8080/palette/api/v1/auth/user

# Demo 业务数据
curl http://localhost:8080/api/trades
```

### 3.3 OIDC 模式

```bash
export OIDC_ISSUER_URI=https://your-idp/realms/palette
export OIDC_CLIENT_ID=palette-bff
export OIDC_CLIENT_SECRET=your-secret

mvn spring-boot:run
```

浏览器访问 `GET /api/auth/login` 将重定向至 IdP，认证成功后建立 Session 并跳转回前端。

---

## 4. 项目结构

```
palette-bff/src/main/java/com/palette/bff/
├── PaletteBffApplication.java
├── api/                    # API 版本路径常量
├── authentication/         # 登录、登出、Session、Token
├── configuration/          # 配置、CORS、Redis Session、方法级安全
├── exception/              # 统一异常与错误响应
├── logging/                # 结构化请求日志
├── platform/
│   ├── audit/              # 审计日志
│   ├── context/            # 请求上下文（Request ID / Correlation ID）
│   ├── observability/      # MDC 日志
│   ├── ratelimit/          # 限流
│   └── resilience/         # 下游代理弹性
├── proxy/                  # API 代理与 Demo 业务 API
├── security/               # Spring Security、授权
└── user/                   # 用户信息映射
```

---

## 5. 认证模式

| 模式 | 配置 | 适用场景 |
|------|------|----------|
| `mock` | `palette.auth.mode=mock` | 本地开发，自动注入 Demo 用户 |
| `oidc` | `palette.auth.mode=oidc`（默认） | 对接 Enterprise IdP |

### 5.1 浏览器认证流程

```
Browser → Palette UI → Palette BFF → Enterprise IdP
                         │
                    Session Cookie (PALETTE_SESSION)
                         │
                    Browser ← BFF ← IdP
```

业务 API 调用：

```
React → BFF (Session Cookie) → Access Token → Downstream Service
```

### 5.2 机器 / 第三方认证（可选）

适用于 M2M 或第三方系统，与浏览器 Session 分离：

```yaml
palette:
  auth:
    machine:
      enabled: true
      issuer-uri: ${OIDC_ISSUER_URI}
      audience: palette-bff
```

启用后支持 JWT Bearer Token 访问 API，Refresh Token 仍保留在服务端。

---

## 6. API 设计

### 6.1 路径版本

| 路径前缀 | 状态 | 说明 |
|----------|------|------|
| `/api/**` | 遗留（兼容） | 现有前端继续使用 |
| `/palette/api/v1/**` | 推荐 | 版本化公共契约 |

两套路径由同一 Controller 提供服务，行为一致。

### 6.2 认证 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/auth/login` 或 `/palette/api/v1/auth/login` | 发起登录 |
| POST | `/api/auth/logout` | 登出 |
| GET | `/api/auth/user` | 当前用户 |
| GET | `/api/auth/session` | Session 信息 |
| GET | `/api/auth/status` | 认证状态（含 Token 元信息，不含 Token 值） |

### 6.3 Mock 业务 API（`local` profile）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/dashboard/summary` | Dashboard 汇总 |
| GET | `/api/trades` | 交易列表 |
| POST | `/api/trades` | 创建交易 |
| GET | `/api/settlements` | 结算列表 |
| GET | `/api/reports/daily` | 日报 |

Mock 默认权限：`dashboard:view`, `trades:view`, `trades:create`, `reports:view`, `settlements:view`, `admin:view`

### 6.4 代理 API

当 `palette.proxy.enabled=true` 时，`/api/**`（除 `/api/auth/**`）及 `/palette/api/v1/**` 将代理至 `palette.proxy.base-url`，并自动附加 Bearer Access Token。

---

## 7. 错误响应

统一错误格式：

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

| Code | HTTP | 说明 |
|------|------|------|
| `UNAUTHENTICATED` | 401 | 未认证 |
| `FORBIDDEN` | 403 | 无权限 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 400 | 参数校验失败 |
| `CONFLICT` | 409 | 资源冲突 |
| `RATE_LIMITED` | 429 | 超过限流 |
| `DOWNSTREAM_TIMEOUT` | 504 | 下游超时 |
| `DOWNSTREAM_UNAVAILABLE` | 502 | 下游不可用 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

错误响应中的 `requestId` 与响应头 `X-Request-Id` 一致，便于排查。

---

## 8. 请求上下文

每个请求自动建立追踪上下文：

| Header | 说明 |
|--------|------|
| `X-Request-Id` | 请求唯一 ID（缺失时自动生成） |
| `X-Correlation-Id` | 关联 ID（用于跨服务追踪） |
| `X-Trace-Id` | 追踪 ID |
| `X-Consumer-Id` | 消费者标识（仅作追踪，不作认证依据） |
| `X-Application-Id` | 应用标识 |

下游代理会自动传播 `X-Request-Id`、`X-Correlation-Id` 等 Header。

---

## 9. 授权

权限从 IdP claims（`permissions` 或 `roles`）或 Mock 配置注入，通过 `AuthorizationService` 统一校验：

```java
@PreAuthorize("@authorizationService.hasPermission('trades:create')")
public Map<String, Object> createTrade(...) { ... }
```

导航与 UI 层权限由前端 `PermissionGuard` 控制；**服务端必须独立校验**。

---

## 10. 配置参考

### 10.1 核心配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `palette.auth.mode` | `oidc` / `mock` | `oidc` |
| `palette.auth.login-success-url` | 登录成功跳转 | `http://localhost:3000` |
| `palette.auth.machine.enabled` | 启用 JWT M2M 认证 | `false` |
| `palette.session.store` | `memory` / `redis` | `memory` |
| `palette.proxy.enabled` | 是否启用 API 代理 | `true` |
| `palette.proxy.base-url` | 下游服务地址 | `http://localhost:9090` |
| `palette.rate-limit.enabled` | 是否启用限流 | `false` |
| `palette.cors.allowed-origins` | CORS 白名单 | `http://localhost:3000` |

### 10.2 环境 Profile

| Profile | 用途 |
|---------|------|
| `local` | Mock 认证，关闭代理，适合本地联调 |
| `prod` | Redis Session、限流、关闭 Swagger，fail-fast 校验 |

配置层次：

```
application.yml → application-{profile}.yml → 环境变量 / Secrets
```

### 10.3 生产环境 OIDC

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

## 11. 与前端联调

```bash
# 终端 1：BFF
cd palette-bff && mvn spring-boot:run -Dspring-boot.run.profiles=local

# 终端 2：UI
cd palette-ui && pnpm dev:trading
```

前端配置：

```ts
export const platformConfig: PalettePlatformConfig = {
  api: { baseUrl: '/api' },
  auth: { enabled: true },
};
```

Vite 代理（**必须保留 `/api` 前缀**）：

```ts
proxy: {
  '/api': { target: 'http://localhost:8080', changeOrigin: true },
}
```

---

## 12. 测试

```bash
# 运行全部测试
mvn clean test

# 打包
mvn clean package
```

测试覆盖：健康检查、Mock 认证、业务 API、Swagger、v1 路径、请求上下文、权限服务。

---

## 13. 容器部署

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

Kubernetes 健康探针：

- Liveness: `GET /actuator/health/liveness`
- Readiness: `GET /actuator/health/readiness`

---

## 14. 开发规范

1. **公共 API 使用版本前缀** `/palette/api/v1/`，同时保持 `/api/` 向后兼容
2. **不在响应中暴露** Access Token、Refresh Token、堆栈信息
3. **权限在服务端校验**，不依赖前端传参
4. **Secrets 不入库**，使用环境变量或密钥管理系统
5. **新增端点补充 Swagger 注解**，并更新本文档
6. **写操作考虑幂等性**（见 [路线图](./bff-roadmap.md)）

---

## 15. 常见问题

**Q: 前端 401 后无法登录？**  
确认 Vite 代理未 strip `/api` 前缀，且 BFF 已启动。

**Q: CORS 报错？**  
在 `application-local.yml` 的 `palette.cors.allowed-origins` 中添加前端端口（如 `3001`）。

**Q: prod 启动失败？**  
`ProductionConfigValidator` 会校验：禁止 mock 模式、禁止内存 Session、OIDC secret 不能为默认值。

**Q: Swagger 在生产环境要关闭吗？**  
是。参考 `application-prod.yml` 中 `springdoc` 配置。
