import { describe, expect, it } from 'vitest';
import { bindToClass } from '../class-bind.js';

describe('bindToClass', () => {
  it('binds functions to the provided instance', () => {
    const instance = { value: 1 };
    const methods = {
      getValue() {
        return this.value;
      },
      setValue(next: number) {
        this.value = next;
      },
    };

    bindToClass(methods, instance);

    instance.setValue(2);
    expect(instance.getValue()).toBe(2);
  });

  it('ignores non-function entries', () => {
    const instance = { value: 1 };
    const methods = {
      notAFunction: 'nope',
    };

    bindToClass(methods, instance);

    expect(instance.notAFunction).toBeUndefined();
    expect(instance.value).toBe(1);
  });
});
