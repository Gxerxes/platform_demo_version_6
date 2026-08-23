import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@mui/material';
import { ContentCard } from './ContentCard';

const meta: Meta<typeof ContentCard> = {
  title: 'UI Common/ContentCard',
  component: ContentCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Outlined card container for page content sections.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

export const Default: Story = {
  args: {
    children: (
      <Typography>
        This is a standard content card with default padding.
      </Typography>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    noPadding: true,
    children: (
      <Typography sx={{ p: 2 }}>
        Content card without CardContent padding — useful for tables.
      </Typography>
    ),
  },
};
