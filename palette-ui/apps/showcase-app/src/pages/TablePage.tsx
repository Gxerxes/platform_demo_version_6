import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ApiError, ContentCard, PageTitle, useApiClient } from '@palette/platform-sdk';
import { useEffect, useState } from 'react';

interface Trade {
  id: string;
  symbol: string;
  side: string;
  quantity: number;
  status: string;
}

export function TablePage() {
  const api = useApiClient();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTrades() {
      setLoading(true);
      setError(null);

      try {
        const data = await api.get<Trade[]>('/trades');
        if (!cancelled) {
          setTrades(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError ? err.message : 'Failed to load trades from BFF';
          setError(message);
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
  }, [api]);

  return (
    <>
      <PageTitle
        title="Table"
        subtitle="Live data from Palette BFF — GET /api/trades"
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
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.symbol}</TableCell>
                    <TableCell>{row.side}</TableCell>
                    <TableCell align="right">{row.quantity.toLocaleString()}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ContentCard>
    </>
  );
}
