import { PaletteApp } from '@palette/platform-sdk';
import { Route, Routes } from 'react-router-dom';
import { navigation } from './navigation';
import { paletteConfig, platformConfig } from './palette.config';
import { TradesGridPage } from './pages/TradesGridPage';

export function App() {
  return (
    <PaletteApp config={paletteConfig} platformConfig={platformConfig} navigation={navigation}>
      <Routes>
        <Route path="/" element={<TradesGridPage />} />
      </Routes>
    </PaletteApp>
  );
}
