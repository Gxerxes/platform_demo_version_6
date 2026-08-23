import { Alert, Chip, Grid, Stack, Typography } from '@mui/material';
import {
  ApiError,
  ContentCard,
  PageTitle,
  useApiClient,
  useAuth,
} from '@palette/platform-sdk';
import { useEffect, useMemo, useState } from 'react';
import { createTradingApi } from '../features/trades/api';
import type { DashboardSummary } from '../features/trades/types';

export function DashboardPage() {
  const api = useApiClient();
  const tradingApi = useMemo(() => createTradingApi(api), [api]);
  const { user, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      setLoading(true);
      setError(null);

      try {
        const data = await tradingApi.getDashboardSummary();
        if (!cancelled) {
          setSummary(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load dashboard summary');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      cancelled = true;
    };
  }, [tradingApi]);

  return (
    <>
      <PageTitle
        title="Trading Dashboard"
        subtitle="Post-Trade overview — data from BFF GET /api/dashboard/summary"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <ContentCard>
          <Typography variant="h6" gutterBottom>
            Session
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={isAuthenticated ? `Signed in as ${user?.displayName}` : 'Not authenticated'}
              color={isAuthenticated ? 'success' : 'warning'}
            />
            {user && (
              <Chip
                label={`${user.permissions.length} permissions`}
                variant="outlined"
              />
            )}
          </Stack>
        </ContentCard>

        {loading ? (
          <ContentCard>
            <Typography color="text.secondary">Loading summary...</Typography>
          </ContentCard>
        ) : summary ? (
          <Grid container spacing={+2}>
            <Grid item xs={12} sm={6} md={3}>
              <ContentCard>
                <Typography variant="overline" color="text.secondary">
                  Total Trades
                </Typography>
                <Typography variant="h4">{summary.totalTrades}</Typography>
              </ContentCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ContentCard>
                <Typography variant="overline" color="text.secondary">
                  Settled
                </Typography>
                <Typography variant="h4" color="success.main">
                  {summary.settledTrades}
                </Typography>
              </ContentCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ContentCard>
                <Typography variant="overline" color="text.secondary">
                  Pending
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {summary.pendingTrades}
                </Typography>
              </ContentCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ContentCard>
                <Typography variant="overline" color="text.secondary">
                  Total Volume
                </Typography>
                <Typography variant="h4">{summary.totalVolume.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary">
                  As of {summary.asOfDate}
                </Typography>
              </ContentCard>
            </Grid>
          </Grid>
        ) : null}
      </Stack>
    </>
  );
}
