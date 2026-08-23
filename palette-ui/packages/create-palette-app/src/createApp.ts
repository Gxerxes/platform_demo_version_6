import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTemplate } from './utils.js';

export interface CreateAppOptions {
  appSlug: string;
  displayName: string;
  packageName: string;
  port: number;
  targetDir: string;
  paletteVersion: string;
  monorepo: boolean;
}

export function findPaletteUiRoot(startDir: string): string | null {
  let current = path.resolve(startDir);

  while (current !== path.dirname(current)) {
    const workspaceFile = path.join(current, 'pnpm-workspace.yaml');
    if (fs.existsSync(workspaceFile)) {
      const workspace = fs.readFileSync(workspaceFile, 'utf8');
      if (workspace.includes('apps/*') && fs.existsSync(path.join(current, 'packages'))) {
        return current;
      }
    }
    current = path.dirname(current);
  }

  return null;
}

export function detectUsedPorts(appsDir: string): Set<number> {
  const ports = new Set<number>();

  if (!fs.existsSync(appsDir)) {
    return ports;
  }

  for (const entry of fs.readdirSync(appsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const viteConfig = path.join(appsDir, entry.name, 'vite.config.ts');
    if (!fs.existsSync(viteConfig)) {
      continue;
    }

    const content = fs.readFileSync(viteConfig, 'utf8');
    const match = content.match(/port:\s*(\d+)/);
    if (match?.[1]) {
      ports.add(Number(match[1]));
    }
  }

  return ports;
}

export function pickNextPort(usedPorts: Set<number>, start = 3002): number {
  let port = start;
  while (usedPorts.has(port)) {
    port += 1;
  }
  return port;
}

export function createApp(options: CreateAppOptions): void {
  if (fs.existsSync(options.targetDir)) {
    throw new Error(`Directory already exists: ${options.targetDir}`);
  }

  const templateDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../templates/default',
  );

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  const variables = {
    APP_SLUG: options.appSlug,
    APP_NAME: options.displayName,
    PACKAGE_NAME: options.packageName,
    PORT: String(options.port),
    VERSION: options.paletteVersion,
    SDK_DEPENDENCY: options.monorepo ? 'workspace:*' : `^${options.paletteVersion}`,
    TSCONFIG_EXTENDS: options.monorepo ? '../../tsconfig.base.json' : './tsconfig.app.json',
    PATH_IMPORT: options.monorepo ? "import path from 'node:path';" : '',
    PALETTE_ALIAS_SETUP: options.monorepo
      ? `
const packagesDir = path.resolve(__dirname, '../../packages');

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
    \`@palette/\${pkg}\`,
    path.join(packagesDir, pkg, 'src/index.ts'),
  ]),
);`
      : '',
    RESOLVE_BLOCK: options.monorepo
      ? `  resolve: {
    alias,
  },`
      : '',
  };

  copyTemplate(templateDir, options.targetDir, variables);
}

function copyTemplate(
  sourceDir: string,
  targetDir: string,
  variables: Record<string, string>,
): void {
  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyTemplate(sourcePath, targetPath, variables);
      continue;
    }

    const raw = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(targetPath, renderTemplate(raw, variables), 'utf8');
  }
}
