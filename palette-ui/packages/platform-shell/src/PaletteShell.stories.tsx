import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { mockAppConfig, mockNavigation } from '@palette/storybook-decorators';
import { PaletteShell } from './PaletteShell';

const meta: Meta<typeof PaletteShell> = {
  title: 'Shell/PaletteShell',
  component: PaletteShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Application shell wrapping business content with Header, Sidebar, Breadcrumb, and Theme.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PaletteShell>;

export const Default: Story = {
  args: {
    config: mockAppConfig,
    navigation: mockNavigation,
    children: (
      <Routes>
        <Route
          path="*"
          element={
            <Typography sx={{ p: 3 }}>
              Wrap your business application inside PaletteShell.
            </Typography>
          }
        />
      </Routes>
    ),
  },
};
