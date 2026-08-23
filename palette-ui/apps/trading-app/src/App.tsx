import { PaletteApp } from '@palette/platform-sdk';
import { Navigate, Route, Routes } from 'react-router-dom';
import { navigation } from './navigation';
import { paletteConfig, platformConfig } from './palette.config';
import { AdminPage } from './pages/AdminPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewTradePage } from './pages/NewTradePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettlementsPage } from './pages/SettlementsPage';
import { TradesPage } from './pages/TradesPage';

export function App() {
  return (
    <PaletteApp config={paletteConfig} platformConfig={platformConfig} navigation={navigation}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/trades" element={<TradesPage />} />
        <Route path="/trades/new" element={<NewTradePage />} />
        <Route path="/settlements" element={<SettlementsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PaletteApp>
  );
}
