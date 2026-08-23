import { PaletteShell } from '@palette/platform-shell';
import { Navigate, Route, Routes } from 'react-router-dom';
import { navigation } from './navigation';
import { paletteConfig } from './palette.config';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { TablePage } from './pages/TablePage';

export function App() {
  return (
    <PaletteShell config={paletteConfig} navigation={navigation}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/components/table" element={<TablePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PaletteShell>
  );
}
