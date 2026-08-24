import type { ApiErrorOptions } from './types';

export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly requestId?: string;
  readonly details?: unknown;
  readonly originalError?: unknown;

  /** @deprecated Use `details` instead */
  get data(): unknown {
    return this.details;
  }

  constructor(options: ApiErrorOptions);
  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: unknown,
    requestId?: string,
  );
  constructor(
    messageOrOptions: string | ApiErrorOptions,
    status = 0,
    code = 'UNKNOWN_ERROR',
    details?: unknown,
    requestId?: string,
  ) {
    if (typeof messageOrOptions === 'object') {
      super(messageOrOptions.message);
      this.code = messageOrOptions.code;
      this.status = messageOrOptions.status;
      this.requestId = messageOrOptions.requestId;
      this.details = messageOrOptions.details;
      this.originalError = messageOrOptions.originalError;
    } else {
      super(messageOrOptions);
      this.code = code;
      this.status = status;
      this.details = details;
      this.requestId = requestId;
    }

    this.name = 'ApiError';
  }
}
