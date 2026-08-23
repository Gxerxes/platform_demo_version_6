import { PaletteApp } from '@palette/platform-sdk';
import { Navigate, Route, Routes } from 'react-router-dom';
import { navigation } from './navigation';
import { paletteConfig, platformConfig } from './palette.config';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <PaletteApp config={paletteConfig} platformConfig={platformConfig} navigation={navigation}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PaletteApp>
  );
}
