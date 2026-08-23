import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createApp, detectUsedPorts, pickNextPort } from './createApp.js';
import { isValidAppSlug, renderTemplate, toAppSlug, toDisplayName, toPackageName } from './utils.js';

describe('utils', () => {
  it('converts names to app slugs', () => {
    expect(toAppSlug('Settlement App')).toBe('settlement-app');
    expect(toAppSlug('reporting')).toBe('reporting');
  });

  it('builds package and display names', () => {
    expect(toPackageName('settlement-app')).toBe('@palette/settlement-app');
    expect(toDisplayName('settlement-app')).toBe('Settlement App');
  });

  it('validates app slugs', () => {
    expect(isValidAppSlug('settlement-app')).toBe(true);
    expect(isValidAppSlug('1bad')).toBe(false);
  });

  it('renders template placeholders', () => {
    expect(renderTemplate('Hello __APP_NAME__', { APP_NAME: 'Trading' })).toBe('Hello Trading');
  });
});

describe('createApp', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('picks the next available port', () => {
    expect(pickNextPort(new Set([3002, 3003]), 3002)).toBe(3004);
  });

  it('detects used ports from app vite configs', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'palette-ports-'));
    tempDirs.push(root);

    const appsDir = path.join(root, 'apps');
    fs.mkdirSync(path.join(appsDir, 'demo-app'), { recursive: true });
    fs.writeFileSync(
      path.join(appsDir, 'demo-app', 'vite.config.ts'),
      'export default { server: { port: 3010 } }',
      'utf8',
    );

    expect(detectUsedPorts(appsDir)).toEqual(new Set([3010]));
  });

  it('scaffolds a monorepo app with palette aliases', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'palette-create-'));
    tempDirs.push(root);

    createApp({
      appSlug: 'settlement-app',
      displayName: 'Settlement App',
      packageName: '@palette/settlement-app',
      port: 3011,
      targetDir: path.join(root, 'apps', 'settlement-app'),
      paletteVersion: '0.7.0',
      monorepo: true,
    });

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(root, 'apps', 'settlement-app', 'package.json'), 'utf8'),
    );
    const viteConfig = fs.readFileSync(
      path.join(root, 'apps', 'settlement-app', 'vite.config.ts'),
      'utf8',
    );

    expect(packageJson.name).toBe('@palette/settlement-app');
    expect(packageJson.dependencies['@palette/platform-sdk']).toBe('workspace:*');
    expect(viteConfig).toContain('port: 3011');
    expect(viteConfig).toContain("import path from 'node:path'");
    expect(fs.existsSync(path.join(root, 'apps', 'settlement-app', 'src', 'App.tsx'))).toBe(true);
  });
});
