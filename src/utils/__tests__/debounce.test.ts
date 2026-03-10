import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import debounce, { onceThenDebounce } from '../debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays execution until wait elapses', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);

    debounced('first');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(49);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('first');
  });

  it('uses the latest call arguments', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);

    debounced('first');
    debounced('second');
    debounced('third');

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('third');
  });
});

describe('onceThenDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires immediately then debounces until wait elapses', () => {
    const fn = vi.fn();
    const debounced = onceThenDebounce(fn, 50);

    debounced('first');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('first');

    debounced('second');
    debounced('third');
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    debounced('fourth');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('fourth');
  });
});
