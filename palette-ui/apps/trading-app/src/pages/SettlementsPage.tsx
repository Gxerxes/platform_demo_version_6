import {
  Alert,
  Chip,
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
import { useEffect, useMemo, useState } from 'react';
import { createTradingApi } from '../features/trades/api';
import type { Settlement } from '../features/trades/types';

export function SettlementsPage() {
  const api = useApiClient();
  const tradingApi = useMemo(() => createTradingApi(api), [api]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSettlements() {
      setLoading(true);
      setError(null);

      try {
        const data = await tradingApi.getSettlements();
        if (!cancelled) {
          setSettlements(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load settlements');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSettlements();

    return () => {
      cancelled = true;
    };
  }, [tradingApi]);

  return (
    <>
      <PageTitle
        title="Settlements"
        subtitle="Settlement records from BFF GET /api/settlements"
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
                  <TableCell>Settlement ID</TableCell>
                  <TableCell>Trade ID</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Value Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {settlements.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.tradeId}</TableCell>
                    <TableCell align="right">
                      {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{row.currency}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        color={row.status === 'Completed' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>{row.valueDate}</TableCell>
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
