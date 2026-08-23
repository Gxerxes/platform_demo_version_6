import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const packagesDir = path.resolve(__dirname, '../../packages');

const palettePackages = [
  'ui-common',
  'platform-config',
  'platform-navigation',
  'platform-layout',
  'platform-shell',
];

const alias = Object.fromEntries(
  palettePackages.map((pkg) => [
    `@palette/${pkg}`,
    path.join(packagesDir, pkg, 'src/index.ts'),
  ]),
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias,
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
