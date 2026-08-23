export interface PaletteAuthConfig {
  /** Enable BFF authentication integration */
  enabled?: boolean;
  loginPath?: string;
  logoutPath?: string;
  userPath?: string;
  sessionPath?: string;
  statusPath?: string;
}

export interface PaletteApiConfig {
  baseUrl: string;
  timeout?: number;
}

export interface PalettePlatformConfig {
  api: PaletteApiConfig;
  auth?: PaletteAuthConfig;
}
