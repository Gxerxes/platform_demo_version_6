# 版本与发布策略

## 版本规范

采用 [Semantic Versioning 2.0.0](https://semver.org/)：

```
MAJOR.MINOR.PATCH
```

| 变更类型 | 版本递增 | 示例 |
|----------|----------|------|
| 破坏性 API 变更 | MAJOR | 1.0.0 → 2.0.0 |
| 向后兼容的新功能 | MINOR | 0.1.0 → 0.2.0 |
| 向后兼容的 Bug 修复 | PATCH | 0.1.0 → 0.1.1 |

当前处于 **0.x.x** 阶段（Pre-release），API 可能随时变更。

## Package 版本管理

palette-ui Monorepo 中各 `@palette/*` 包**统一版本号**，通过一次 release 同步发布。

```
@palette/ui-common@0.1.0
@palette/platform-shell@0.1.0
@palette/platform-sdk@0.1.0
...
```

## 发布流程

### 1. 准备发布

```bash
git checkout develop
git pull
git checkout -b release/0.2.0
```

### 2. 更新版本

- 更新所有 `packages/*/package.json` 中的 version
- 更新 `CHANGELOG.md`
- 提交：`chore: release v0.2.0`

### 3. 合并与打 Tag

```bash
# MR: release/0.2.0 → main
git tag v0.2.0
git push origin v0.2.0
```

### 4. 发布到 npm Registry

```bash
cd palette-ui
pnpm build
pnpm publish -r --access restricted
```

> npm Registry 地址和认证由 Platform Team 配置。

### 5. 同步 develop

```bash
git checkout develop
git merge main
```

## CHANGELOG 格式

```markdown
# Changelog

## [0.2.0] - 2026-09-01

### Added
- Application Shell with Header and Sidebar (Phase 1)
- Theme system with light/dark mode

### Changed
- Updated MUI to v6

### Fixed
- Sidebar collapse animation on mobile
```

## 发布节奏

| 阶段 | 节奏 |
|------|------|
| Phase 0-1 | 按需发布 |
| Phase 2+ | 每 2 周一个 MINOR 版本 |
| 生产环境 | PATCH 随时发布（hotfix） |
