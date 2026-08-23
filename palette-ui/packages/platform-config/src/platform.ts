export interface PaletteApiConfig {
  baseUrl: string;
  timeout?: number;
}

export interface PalettePlatformConfig {
  api: PaletteApiConfig;
}
