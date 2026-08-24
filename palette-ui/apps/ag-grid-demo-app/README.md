# AG Grid + platform-api-client Demo

Standalone demo application showing **server-side pagination** with:

- `@palette/platform-api-client` — `useApiClient()` + `api.getPage()`
- **AG Grid** Infinite Row Model + built-in pagination panel
- **Palette BFF** — `GET /api/trades?page=&pageSize=`

## Prerequisites

1. BFF running on port `8080` with `palette.auth.mode=mock`
2. Node.js 20+ and pnpm 9+

## Run

```bash
# From palette-ui root
pnpm install
pnpm dev:ag-grid-demo
```

Open http://localhost:3003

## Architecture

```text
TradesGridPage
    │
    │ AG Grid IDatasource.getRows()
    ▼
tradesService.getTradesPage(api, { page, pageSize })
    │
    │ api.getPage<Trade>('/trades', ...)
    ▼
BFF /api/trades?page=1&pageSize=10
    │
    ▼
PageResponse { items, total, page, pageSize, ... }
```

## Key files

| File | Purpose |
|------|---------|
| `src/pages/TradesGridPage.tsx` | AG Grid + infinite datasource |
| `src/features/trades/trades.service.ts` | `getPage` API call |
| `src/palette.config.ts` | Platform config (`baseURL`, auth) |

## Notes

- Uses `PaletteApp` for auth and API client wiring (same as other Palette apps).
- BFF seeds **30 mock trades** for pagination testing.
- Change page size via AG Grid pagination selector (5 / 10 / 20).
