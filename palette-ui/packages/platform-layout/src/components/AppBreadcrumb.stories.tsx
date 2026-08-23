import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { mockNavigation } from '@palette/storybook-decorators';
import { AppBreadcrumb } from './AppBreadcrumb';

const meta: Meta<typeof AppBreadcrumb> = {
  title: 'Layout/AppBreadcrumb',
  component: AppBreadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Route-based breadcrumb navigation derived from NavItem configuration.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppBreadcrumb>;

export const Home: Story = {
  args: { navigation: mockNavigation },
  parameters: { reactRouter: { routePath: '/' } },
  decorators: [
    (Story) => (
      <div style={{ width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const Settings: Story = {
  args: { navigation: mockNavigation },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/settings']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};
