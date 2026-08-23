import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import {
  mockAppConfig,
  mockNavigation,
  mockPlatformConfig,
  mockPermissions,
} from '@palette/storybook-decorators';
import { PaletteApp } from './PaletteApp';

const meta: Meta<typeof PaletteApp> = {
  title: 'SDK/PaletteApp',
  component: PaletteApp,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Single entry point for business applications. Combines Shell, Platform Provider, permissions, and navigation filtering.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PaletteApp>;

export const Default: Story = {
  args: {
    config: mockAppConfig,
    platformConfig: mockPlatformConfig,
    navigation: mockNavigation,
    permissions: mockPermissions,
    children: (
      <Routes>
        <Route
          path="*"
          element={
            <Typography sx={{ p: 3 }}>
              PaletteApp provides the complete enterprise application foundation.
            </Typography>
          }
        />
      </Routes>
    ),
  },
};
