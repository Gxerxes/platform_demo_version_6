import { PaletteThemeProvider } from '@palette/platform-layout';
import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

const preview: Preview = {
  decorators: [
    (Story) => (
      <PaletteThemeProvider>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </PaletteThemeProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Palette',
          ['Introduction', 'Getting Started', 'Best Practices', 'Do & Don\'t', 'Migration Guide', 'API Reference'],
          'UI Common',
          'Layout',
          'Security',
          'Shell',
          'SDK',
        ],
      },
    },
  },
};

export default preview;
