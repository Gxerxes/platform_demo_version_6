#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import { createApp, detectUsedPorts, findPaletteUiRoot, pickNextPort } from './createApp.js';
import { isValidAppSlug, toAppSlug, toDisplayName, toPackageName } from './utils.js';

interface CliOptions {
  name?: string;
  port?: number;
  title?: string;
  targetDir?: string;
  standalone?: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {};
  const positional: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg) {
      continue;
    }

    if (arg === '--port') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --port');
      }
      options.port = Number(value);
      index += 1;
      continue;
    }

    if (arg === '--title') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --title');
      }
      options.title = value;
      index += 1;
      continue;
    }

    if (arg === '--dir') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --dir');
      }
      options.targetDir = value;
      index += 1;
      continue;
    }

    if (arg === '--standalone') {
      options.standalone = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    positional.push(arg);
  }

  options.name = positional[0];
  return options;
}

function printHelp(): void {
  console.log(`Usage: create-palette-app <app-name> [options]

Create a new Palette business application from the standard template.

Options:
  --port <number>     Dev server port (default: next available from 3002)
  --title <name>      Application display name
  --dir <path>        Output directory (default: apps/<app-name> in monorepo)
  --standalone        Create outside monorepo with published package versions
  -h, --help          Show help

Examples:
  pnpm create palette-app settlement-app
  pnpm create palette-app reporting-app --port 3003
  pnpm create palette-app my-app --standalone
`);
}

function main(): void {
  try {
    const options = parseArgs(process.argv.slice(2));

    if (!options.name) {
      printHelp();
      process.exit(1);
    }

    const appSlug = toAppSlug(options.name);
    if (!isValidAppSlug(appSlug)) {
      throw new Error(
        `Invalid app name "${options.name}". Use letters, numbers, and hyphens (e.g. settlement-app).`,
      );
    }

    const paletteUiRoot = findPaletteUiRoot(process.cwd());
    const monorepo = !options.standalone && paletteUiRoot !== null;

    let targetDir: string;
    if (options.targetDir) {
      targetDir = path.resolve(options.targetDir);
    } else if (monorepo && paletteUiRoot) {
      targetDir = path.join(paletteUiRoot, 'apps', appSlug);
    } else {
      targetDir = path.resolve(process.cwd(), appSlug);
    }

    const usedPorts = paletteUiRoot
      ? detectUsedPorts(path.join(paletteUiRoot, 'apps'))
      : new Set<number>();
    const port = options.port ?? pickNextPort(usedPorts);
    const displayName = options.title ?? toDisplayName(appSlug);
    const packageName = toPackageName(appSlug);
    const paletteVersion = '0.7.0';

    createApp({
      appSlug,
      displayName,
      packageName,
      port,
      targetDir,
      paletteVersion,
      monorepo,
    });

    console.log('');
    console.log(`✓ Created Palette app "${displayName}" at ${targetDir}`);
    console.log('');
    console.log('Next steps:');

    if (monorepo && paletteUiRoot) {
      console.log(`  cd ${path.relative(process.cwd(), paletteUiRoot) || '.'}`);
      console.log('  pnpm install');
      console.log(`  pnpm --filter ${packageName} dev`);
      console.log('');
      console.log('Optional: add a root script in palette-ui/package.json:');
      console.log(`  "dev:${appSlug}": "pnpm --filter ${packageName} dev"`);
    } else {
      console.log(`  cd ${path.relative(process.cwd(), targetDir) || appSlug}`);
      console.log('  pnpm install');
      console.log('  pnpm dev');
      console.log('');
      console.log('Note: standalone apps require @palette/* packages from your company registry.');
    }

    console.log('');
    console.log(`Dev server: http://localhost:${port}`);
    console.log('');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`create-palette-app: ${message}`);
    process.exit(1);
  }
}

main();
