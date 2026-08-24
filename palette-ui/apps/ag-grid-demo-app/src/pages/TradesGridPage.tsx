import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { ApiError, ContentCard, PageTitle, useApiClient } from '@palette/platform-sdk';
import { tradesService } from '../features/trades/trades.service';
import type { Trade } from '../features/trades/types';

const PAGE_SIZE = 10;

export function TradesGridPage() {
  const api = useApiClient();
  const gridRef = useRef<AgGridReact<Trade>>(null);
  const [error, setError] = useState<string | null>(null);

  const columnDefs = useMemo<ColDef<Trade>[]>(
    () => [
      { field: 'id', headerName: 'Trade ID', flex: 1, minWidth: 120 },
      { field: 'symbol', headerName: 'Symbol', flex: 1, minWidth: 100 },
      {
        field: 'side',
        headerName: 'Side',
        width: 100,
        cellClass: (params) => (params.value === 'BUY' ? 'cell-buy' : 'cell-sell'),
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        type: 'numericColumn',
        flex: 1,
        minWidth: 120,
        valueFormatter: (params) => params.value?.toLocaleString() ?? '',
      },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'tradeDate', headerName: 'Trade Date', flex: 1, minWidth: 130 },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: false,
      filter: false,
      resizable: true,
    }),
    [],
  );

  const onGridReady = useCallback(
    (event: GridReadyEvent<Trade>) => {
      const dataSource: IDatasource = {
        getRows: async (params: IGetRowsParams) => {
          const blockSize = params.endRow - params.startRow;
          const page = Math.floor(params.startRow / blockSize) + 1;

          try {
            setError(null);
            const result = await tradesService.getTradesPage(api, {
              page,
              pageSize: blockSize,
            });
            params.successCallback(result.items, result.total);
          } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load trades');
            params.failCallback();
          }
        },
      };

      event.api.setGridOption('datasource', dataSource);
    },
    [api],
  );

  return (
    <>
      <PageTitle
        title="Trades Grid"
        subtitle="Server-side pagination: AG Grid Infinite Row Model + platform-api-client getPage()"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ContentCard noPadding>
        <Stack spacing={1} sx={{ p: 2, pb: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Data source: BFF <code>GET /api/trades?page=&amp;pageSize=</code> via{' '}
            <code>api.getPage()</code>
          </Typography>
        </Stack>

        <Box
          sx={{
            height: 520,
            width: '100%',
            p: 2,
            pt: 1,
            '& .cell-buy': { color: '#2e7d32', fontWeight: 600 },
            '& .cell-sell': { color: '#c62828', fontWeight: 600 },
          }}
          className="ag-theme-quartz"
        >
          <AgGridReact<Trade>
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowModelType="infinite"
            cacheBlockSize={PAGE_SIZE}
            maxBlocksInCache={5}
            pagination
            paginationPageSize={PAGE_SIZE}
            paginationPageSizeSelector={[5, 10, 20]}
            onGridReady={onGridReady}
            animateRows
            overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading trades...</span>'
            overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">No trades found</span>'
          />
        </Box>
      </ContentCard>
    </>
  );
}
