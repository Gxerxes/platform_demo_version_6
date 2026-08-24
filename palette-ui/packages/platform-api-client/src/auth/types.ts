export interface AuthConfig {
  enabled?: boolean;
  getAccessToken?: () => string | undefined | Promise<string | undefined>;
  onUnauthorized?: () => void | Promise<void>;
}
