# Palette Enterprise Platform

公司级 Enterprise Platform，为证券交易 Post-Trade 业务提供统一的前端 UI Common Framework 和 BFF 基础能力。

## 项目组成

| 模块 | 说明 | 状态 |
|------|------|------|
| [palette-ui](./palette-ui/) | React + TypeScript 企业级 UI Common Framework | ✓ 完成 |
| [palette-bff](./palette-bff/) | Spring Boot 3 BFF 基础服务 | ✓ 完成 |

## 快速开始

```bash
# 安装依赖
cd palette-ui
pnpm install

# 启动 Showcase 应用
pnpm dev

# 构建所有包
pnpm build

# 启动 Storybook 开发者门户
pnpm storybook          # http://localhost:6006

# 构建 Storybook 静态站点
pnpm storybook:build

# 代码检查
pnpm lint
```

### BFF + UI 联调

```bash
# 终端 1：启动 BFF（Mock 模式）
cd palette-bff
mvn spring-boot:run -Dspring-boot.run.profiles=local

# 终端 2：启动 UI
cd palette-ui
pnpm dev    # http://localhost:3000，/api 代理至 BFF
```

## 开发阶段

| Phase | 目标 | 状态 |
|-------|------|------|
| Phase 0 | 项目基础设施 | ✓ 完成 |
| Phase 1 | UI Core（Shell / Layout / Theme） | ✓ 完成 |
| Phase 2 | UI Platform SDK | ✓ 完成 |
| Phase 3 | Storybook & Documentation | ✓ 完成 |
| Phase 4 | BFF MVP | ✓ 完成 |
| Phase 5 | UI + BFF Integration | ✓ 完成 |
| Phase 6 | Business Application Example | 待开始 |

## 文档

- [开发指南](./docs/development-guide.md)
- [分支策略](./docs/branching-strategy.md)
- [提交规范](./docs/commit-convention.md)
- [版本与发布策略](./docs/versioning-and-release.md)
- [BFF 开发指南](./docs/bff-guide.md)

## 技术栈

**Frontend (palette-ui)**

- React 18 + TypeScript
- Vite
- pnpm Monorepo
- MUI（Phase 1 引入）
- Storybook（Phase 3）
- Vitest（Phase 1+）

**Backend (palette-bff, Phase 4)**

- Java + Spring Boot 3
- Spring Security + OAuth2/OIDC
- Redis（Session）
