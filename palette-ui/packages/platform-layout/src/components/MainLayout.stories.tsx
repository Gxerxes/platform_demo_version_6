import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@mui/material';
import { mockAppConfig, mockNavigation, withNavigation } from '@palette/storybook-decorators';
import { MainLayout } from './MainLayout';

const meta: Meta<typeof MainLayout> = {
  title: 'Layout/MainLayout',
  component: MainLayout,
  tags: ['autodocs'],
  decorators: [withNavigation],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full enterprise page layout combining Header, Sidebar, Breadcrumb, and content area.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainLayout>;

export const Default: Story = {
  args: {
    config: mockAppConfig,
    navigation: mockNavigation,
    children: (
      <Typography variant="body1">
        Business application content goes here.
      </Typography>
    ),
  },
};
