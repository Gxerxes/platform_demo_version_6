import { describe, expect, it } from 'vitest';
import {
  calculateRetryDelay,
  shouldRetryRequest,
} from './RetryPolicy';

describe('RetryPolicy', () => {
  const retryConfig = {
    enabled: true,
    retries: 3,
    retryDelay: 500,
    retryOn: [502, 503, 504],
    retryMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'],
  };

  it('retries GET on 503', () => {
    expect(shouldRetryRequest('GET', 503, 0, retryConfig)).toBe(true);
  });

  it('does not retry POST by default', () => {
    expect(shouldRetryRequest('POST', 503, 0, retryConfig)).toBe(false);
  });

  it('does not retry 401', () => {
    expect(shouldRetryRequest('GET', 401, 0, retryConfig)).toBe(false);
  });

  it('stops after configured retry limit', () => {
    expect(shouldRetryRequest('GET', 503, 3, retryConfig)).toBe(false);
  });

  it('uses exponential backoff', () => {
    expect(calculateRetryDelay(500, 0)).toBe(500);
    expect(calculateRetryDelay(500, 1)).toBe(1000);
    expect(calculateRetryDelay(500, 2)).toBe(2000);
  });
});
