/**
 * Debounces a function, delaying its execution until after the wait period has 
 * elapsed since the last time it was invoked.
 * 
 * @param func - The function to debounce.
 * @param wait - The time period in milliseconds to wait before executing the function.
 * @returns A debounced function that delays execution until calls stop.
 */
export default function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


/**
 * Executes immediately on the first call, then debounces subsequent calls within 
 * the wait period.
 * 
 * @param func - The function to debounce.
 * @param wait - The time period in milliseconds to wait before allowing another execution.
 * @returns A debounced function that executes immediately on first call, then waits.
 */
export function onceThenDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function executedFunction(this: any, ...args: Parameters<T>): void {
    const later = () => {
      timeout = undefined;
    };
    const shouldCallNow = !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (shouldCallNow) func.apply(this, args);
  };
}