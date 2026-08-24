export interface AuthProvider {
  getAccessToken?: () => string | undefined | Promise<string | undefined>;
  onUnauthorized?: () => void | Promise<void>;
}

export interface AuthConfig extends AuthProvider {
  enabled?: boolean;
}
