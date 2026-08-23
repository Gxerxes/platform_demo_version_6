import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const packagesDir = path.resolve(dirname, '../packages');

const palettePackages = [
  'ui-common',
  'platform-config',
  'platform-navigation',
  'platform-layout',
  'platform-shell',
  'platform-event',
  'platform-api-client',
  'platform-security',
  'platform-provider',
  'platform-sdk',
];

const alias = Object.fromEntries(
  palettePackages.map((pkg) => [
    `@palette/${pkg}`,
    path.join(packagesDir, pkg, 'src/index.ts'),
  ]),
);

alias['@palette/storybook-decorators'] = path.join(dirname, 'decorators.tsx');

const config: StorybookConfig = {
  stories: [
    '../docs/**/*.mdx',
    '../packages/**/*.mdx',
    '../packages/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../docs/assets'],
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: { alias },
    });
  },
};

export default config;
