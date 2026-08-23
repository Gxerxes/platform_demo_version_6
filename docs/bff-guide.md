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
3. Vite 将 `/api` 代理至 `http://localhost:8080`（保留 `/api` 前缀）
4. 在 `palette.config.ts` 中启用 BFF 认证：

```ts
export const platformConfig: PalettePlatformConfig = {
  api: { baseUrl: '/api' },
  auth: { enabled: true },
};
```

前端将自动：
- 从 `/api/auth/status` 加载用户与权限
- 在 Header 显示 UserMenu
- 401 响应时跳转登录
- 通过 Session Cookie 调用 BFF 代理 API

## 下一步

Phase 6 将提供完整的 Example Application 作为业务组 Reference Implementation。
