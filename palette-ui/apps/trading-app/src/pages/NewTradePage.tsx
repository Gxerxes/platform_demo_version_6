import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  ApiError,
  ContentCard,
  PageTitle,
  PermissionGuard,
  useApiClient,
  useNotification,
} from '@palette/platform-sdk';
import { FormEvent, useMemo, useState } from 'react';
import { createTradingApi } from '../features/trades/api';
import type { CreateTradeRequest } from '../features/trades/types';

export function NewTradePage() {
  const api = useApiClient();
  const tradingApi = useMemo(() => createTradingApi(api), [api]);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<CreateTradeRequest['side']>('BUY');
  const [quantity, setQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const trimmedSymbol = symbol.trim().toUpperCase();
    const parsedQuantity = Number(quantity);

    if (!trimmedSymbol) {
      setFormError('Symbol is required');
      return;
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setFormError('Quantity must be a positive integer');
      return;
    }

    setSubmitting(true);

    try {
      const trade = await tradingApi.createTrade({
        symbol: trimmedSymbol,
        side,
        quantity: parsedQuantity,
      });
      showSuccess(`Trade ${trade.id} created successfully`);
      navigate('/trades');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create trade';
      setFormError(message);
      showError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PermissionGuard
      permission="trades:create"
      fallback={
        <Alert severity="warning">
          You do not have permission to create trades. Contact your administrator.
        </Alert>
      }
    >
      <PageTitle
        title="New Trade"
        subtitle="Submit a trade via BFF POST /api/trades"
      />

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}

      <ContentCard>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} maxWidth={480}>
            <TextField
              label="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g. AAPL"
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel id="side-label">Side</InputLabel>
              <Select
                labelId="side-label"
                label="Side"
                value={side}
                onChange={(e) => setSide(e.target.value as CreateTradeRequest['side'])}
              >
                <MenuItem value="BUY">BUY</MenuItem>
                <MenuItem value="SELL">SELL</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1, step: 1 }}
              required
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Trade'}
              </Button>
              <Button component={RouterLink} to="/trades" variant="outlined">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </ContentCard>
    </PermissionGuard>
  );
}
