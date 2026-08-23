# 分支策略

## 分支模型

采用 **GitFlow 简化版**：

```
main ─────────────────────────────────────────► (生产就绪)
  │
  ├── develop ────────────────────────────────► (集成分支)
  │     │
  │     ├── feature/phase-1-ui-shell
  │     ├── feature/phase-2-sdk
  │     └── feature/xxx
  │
  ├── release/0.1.0 ──────────────────────────► (发布分支)
  │
  └── hotfix/fix-session-bug ─────────────────► (紧急修复)
```

## 分支说明

| 分支 | 用途 | 保护 | 合并目标 |
|------|------|------|----------|
| `main` | 生产就绪代码 | ✓ Protected | — |
| `develop` | 日常集成 | ✓ Protected | `main`（发布时） |
| `feature/*` | 功能开发 | — | `develop` |
| `release/*` | 发布准备 | — | `main` + `develop` |
| `hotfix/*` | 紧急修复 | — | `main` + `develop` |

## 命名规范

```
feature/<phase>-<short-description>    # feature/phase-1-application-shell
bugfix/<issue-id>-<description>        # bugfix/PAL-123-fix-token-refresh
hotfix/<description>                   # hotfix/session-expiration
release/<version>                      # release/0.1.0
```

## 工作流

### 功能开发

```bash
git checkout develop
git pull origin develop
git checkout -b feature/phase-1-ui-shell

# ... 开发 ...

git push origin feature/phase-1-ui-shell
# 创建 Merge Request → develop
```

### 发布

```bash
git checkout -b release/0.1.0 develop
# 更新版本号、CHANGELOG
# 创建 MR → main
# 合并后打 tag: v0.1.0
```

### 紧急修复

```bash
git checkout -b hotfix/fix-description main
# 修复
# MR → main，然后 cherry-pick 到 develop
```

## Merge Request 规则

- 至少 1 位 Platform Team 成员 Approve
- CI 流水线全部通过
- 无未解决的 Review 评论
- Squash merge 到目标分支
