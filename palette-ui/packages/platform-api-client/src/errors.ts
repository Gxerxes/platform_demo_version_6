export interface PaletteError {
  code: string;
  message: string;
  status?: number;
  details?: unknown;
}

export function normalizeError(error: unknown): PaletteError {
  if (isPaletteError(error)) {
    return error;
  }

  if (error instanceof ApiError) {
    return {
      code: error.code ?? 'API_ERROR',
      message: error.message,
      status: error.status,
      details: error.data,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    details: error,
  };
}

export function isPaletteError(error: unknown): error is PaletteError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as PaletteError).code === 'string' &&
    typeof (error as PaletteError).message === 'string'
  );
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
