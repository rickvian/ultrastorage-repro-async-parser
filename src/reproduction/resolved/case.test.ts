import { describe, expect, it } from 'vitest';
import { runResolvedParserCase } from './case';

describe('resolved parser reproduction', () => {
  it('shows that a Promise-returning parser is classified as unsupported', () => {
    const result = runResolvedParserCase();

    expect(result.actual).toBe('{"status":"unsupported"}');
    expect(result.reproduced).toBe(true);
  });
});