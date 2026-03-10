import { describe, expect, it, vi } from 'vitest';
import { asyncTimeout } from '../timeout.js';

describe('asyncTimeout', () => {
  it('resolves after delay and calls function', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const promise = asyncTimeout(50, fn);

    vi.advanceTimersByTime(50);
    await promise;

    expect(fn).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('resolves even if callback throws and logs error', async () => {
    vi.useFakeTimers();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const promise = asyncTimeout(10, () => {
      throw new Error('boom');
    });

    vi.advanceTimersByTime(10);
    await promise;

    expect(errorSpy).toHaveBeenCalledWith(
      'Function provided to asyncTimeout threw an error:',
      expect.any(Error),
    );
    errorSpy.mockRestore();
    vi.useRealTimers();
  });
});
