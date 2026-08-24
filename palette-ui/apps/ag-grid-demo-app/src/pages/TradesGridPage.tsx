import { useMemo } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  TablePagination,
  Typography,
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { ApiError, ContentCard, PageTitle } from '@palette/platform-sdk';
import { useTradesGrid } from '../features/trades/trades.query';
import type { Trade } from '../features/trades/types';

export function TradesGridPage() {
  const {
    items,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    isLoading,
    isFetching,
    error,
  } = useTradesGrid(5);

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

  const pageStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEnd = Math.min(page * pageSize, total);

  return (
    <>
      <PageTitle
        title="Trades Grid"
        subtitle="usePaginatedQuery + api.getPage() + AG Grid — 服务端分页"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof ApiError ? error.message : 'Failed to load trades'}
        </Alert>
      )}

      {total > 0 && total <= 5 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          当前仅 {total} 条数据。请<strong>重启 BFF</strong> 以加载 30 条 mock 数据并体验完整分页（共 6 页）。
        </Alert>
      )}

      <ContentCard noPadding>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, pt: 2, pb: 1 }}
        >
          <Typography variant="body2" color="text.secondary">
            BFF <code>GET /api/trades?page={page}&amp;pageSize={pageSize}</code>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {total > 0 ? `${pageStart}–${pageEnd} / ${total} 条` : '无数据'}
            {isFetching && !isLoading ? ' · 刷新中…' : ''}
          </Typography>
        </Stack>

        <Box
          sx={{
            height: 420,
            width: '100%',
            px: 2,
            position: 'relative',
            '& .cell-buy': { color: '#2e7d32', fontWeight: 600 },
            '& .cell-sell': { color: '#c62828', fontWeight: 600 },
          }}
          className="ag-theme-quartz"
        >
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
              <CircularProgress />
            </Stack>
          ) : (
            <AgGridReact<Trade>
              rowData={items}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows
              suppressCellFocus
              overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">No trades found</span>'
            />
          )}
        </Box>

        <TablePagination
          component="div"
          count={total}
          page={Math.max(0, page - 1)}
          onPageChange={(_, nextPage) => setPage(nextPage + 1)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(event) => setPageSize(Number(event.target.value))}
          rowsPerPageOptions={[5, 10, 20]}
          disabled={isFetching}
          labelDisplayedRows={({ from, to, count }) =>
            count === -1 ? `${from}–${to}` : `${from}–${to} / 共 ${count} 条`
          }
          labelRowsPerPage="每页条数"
        />
      </ContentCard>
    </>
  );
}
