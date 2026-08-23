import { describe, it, expect } from 'vitest';
import { UI_COMMON_VERSION } from './index';

describe('ui-common', () => {
  it('should export version', () => {
    expect(UI_COMMON_VERSION).toBe('0.2.0');
  });
});
