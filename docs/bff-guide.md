# Palette BFF 开发指南

## 概述

`palette-bff` 是 Palette 平台的统一 Backend-for-Frontend 服务，负责：

- OIDC 认证与 Session 管理
- Access Token / Refresh Token 生命周期
- 用户信息及权限上下文
- 业务 API 代理（携带 Token 转发）

业务应用**不应**直接处理 OIDC Token，所有认证由 BFF 统一负责。

## 本地开发

```bash
cd palette-bff
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

`local` profile 启用 Mock 认证，无需 IdP 即可开发。

## 认证模式

| 模式 | Profile | 说明 |
|------|---------|------|
| `mock` | `local` | 自动注入 Demo 用户，适合本地开发 |
| `oidc` | 默认 | 对接 Enterprise IdP |

## 标准认证流程

```
Browser → Palette UI → Palette BFF → Enterprise IdP
                         │
                    Session Cookie
                         │
                    Browser ← BFF ← IdP
```

业务 API 调用：

```
React → Palette BFF (Session) → Access Token → Business Service
```

## API 端点

| 端点 | 说明 |
|------|------|
| `GET /api/auth/login` | 发起登录 |
| `POST /api/auth/logout` | 登出 |
| `GET /api/auth/user` | 当前用户 |
| `GET /api/auth/session` | Session 信息 |
| `GET /api/auth/status` | 完整认证状态 |
| `GET /actuator/health` | 健康检查 |

## 错误码标准

| Code | HTTP | 说明 |
|------|------|------|
| `AUTH_REQUIRED` | 401 | 未认证 |
| `AUTH_TOKEN_EXPIRED` | 401 | Token 过期 |
| `FORBIDDEN` | 403 | 无权限 |
| `PROXY_ERROR` | 502 | 下游服务错误 |
| `INTERNAL_ERROR` | 500 | 服务器错误 |

## OIDC 配置

```bash
export OIDC_ISSUER_URI=https://idp.example.com/realms/palette
export OIDC_CLIENT_ID=palette-bff
export OIDC_CLIENT_SECRET=your-secret
```

## 与前端联调

1. 启动 BFF：`mvn spring-boot:run -Dspring-boot.run.profiles=local`
2. 启动 UI：`cd palette-ui && pnpm dev`
3. Vite 已将 `/api` 代理至 `http://localhost:8080`

## 下一步

Phase 5 将实现 UI + BFF 完整集成，包括前端认证状态管理与 Session 过期处理。
