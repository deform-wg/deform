import type { BindableFunction, FunctionMap } from '../typedefs/index.js';

/**
 * Binds all functions from a map to a class instance
 * 
 * @param mapOfFunctions - Object containing functions to bind
 * @param that - Class instance to bind the functions to
 */
type BindTarget = object;

export const bindToClass = function <TTarget extends BindTarget>(
  mapOfFunctions: FunctionMap,
  that: TTarget
): void {
  Object.keys(mapOfFunctions).forEach((key) => {
    const fn = mapOfFunctions[key];
    if (typeof fn === 'function') {
      (that as Record<string, unknown>)[key] = (fn as BindableFunction).bind(that);
    }
  });
};
