# Settlement App

Palette business application scaffolded with `create-palette-app`.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3002

## BFF Integration

```bash
# Terminal 1
cd palette-bff && mvn spring-boot:run -Dspring-boot.run.profiles=local

# Terminal 2
pnpm dev
```

## Project Structure

```
src/
├── App.tsx              # Routes + PaletteApp
├── palette.config.ts    # App & platform config
├── navigation.tsx       # Sidebar navigation
├── pages/               # Page components
└── features/            # Business API & logic (add here)
```

## Customize

1. Update `palette.config.ts` — app name, theme, API base URL
2. Edit `navigation.tsx` — routes and permissions
3. Add pages under `src/pages/`
4. Add feature modules under `src/features/`

See [Palette Example App Guide](https://github.com/palette/docs/example-app-guide.md) for best practices.
