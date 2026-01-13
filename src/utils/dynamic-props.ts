import type { FormDataModel, FormValue } from '../typedefs/index.js';

/**
 * DeForm uses computed property keys (Lit reactive properties).
 * This module provides typed access to those dynamic keys without using `any`.
 */

export type DynamicValue = FormValue | boolean | number | FormDataModel;

type DynamicStore = Record<string, DynamicValue | undefined>;

function store(host: object): DynamicStore {
  return host as unknown as DynamicStore;
}

export function getDyn(host: object, key: string): DynamicValue | undefined {
  return store(host)[key];
}

export function setDyn(host: object, key: string, value: DynamicValue): void {
  store(host)[key] = value;
}

export function getDynBoolean(host: object, key: string): boolean {
  return store(host)[key] === true;
}

export function setDynBoolean(host: object, key: string, value: boolean): void {
  store(host)[key] = value;
}

export function getDynNumber(host: object, key: string): number {
  const v = store(host)[key];
  return typeof v === 'number' ? v : 0;
}

export function setDynNumber(host: object, key: string, value: number): void {
  store(host)[key] = value;
}

export function getDynFormValue(host: object, key: string): FormValue | undefined {
  const v = store(host)[key];
  if (v === null || v === undefined) return v;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v;
  if (Array.isArray(v) && v.every((x) => typeof x === 'string')) return v;
  if (Array.isArray(v) && v.every((x) => typeof x === 'number')) return v;
  if (Array.isArray(v) && v.every((x) => typeof x === 'string' || typeof x === 'number')) return v;
  return undefined;
}

export function setDynFormValue(host: object, key: string, value: FormValue): void {
  store(host)[key] = value;
}

