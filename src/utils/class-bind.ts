import type { BindableFunction, FunctionMap } from '../types/index.js';

/**
 * Binds all functions from a map to a class instance
 * 
 * @param mapOfFunctions - Object containing functions to bind
 * @param that - Class instance to bind the functions to
 */
export const bindToClass = function (mapOfFunctions: FunctionMap, that: any): void {
  Object.keys(mapOfFunctions).forEach((key) => {
    if (typeof mapOfFunctions[key] === 'function') {
      that[key] = (mapOfFunctions[key] as BindableFunction).bind(that);
    }
  });
};
