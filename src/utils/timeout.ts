/**
 * Creates a promise that resolves after a specified delay, optionally executing a function.
 * 
 * @param delay - The delay in milliseconds before the promise resolves
 * @param fn - Optional function to execute before resolving. If provided and is a function, it will be called.
 * @returns A Promise that resolves after the delay
 */
export function asyncTimeout(delay: number, fn?: (() => void) | null): Promise<void> {
  return new Promise<void>(resolve => setTimeout(() => {
    if (fn && typeof fn === 'function') {
      try {
        fn();
      } catch (err) {
        console.error('Function provided to asyncTimeout threw an error:', err);
      } finally {
        resolve();
      }
    } else {
      resolve();
    }
  }, delay));
}

