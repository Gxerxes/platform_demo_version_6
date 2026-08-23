# 提交规范

采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## 格式

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Type

| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 重构（非新功能、非修复） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具/依赖变更 |
| `ci` | CI/CD 配置变更 |

## Scope

使用 package 名称作为 scope：

```
feat(platform-shell): add application header component
fix(platform-api-client): handle 401 token refresh
chore(ui-common): update dependencies
docs: add branching strategy guide
ci: add GitLab pipeline for lint and build
```

## 示例

```
feat(platform-shell): implement application shell with header and sidebar

- Add PaletteShell component
- Integrate with platform-layout
- Add basic routing support

Closes PAL-42
```

```
fix(platform-security): redirect to login on session expiration
```

```
chore: initialize monorepo with pnpm workspace
```

## 规则

- Subject 使用英文，动词原形开头，不超过 72 字符
- Body 说明 what 和 why，而非 how
- 一个 commit 只做一件事
- 破坏性变更在 footer 标注 `BREAKING CHANGE:`
