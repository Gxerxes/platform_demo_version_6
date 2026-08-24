import type { ErrorCodeValue } from './ErrorCode';

export interface PaletteError {
  code: string;
  message: string;
  status?: number;
  details?: unknown;
  requestId?: string;
}

export interface ApiErrorOptions {
  message: string;
  code: ErrorCodeValue | string;
  status?: number;
  requestId?: string;
  details?: unknown;
  originalError?: unknown;
}
