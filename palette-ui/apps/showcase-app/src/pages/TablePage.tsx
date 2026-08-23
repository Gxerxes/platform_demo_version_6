import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ContentCard, PageTitle } from '@palette/platform-sdk';

const sampleData = [
  { id: 'TRD-001', symbol: 'AAPL', side: 'BUY', quantity: 1000, status: 'Settled' },
  { id: 'TRD-002', symbol: 'MSFT', side: 'SELL', quantity: 500, status: 'Pending' },
  { id: 'TRD-003', symbol: 'GOOGL', side: 'BUY', quantity: 200, status: 'Settled' },
];

export function TablePage() {
  return (
    <>
      <PageTitle title="Table" subtitle="Enterprise table component demonstration" />

      <ContentCard noPadding>
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
              {sampleData.map((row) => (
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
      </ContentCard>
    </>
  );
}
