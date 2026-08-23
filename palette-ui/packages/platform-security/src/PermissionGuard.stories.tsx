import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@mui/material';
import { withPermissions } from '@palette/storybook-decorators';
import { PermissionGuard } from './PermissionGuard';

const meta: Meta<typeof PermissionGuard> = {
  title: 'Security/PermissionGuard',
  component: PermissionGuard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Conditionally renders children based on user permissions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PermissionGuard>;

export const Allowed: Story = {
  decorators: [withPermissions(['admin:view'])],
  args: {
    permission: 'admin:view',
    children: <Typography color="success.main">You have admin:view permission.</Typography>,
    fallback: <Typography color="error">Access denied.</Typography>,
  },
};

export const Denied: Story = {
  decorators: [withPermissions(['dashboard:view'])],
  args: {
    permission: 'admin:view',
    children: <Typography color="success.main">You have admin:view permission.</Typography>,
    fallback: <Typography color="error">Access denied — admin:view required.</Typography>,
  },
};
