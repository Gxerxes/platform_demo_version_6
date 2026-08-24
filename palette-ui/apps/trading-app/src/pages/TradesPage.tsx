import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ApiError, ContentCard, PageTitle, PermissionGuard } from '@palette/platform-sdk';
import { useTradesPage } from '../features/trades/trades.query';

export function TradesPage() {
  const {
    items: trades,
    isLoading,
    isFetching,
    error,
    page,
    pageSize,
    total,
    setPage,
    setPageSize,
  } = useTradesPage(10);

  return (
    <>
      <PageTitle
        title="Trades"
        subtitle="Paginated trade blotter from BFF GET /api/trades?page=&pageSize="
        action={
          <PermissionGuard permission="trades:create">
            <Button component={RouterLink} to="/trades/new" variant="contained">
              New Trade
            </Button>
          </PermissionGuard>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof ApiError ? error.message : 'Failed to load trades'}
        </Alert>
      )}

      <ContentCard noPadding>
        {isLoading ? (
          <CircularProgress sx={{ display: 'block', m: 4 }} />
        ) : (
          <>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Trade ID</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Side</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Trade Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trades.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.symbol}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.side}
                          size="small"
                          color={row.side === 'BUY' ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">{row.quantity.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          color={row.status === 'Settled' ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>{row.tradeDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={total}
              page={Math.max(0, page - 1)}
              onPageChange={(_, nextPage) => setPage(nextPage + 1)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(event) => setPageSize(Number(event.target.value))}
              rowsPerPageOptions={[5, 10, 20]}
              disabled={isFetching}
            />
          </>
        )}
      </ContentCard>

      {!isLoading && trades.length === 0 && (
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Alert severity="info">No trades found. Create one from the New Trade page.</Alert>
        </Stack>
      )}
    </>
  );
}
