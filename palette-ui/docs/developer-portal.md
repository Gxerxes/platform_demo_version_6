# Palette Developer Portal

Palette 开发者门户基于 **Storybook** 构建，提供组件文档、使用示例和 API 参考。

## 启动

```bash
cd palette-ui
pnpm storybook
```

访问 http://localhost:6006

## 构建静态站点

```bash
pnpm storybook:build
```

输出目录：`storybook-static/`

可部署到 GitLab Pages 或内部文档服务器。

## 文档结构

| 文档 | 说明 |
|------|------|
| Introduction | 平台概述与架构 |
| Getting Started | 快速上手指南 |
| Best Practices | 企业级开发最佳实践 |
| Do & Don't | 推荐与反模式 |
| Migration Guide | 迁移指南 |
| API Reference | SDK API 参考 |

## 组件 Stories

| 分类 | 组件 |
|------|------|
| UI Common | PageTitle, ContentCard |
| Layout | AppHeader, AppBreadcrumb, MainLayout |
| Security | PermissionGuard |
| Shell | PaletteShell |
| SDK | PaletteApp |

## 添加新 Story

在对应 package 的 `src/` 目录下创建 `ComponentName.stories.tsx`：

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'UI Common/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: { /* props */ },
};
```

Storybook 会自动发现并收录。

## 添加 MDX 文档

在 `docs/` 目录下创建 `.mdx` 文件：

```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Palette/My Document" />

# My Document

Content here...
```
