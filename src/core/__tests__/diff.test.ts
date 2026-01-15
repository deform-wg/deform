import { describe, expect, it } from 'vitest';
import { DeForm } from '../../de-form.js';
import type { ValidationRule } from '../../typedefs/index.js';
import { getDynBoolean, setDynFormValue } from '../../utils/dynamic-props.js';
import { _checkAndSetConditionMetFlags, _checkAndSetFieldDirtyStatus } from '../diff.js';

describe('_checkAndSetFieldDirtyStatus', () => {
  it('marks field as dirty when current value differs', () => {
    const form = new DeForm();
    const { currentKey, originalKey, isDirtyKey } = form.propKeys('name');

    setDynFormValue(form, currentKey, 'new');
    setDynFormValue(form, originalKey, 'old');

    const isDirty = _checkAndSetFieldDirtyStatus.call(form, 'name');

    expect(isDirty).toBe(true);
    expect(getDynBoolean(form, isDirtyKey)).toBe(true);
  });

  it('treats undefined and empty string as equal', () => {
    const form = new DeForm();
    const { currentKey, originalKey, isDirtyKey } = form.propKeys('nickname');

    setDynFormValue(form, currentKey, undefined);
    setDynFormValue(form, originalKey, undefined);

    const isDirty = _checkAndSetFieldDirtyStatus.call(form, 'nickname');

    expect(isDirty).toBe(false);
    expect(getDynBoolean(form, isDirtyKey)).toBe(false);
  });

  it('detects changes for non-string values', () => {
    const form = new DeForm();
    const { currentKey, originalKey, isDirtyKey } = form.propKeys('count');

    setDynFormValue(form, currentKey, 2);
    setDynFormValue(form, originalKey, 1);

    const isDirty = _checkAndSetFieldDirtyStatus.call(form, 'count');

    expect(isDirty).toBe(true);
    expect(getDynBoolean(form, isDirtyKey)).toBe(true);
  });
});

describe('_checkAndSetConditionMetFlags', () => {
  it('evaluates "=" rules and sets reveal flag', () => {
    const form = new DeForm();
    const targetKey = form.propKeys('target').currentKey;
    setDynFormValue(form, targetKey, 'yes');

    const rule: ValidationRule = {
      self: 'revealField',
      target: 'target',
      operator: '=',
      value: 'yes',
    };

    _checkAndSetConditionMetFlags.call(form, rule, {}, {});

    expect(getDynBoolean(form, form.propKeys('revealField').revealKey)).toBe(true);
  });

  it('evaluates "!=" rules and sets reveal flag', () => {
    const form = new DeForm();
    const targetKey = form.propKeys('target').currentKey;
    setDynFormValue(form, targetKey, 'no');

    const rule: ValidationRule = {
      self: 'revealField',
      target: 'target',
      operator: '!=',
      value: 'yes',
    };

    _checkAndSetConditionMetFlags.call(form, rule, {}, {});

    expect(getDynBoolean(form, form.propKeys('revealField').revealKey)).toBe(true);
  });

  it('evaluates function rules and sets reveal flag', () => {
    const form = new DeForm();
    const rule: ValidationRule = {
      self: 'revealField',
      fn: () => true,
    };

    _checkAndSetConditionMetFlags.call(form, rule, {}, {});

    expect(getDynBoolean(form, form.propKeys('revealField').revealKey)).toBe(true);
  });

  it('returns false when rule has no target value', () => {
    const form = new DeForm();
    const rule: ValidationRule = {
      self: 'revealField',
      operator: '=',
      value: 'yes',
    };

    _checkAndSetConditionMetFlags.call(form, rule, {}, {});

    expect(getDynBoolean(form, form.propKeys('revealField').revealKey)).toBe(false);
  });
});
