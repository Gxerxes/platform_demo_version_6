import { PaletteApp } from '@palette/platform-sdk';
import { Navigate, Route, Routes } from 'react-router-dom';
import { navigation } from './navigation';
import { paletteConfig, platformConfig } from './palette.config';
import { AdminPage } from './pages/AdminPage';
import { DashboardPage } from './pages/DashboardPage';
import { SdkDemoPage } from './pages/SdkDemoPage';
import { SettingsPage } from './pages/SettingsPage';
import { TablePage } from './pages/TablePage';

export function App() {
  return (
    <PaletteApp config={paletteConfig} platformConfig={platformConfig} navigation={navigation}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/sdk" element={<SdkDemoPage />} />
        <Route path="/components/table" element={<TablePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PaletteApp>
  );
}
