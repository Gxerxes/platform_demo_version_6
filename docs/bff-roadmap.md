# Palette BFF — 已知限制与后续工作

> Known Limitations & Future Work / Roadmap

本文档记录 Palette BFF 当前的能力边界、已知限制，以及规划中的后续工作。随版本迭代持续更新。

---

## 一、当前能力概览

以下能力**已实现**并可用于开发与测试：

| 能力 | 状态 | 说明 |
|------|------|------|
| OIDC 浏览器认证 | ✅ | Authorization Code Flow |
| Mock 本地认证 | ✅ | `local` profile |
| Session Cookie | ✅ | `PALETTE_SESSION`，HttpOnly |
| Token 服务端管理 | ✅ | 不向前端暴露 Token 值 |
| API 版本化 | ✅ | `/palette/api/v1/**` + 遗留 `/api/**` |
| 统一错误模型 | ✅ | 含 `requestId` |
| 请求上下文追踪 | ✅ | Request / Correlation / Trace ID |
| 方法级权限 | ✅ | `@PreAuthorize` + `AuthorizationService` |
| 审计日志 | ✅ | 登录、登出、鉴权失败、限流 |
| 限流（内存） | ✅ | 可配置，单实例 |
| 下游超时与 GET 重试 | ✅ | `DownstreamProxyService` |
| Redis Session（配置） | ✅ | `palette.session.store=redis` |
| JWT M2M 认证（可选） | ✅ | `palette.auth.machine.enabled` |
| Swagger / OpenAPI | ✅ | 本地与 dev 环境 |
| 健康探针 | ✅ | liveness / readiness |
| 容器化 | ✅ | `Dockerfile` |
| 生产 fail-fast 校验 | ✅ | `prod` profile |

---

## 二、已知限制

### 2.1 架构与扩展性

| 限制 | 影响 | 说明 |
|------|------|------|
| 包结构未完全分层 | 中 | 尚未迁移至 `api/application/domain/infrastructure` 完整分层，当前在现有包上增量扩展 |
| 无完整消费者注册表 | 中 | 第三方 Client ID、Scopes、Rate Policy 尚未独立建模 |
| 代理层非 API Gateway | 低 | BFF 不做全量网关能力（WAF、mTLS 终结等由边缘层负责） |

### 2.2 安全

| 限制 | 影响 | 说明 |
|------|------|------|
| 限流为内存实现 | 高（多实例） | 水平扩展时各实例独立计数，无法全局一致限流 |
| 无 IdP 联合登出 | 中 | 当前仅清除 BFF 本地 Session，未实现 RP-initiated / Back-channel logout |
| CSRF 全局禁用 | 中 | 依赖 SameSite Cookie + SPA 模式；需根据部署拓扑评估 |
| Cookie `Secure` 默认 false | 中 | 本地开发默认关闭，生产需通过 `palette.session.cookie-secure=true` 或 HTTPS |
| 机器认证未含 Client Credentials | 中 | 当前仅 JWT Bearer；OAuth2 Client Credentials 流程待 IdP 能力确认后实现 |

### 2.3 弹性与可靠性

| 限制 | 影响 | 说明 |
|------|------|------|
| 无熔断器 | 高 | 下游持续失败时无 Circuit Breaker，仅有超时与 GET 重试 |
| 无 Bulkhead 隔离 | 中 | 下游慢响应可能影响整体线程池 |
| 写操作无自动重试 | 低（设计如此） | 非幂等写操作不自动重试，符合安全原则 |
| 代理错误部分透传 | 中 | 部分下游 4xx/5xx 仍直接返回 body，未统一映射为 Palette 错误码 |

### 2.4 数据与幂等性

| 限制 | 影响 | 说明 |
|------|------|------|
| 无 Idempotency-Key | 高（金融场景） | 写操作不支持幂等键去重 |
| Mock 数据内存存储 | 低 | Demo API 重启后数据重置，不适用于生产 |
| 无业务 DTO 层 | 中 | 部分 API 直接返回 `Map`，未完全使用强类型 DTO |

### 2.5 可观测性

| 限制 | 影响 | 说明 |
|------|------|------|
| 无分布式追踪集成 | 中 | 有 Correlation ID，但未集成 OpenTelemetry / Jaeger |
| Metrics 未定制 | 中 | 暴露 Actuator metrics，但无业务级自定义指标 |
| 审计日志仅写文件 | 中 | 未对接企业 SIEM / 审计平台 |

### 2.6 测试与发布

| 限制 | 影响 | 说明 |
|------|------|------|
| OIDC 集成测试不足 | 中 | 测试以 Mock profile 为主 |
| 无契约测试 | 中 | 未对公共 API 做自动化 schema 回归 |
| 无 K8s Manifest | 低 | 仅有 Dockerfile，Helm/K8s YAML 待补充 |

### 2.7 环境与配置

| 限制 | 影响 | 说明 |
|------|------|------|
| dev/sit/uat profile 未完整 | 低 | 仅有 `local` 与 `prod` 模板，中间环境需自行扩展 |
| Redis Session 未在 CI 验证 | 低 | 集成测试未覆盖 Redis Session 场景 |

---

## 三、后续工作路线图

### Priority 1 — 生产必备（建议下一迭代）

| 项 | 描述 | 预期收益 |
|----|------|----------|
| Redis 分布式限流 | 基于 Redis 的 per-consumer / per-endpoint 限流 | 多实例一致限流 |
| Resilience4j 熔断器 | 下游服务熔断与半开恢复 | 防止级联故障 |
| 下游错误统一映射 | 代理层 4xx/5xx 统一为 Palette 错误码 | 消费者体验一致 |
| OIDC 集成测试 | Testcontainers 或 WireMock IdP | 提升发布信心 |
| dev/sit/uat 配置模板 | 补齐中间环境 profile | 标准化部署 |

### Priority 2 — 企业增强

| 项 | 描述 | 预期收益 |
|----|------|----------|
| Idempotency-Key 支持 | 写操作幂等键 + 分布式存储 | 金融场景防重复提交 |
| 消费者注册表 | Client ID、Scopes、Rate Policy、环境权限 | 第三方治理 |
| OpenTelemetry 集成 | 分布式追踪与指标 | 生产可观测性 |
| SIEM 审计对接 | Audit 事件推送至企业审计系统 | 合规要求 |
| IdP 联合登出 | RP-initiated logout | 完整登出体验 |
| 强类型 API DTO | 公共 API 全面 DTO 化 | 契约清晰、校验集中 |

### Priority 3 — 长期演进

| 项 | 描述 | 预期收益 |
|----|------|----------|
| 包结构重构 | 迁移至 api/application/domain/infrastructure | 可维护性 |
| 契约测试自动化 | OpenAPI schema 回归 + 消费者驱动契约 | API 兼容性保障 |
| K8s / Helm Charts | 完整部署清单 | 标准化运维 |
| OAuth2 Client Credentials | M2M 无用户场景 | 系统集成 |
| API v2 规划 | 破坏性变更时的迁移策略 | 长期兼容性 |
| 细粒度 ABAC | 资源级授权 | 复杂权限场景 |

---

## 四、版本兼容策略

| 策略 | 当前做法 |
|------|----------|
| 向后兼容 | 保留 `/api/**`，新消费者使用 `/palette/api/v1/**` |
| 废弃通知 | 计划在公共 API 响应 Header 或文档中标注 `Deprecated` |
| 破坏性变更 | 通过新版本路径（如 v2）发布，旧版本保留至少一个 major 周期 |
| 前端迁移 | 现有 Palette UI 应用无需修改，可逐步迁移至 v1 路径 |

---

## 五、贡献与更新

- 发现新的限制或完成路线图项时，请更新本文档
- 开发指南：[中文版](./bff-development-guide.zh-CN.md) | [English](./bff-development-guide.en.md)
- 架构说明：[bff-enterprise-architecture.md](./bff-enterprise-architecture.md)

---

## English Summary

### Known Limitations (Highlights)

- In-memory rate limiting does not work across multiple instances
- No circuit breaker for downstream failures
- No `Idempotency-Key` support for write operations
- Limited OIDC integration test coverage
- Audit logs are file-based only (no SIEM integration yet)
- Package structure not fully layered

### Roadmap Priorities

1. **P1**: Redis rate limiting, circuit breaker, unified downstream error mapping, OIDC tests
2. **P2**: Idempotency keys, consumer registry, OpenTelemetry, SIEM audit, federated logout
3. **P3**: Package refactor, contract tests, K8s manifests, Client Credentials, API v2

See sections above for full details in Chinese.
