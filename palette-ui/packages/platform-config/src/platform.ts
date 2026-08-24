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
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
}

export interface PaletteQueryConfig {
  staleTime?: number;
  gcTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
}

export interface PaletteAppMetadata {
  applicationId?: string;
  clientVersion?: string;
}

export interface PalettePlatformConfig {
  api: PaletteApiConfig;
  auth?: PaletteAuthConfig;
  query?: PaletteQueryConfig;
  metadata?: PaletteAppMetadata;
}
