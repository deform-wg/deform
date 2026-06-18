import { describe, expect, it } from 'vitest';
import { deform } from '../../deform.js';
import type { FormConfig } from '../../typedefs/index.js';
import { getDynFormValue, getDynNumber } from '../../utils/dynamic-props.js';
import { propKeys } from '../props.js';

describe('propKeys', () => {
  it('generates expected keys for a field name', () => {
    const keys = propKeys('Email');

    expect(keys).toEqual({
      currentKey: '_email',
      originalKey: '__email',
      isDirtyKey: '__email_is_dirty',
      repeatKey: '_email_repeat',
      variantIndexKey: '_email_variant',
      revealKey: '_email_reveal_condition_met',
      labelKey: '_email_label',
    });
  });
});

describe('_initializeFormFieldProperties', () => {
  it('initializes multi-select fields with empty arrays', () => {
    const form = new deform();
    const config: FormConfig = {
      sections: [
        {
          name: 'prefs',
          fields: [
            {
              name: 'colors',
              type: 'select',
              multiple: true,
              options: [],
            },
          ],
        },
      ],
    };

    form.fields = config;

    expect(getDynFormValue(form, '_colors')).toEqual([]);
    expect(getDynFormValue(form, '__colors')).toEqual([]);
  });

  it('initializes toggle-field variant index from default', () => {
    const form = new deform();
    const config: FormConfig = {
      sections: [
        {
          name: 'contact',
          fields: [
            {
              name: 'contact',
              type: 'toggleField',
              defaultTo: 1,
              labels: ['Email', 'Phone'],
              fields: [
                { name: 'email', type: 'text' },
                { name: 'phone', type: 'text' },
              ],
            },
          ],
        },
      ],
    };

    form.fields = config;

    expect(getDynNumber(form, '_contact_variant')).toBe(1);
  });

  it('stores provided default values for multiple field types', () => {
    const form = new deform();
    const config: FormConfig = {
      sections: [
        {
          name: 'defaults',
          fields: [
            { name: 'title', type: 'text', value: 'hello' },
            { name: 'volume', type: 'range', min: 0, max: 10, value: 5 },
            { name: 'enabled', type: 'toggle', value: true },
            {
              name: 'network',
              type: 'select',
              value: 'mainnet',
              options: [
                { value: 'mainnet', label: 'Mainnet' },
                { value: 'testnet', label: 'Testnet' },
              ],
            },
          ],
        },
      ],
    };

    form.fields = config;

    expect(getDynFormValue(form, '_title')).toBe('hello');
    expect(getDynFormValue(form, '_volume')).toBe(5);
    expect(getDynFormValue(form, '_enabled')).toBe(true);
    expect(getDynFormValue(form, '_network')).toBe('mainnet');
  });
});
