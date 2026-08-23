import { Alert, Stack, Typography } from '@mui/material';
import { ApiError, ContentCard, PageTitle, useApiClient } from '@palette/platform-sdk';
import { useEffect, useMemo, useState } from 'react';
import { createTradingApi } from '../features/trades/api';
import type { DailyReport } from '../features/trades/types';

export function ReportsPage() {
  const api = useApiClient();
  const tradingApi = useMemo(() => createTradingApi(api), [api]);
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      setLoading(true);
      setError(null);

      try {
        const data = await tradingApi.getDailyReport();
        if (!cancelled) {
          setReport(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load daily report');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadReport();

    return () => {
      cancelled = true;
    };
  }, [tradingApi]);

  return (
    <>
      <PageTitle
        title="Daily Report"
        subtitle="Generated report from BFF GET /api/reports/daily"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ContentCard>
        {loading ? (
          <Typography color="text.secondary">Generating report...</Typography>
        ) : report ? (
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Report Date:</strong> {report.reportDate}
            </Typography>
            <Typography variant="body1">
              <strong>Buy Trades:</strong> {report.buyCount}
            </Typography>
            <Typography variant="body1">
              <strong>Sell Trades:</strong> {report.sellCount}
            </Typography>
            <Typography variant="body1">
              <strong>Top Symbol:</strong> {report.topSymbol}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Generated at {new Date(report.generatedAt).toLocaleString()}
            </Typography>
          </Stack>
        ) : null}
      </ContentCard>
    </>
  );
}
