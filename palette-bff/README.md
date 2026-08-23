# Palette BFF

Palette Enterprise BFF — 基于 Spring Boot 3 的统一 Backend-for-Frontend 服务。

## 能力

- OIDC Authentication（Authorization Code Flow）
- Login / Logout
- Session Management
- Access Token / Refresh Token Management
- UserInfo / Permission Context
- API Proxy（携带 Access Token 转发至业务服务）
- 标准化 Error Handling
- Health Check

## 快速开始

### 本地开发（Mock 模式，无需 IdP）

```bash
cd palette-bff
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

服务地址：http://localhost:8080

### 验证 API

```bash
# Health Check
curl http://localhost:8080/actuator/health

# 当前用户（Mock 模式自动认证）
curl http://localhost:8080/api/auth/user

# Session 状态
curl http://localhost:8080/api/auth/session

# 认证状态（含 Token 元信息）
curl http://localhost:8080/api/auth/status

# Demo 业务 API（Mock 模式）
curl http://localhost:8080/api/trades
```

### OIDC 模式

配置环境变量后启动：

```bash
export OIDC_ISSUER_URI=https://your-idp/realms/palette
export OIDC_CLIENT_ID=palette-bff
export OIDC_CLIENT_SECRET=your-secret

mvn spring-boot:run
```

登录流程：

1. 浏览器访问 `GET /api/auth/login`
2. 重定向至 Enterprise IdP
3. 认证成功后回调 BFF，建立 Session
4. 重定向至前端应用

## 项目结构

```
palette-bff/
├── authentication/     # Login, Logout, Session, Token
├── security/           # Spring Security, OIDC, Mock
├── proxy/              # API Proxy, Demo API
├── user/               # UserInfo
├── configuration/      # Properties, CORS, RestClient
├── exception/          # 标准化错误处理
└── logging/            # 请求日志
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/auth/login` | 发起 OIDC 登录 |
| POST | `/api/auth/logout` | 登出 |
| GET | `/api/auth/user` | 当前用户信息 |
| GET | `/api/auth/session` | Session 信息 |
| GET | `/api/auth/status` | 认证状态 |
| GET | `/actuator/health` | 健康检查 |
| * | `/api/**` | 代理至业务服务（除 `/api/auth/**`） |

## 标准错误响应

```json
{
  "code": "AUTH_REQUIRED",
  "message": "Authentication required",
  "timestamp": "2026-08-23T10:00:00Z",
  "path": "/api/trades",
  "details": null
}
```

## 配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `palette.auth.mode` | `oidc` 或 `mock` | `oidc` |
| `palette.auth.login-success-url` | 登录成功跳转 | `http://localhost:3000` |
| `palette.proxy.base-url` | 业务服务地址 | `http://localhost:9090` |
| `palette.proxy.enabled` | 是否启用代理 | `true` |

## 与前端集成

前端 `palette.config.ts` 中 API base URL 设为 BFF 地址：

```ts
platformConfig: {
  api: { baseUrl: '/api' }  // Vite proxy -> http://localhost:8080
}
```

Vite 代理配置：

```ts
proxy: {
  '/api': { target: 'http://localhost:8080', changeOrigin: true }
}
```

## 构建

```bash
mvn clean package
java -jar target/palette-bff-0.4.0.jar --spring.profiles.active=local
```
