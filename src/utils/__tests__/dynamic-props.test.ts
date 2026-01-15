import { describe, expect, it } from 'vitest';
import { getDynBoolean, getDynFormValue, getDynNumber, setDynFormValue } from '../dynamic-props.js';

describe('dynamic-props', () => {
  it('returns form values for primitives and arrays', () => {
    const host = {};

    setDynFormValue(host, 'str', 'hello');
    setDynFormValue(host, 'num', 3);
    setDynFormValue(host, 'bool', true);
    setDynFormValue(host, 'arrStr', ['a', 'b']);
    setDynFormValue(host, 'arrNum', [1, 2]);
    setDynFormValue(host, 'arrMix', ['a', 2]);

    expect(getDynFormValue(host, 'str')).toBe('hello');
    expect(getDynFormValue(host, 'num')).toBe(3);
    expect(getDynFormValue(host, 'bool')).toBe(true);
    expect(getDynFormValue(host, 'arrStr')).toEqual(['a', 'b']);
    expect(getDynFormValue(host, 'arrNum')).toEqual([1, 2]);
    expect(getDynFormValue(host, 'arrMix')).toEqual(['a', 2]);
  });

  it('returns undefined for unsupported value types', () => {
    const host = { obj: { nested: true } };
    expect(getDynFormValue(host, 'obj')).toBeUndefined();
  });

  it('returns default booleans and numbers', () => {
    const host = {};
    expect(getDynBoolean(host, 'missing')).toBe(false);
    expect(getDynNumber(host, 'missing')).toBe(0);
  });
});
