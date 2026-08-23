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
  TableRow,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  ApiError,
  ContentCard,
  PageTitle,
  PermissionGuard,
  useApiClient,
} from '@palette/platform-sdk';
import { useEffect, useMemo, useState } from 'react';
import { createTradingApi } from '../features/trades/api';
import type { Trade } from '../features/trades/types';

export function TradesPage() {
  const api = useApiClient();
  const tradingApi = useMemo(() => createTradingApi(api), [api]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTrades() {
      setLoading(true);
      setError(null);

      try {
        const data = await tradingApi.getTrades();
        if (!cancelled) {
          setTrades(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load trades');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTrades();

    return () => {
      cancelled = true;
    };
  }, [tradingApi]);

  return (
    <>
      <PageTitle
        title="Trades"
        subtitle="Live trade blotter from BFF GET /api/trades"
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
          {error}
        </Alert>
      )}

      <ContentCard noPadding>
        {loading ? (
          <CircularProgress sx={{ display: 'block', m: 4 }} />
        ) : (
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
        )}
      </ContentCard>

      {!loading && trades.length === 0 && (
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Alert severity="info">No trades found. Create one from the New Trade page.</Alert>
        </Stack>
      )}
    </>
  );
}
