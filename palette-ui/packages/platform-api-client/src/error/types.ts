export interface ApiErrorOptions {
  message: string;
  code: string;
  status?: number;
  requestId?: string;
  details?: unknown;
  originalError?: unknown;
}

export interface NormalizedError {
  code: string;
  message: string;
  status?: number;
  requestId?: string;
  details?: unknown;
}
