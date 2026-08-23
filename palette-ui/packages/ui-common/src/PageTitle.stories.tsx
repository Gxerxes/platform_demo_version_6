import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mui/material';
import { PageTitle } from './PageTitle';

const meta: Meta<typeof PageTitle> = {
  title: 'UI Common/PageTitle',
  component: PageTitle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Standard page title with optional subtitle and action slot.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageTitle>;

export const Default: Story = {
  args: {
    title: 'Dashboard',
    subtitle: 'Overview of your trading activity',
  },
};

export const WithAction: Story = {
  args: {
    title: 'Trades',
    subtitle: 'Manage your trade records',
    action: <Button variant="contained">New Trade</Button>,
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Settings',
  },
};
