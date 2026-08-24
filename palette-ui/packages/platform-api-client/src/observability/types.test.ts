import { describe, expect, it } from 'vitest';
import { sanitizeMetadata } from './types';

describe('sanitizeMetadata', () => {
  it('redacts authorization headers', () => {
    const sanitized = sanitizeMetadata({
      headers: {
        Authorization: 'Bearer secret',
        'X-Request-ID': 'abc',
      },
      body: {
        password: '123456',
        username: 'demo',
      },
    }) as Record<string, unknown>;

    const headers = sanitized.headers as Record<string, string>;
    const body = sanitized.body as Record<string, string>;

    expect(headers.Authorization).toBe('[REDACTED]');
    expect(headers['X-Request-ID']).toBe('abc');
    expect(body.password).toBe('[REDACTED]');
    expect(body.username).toBe('demo');
  });
});
