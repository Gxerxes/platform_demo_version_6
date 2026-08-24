export interface ApiLogger {
  debug?(message: string, metadata?: unknown): void;
  info?(message: string, metadata?: unknown): void;
  warn?(message: string, metadata?: unknown): void;
  error?(message: string, metadata?: unknown): void;
}

export interface RequestMetricEvent {
  method: string;
  url: string;
  status?: number;
  durationMs: number;
  requestId?: string;
  success: boolean;
}

export interface RequestMetrics {
  record?(event: RequestMetricEvent): void;
}

export interface ObservabilityConfig {
  logger?: ApiLogger;
  metrics?: RequestMetrics;
}

const SENSITIVE_HEADER_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'proxy-authorization',
]);

const SENSITIVE_BODY_KEYS = new Set(['password', 'token', 'refreshToken', 'accessToken', 'secret']);

export function sanitizeMetadata(metadata: unknown): unknown {
  if (metadata === null || metadata === undefined) {
    return metadata;
  }

  if (Array.isArray(metadata)) {
    return metadata.map((item) => sanitizeMetadata(item));
  }

  if (typeof metadata !== 'object') {
    return metadata;
  }

  const input = metadata as Record<string, unknown>;
  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    const lowerKey = key.toLowerCase();

    if (SENSITIVE_HEADER_KEYS.has(lowerKey) || SENSITIVE_BODY_KEYS.has(lowerKey)) {
      output[key] = '[REDACTED]';
      continue;
    }

    if (lowerKey === 'headers' && typeof value === 'object' && value !== null) {
      output[key] = sanitizeMetadata(value);
      continue;
    }

    output[key] = sanitizeMetadata(value);
  }

  return output;
}

export function createSafeLogger(logger?: ApiLogger): ApiLogger | undefined {
  if (!logger) {
    return undefined;
  }

  const wrap =
    (level: keyof ApiLogger) =>
    (message: string, metadata?: unknown): void => {
      logger[level]?.(message, sanitizeMetadata(metadata));
    };

  return {
    debug: logger.debug ? wrap('debug') : undefined,
    info: logger.info ? wrap('info') : undefined,
    warn: logger.warn ? wrap('warn') : undefined,
    error: logger.error ? wrap('error') : undefined,
  };
}
