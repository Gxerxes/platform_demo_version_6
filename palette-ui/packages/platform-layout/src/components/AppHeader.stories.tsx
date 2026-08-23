import type { Meta, StoryObj } from '@storybook/react';
import { mockAppConfig, withNavigation } from '@palette/storybook-decorators';
import { AppHeader } from './AppHeader';

const meta: Meta<typeof AppHeader> = {
  title: 'Layout/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  decorators: [withNavigation],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Application top bar with menu toggle, branding, and user avatar.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

export const Default: Story = {
  args: {
    config: mockAppConfig,
  },
};
