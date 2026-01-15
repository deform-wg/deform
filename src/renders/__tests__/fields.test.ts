import { render } from 'lit';
import { describe, expect, it } from 'vitest';
import { DeForm } from '../../de-form.js';
import type {
  CheckboxFieldConfig,
  ColorFieldConfig,
  DateFieldConfig,
  RadioButtonFieldConfig,
  RadioFieldConfig,
  RangeFieldConfig,
  RatingFieldConfig,
  SeedphraseFieldConfig,
  SelectFieldConfig,
  TextareaFieldConfig,
  TextFieldConfig,
  ToggleConfig,
  ToggleFieldConfig,
} from '../../typedefs/index.js';
import { setDynFormValue, setDynNumber } from '../../utils/dynamic-props.js';
import { _render_checkbox } from '../fields/checkbox.js';
import { _render_color } from '../fields/color.js';
import { _render_date } from '../fields/date.js';
import { _render_radio } from '../fields/radio.js';
import { _render_radioButton } from '../fields/radio-button.js';
import { _render_range } from '../fields/range.js';
import { _render_rating } from '../fields/rating.js';
import { _render_seedphrase } from '../fields/seedphrase.js';
import { _render_select } from '../fields/select.js';
import { _render_email } from '../fields/text-email.js';
import { _render_number } from '../fields/text-number.js';
import { _render_password } from '../fields/text-password.js';
import { _render_text } from '../fields/text-string.js';
import { _render_textarea } from '../fields/textarea.js';
import { _render_toggle } from '../fields/toggle.js';
import { _render_toggleField } from '../fields/toggle-field.js';

describe('renderers/fields', () => {
  it('renders select options and respects multiple flag', () => {
    const form = new DeForm();
    const field: SelectFieldConfig = {
      name: 'color',
      type: 'select',
      multiple: true,
      options: [
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
      ],
    };

    setDynFormValue(form, form.propKeys('color').currentKey, ['red']);

    const template = _render_select.call(form, field, {});
    const container = document.createElement('div');
    render(template, container);

    const select = container.querySelector('sl-select');
    expect(select).not.toBeNull();
    expect(select?.hasAttribute('multiple')).toBe(true);
    expect(container.querySelectorAll('sl-option').length).toBe(2);
  });

  it('renders toggle as checked when value is true', () => {
    const form = new DeForm();
    const field: ToggleConfig = {
      name: 'enabled',
      type: 'toggle',
      label: 'Enabled',
    };

    setDynFormValue(form, form.propKeys('enabled').currentKey, true);

    const template = _render_toggle.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const toggle = container.querySelector('sl-switch');
    expect(toggle).not.toBeNull();
    expect(toggle?.hasAttribute('checked')).toBe(true);
    expect(toggle?.textContent).toContain('Enabled');
  });

  it('renders checkbox with indeterminate flag', () => {
    const form = new DeForm();
    const field: CheckboxFieldConfig = {
      name: 'accept',
      type: 'checkbox',
      label: 'Accept',
      indeterminate: true,
    };

    setDynFormValue(form, form.propKeys('accept').currentKey, true);

    const template = _render_checkbox.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const checkbox = container.querySelector('sl-checkbox');
    expect(checkbox).not.toBeNull();
    expect(checkbox?.hasAttribute('checked')).toBe(true);
    expect(checkbox?.hasAttribute('indeterminate')).toBe(true);
  });

  it('renders range with min, max, and step', () => {
    const form = new DeForm();
    const field: RangeFieldConfig = {
      name: 'volume',
      type: 'range',
      label: 'Volume',
      min: 0,
      max: 10,
      step: 2,
    };

    setDynFormValue(form, form.propKeys('volume').currentKey, 6);

    const template = _render_range.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const range = container.querySelector('sl-range');
    expect(range).not.toBeNull();
    expect(range?.getAttribute('min')).toBe('0');
    expect(range?.getAttribute('max')).toBe('10');
    expect(range?.getAttribute('step')).toBe('2');
  });

  it('renders radio options with checked and disabled states', () => {
    const form = new DeForm();
    const field: RadioFieldConfig = {
      name: 'size',
      type: 'radio',
      label: 'Size',
      options: [
        { value: 's', label: 'Small', checked: true },
        { value: 'm', label: 'Medium', disabled: true },
      ],
    };

    setDynFormValue(form, form.propKeys('size').currentKey, 's');

    const template = _render_radio.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const radios = container.querySelectorAll('sl-radio');
    expect(radios.length).toBe(2);
    expect(radios[0]?.hasAttribute('checked')).toBe(true);
    expect(radios[1]?.hasAttribute('disabled')).toBe(true);
  });

  it('renders radio-button options', () => {
    const form = new DeForm();
    const field: RadioButtonFieldConfig = {
      name: 'mode',
      type: 'radioButton',
      options: [
        { value: 'light', label: 'Light', checked: true },
        { value: 'dark', label: 'Dark' },
      ],
    };

    setDynFormValue(form, form.propKeys('mode').currentKey, 'light');

    const template = _render_radioButton.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const radios = container.querySelectorAll('sl-radio-button');
    expect(radios.length).toBe(2);
    expect(radios[0]?.hasAttribute('checked')).toBe(true);
  });

  it('renders textarea with rows and placeholder', () => {
    const form = new DeForm();
    const field: TextareaFieldConfig = {
      name: 'bio',
      type: 'textarea',
      rows: 4,
      placeholder: 'About you',
    };

    setDynFormValue(form, form.propKeys('bio').currentKey, 'hello');

    const template = _render_textarea.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const textarea = container.querySelector('sl-textarea');
    expect(textarea?.getAttribute('rows')).toBe('4');
    expect(textarea?.getAttribute('placeholder')).toBe('About you');
  });

  it('renders seedphrase with words and rows', () => {
    const form = new DeForm();
    const field: SeedphraseFieldConfig = {
      name: 'seed',
      type: 'seedphrase',
      rows: 3,
      words: 12,
    };

    setDynFormValue(form, form.propKeys('seed').currentKey, 'alpha beta');

    const template = _render_seedphrase.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const textarea = container.querySelector('sl-textarea');
    expect(textarea?.getAttribute('rows')).toBe('3');
  });

  it('renders date with min and max', () => {
    const form = new DeForm();
    const field: DateFieldConfig = {
      name: 'dob',
      type: 'date',
      min: '2020-01-01',
      max: '2030-01-01',
    };

    setDynFormValue(form, form.propKeys('dob').currentKey, '2024-01-01');

    const template = _render_date.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const input = container.querySelector('sl-input');
    expect(input?.getAttribute('type')).toBe('date');
    expect(input?.getAttribute('min')).toBe('2020-01-01');
    expect(input?.getAttribute('max')).toBe('2030-01-01');
  });

  it('renders color picker with options', () => {
    const form = new DeForm();
    const field: ColorFieldConfig = {
      name: 'color',
      type: 'color',
      inline: true,
      format: 'hex',
    };

    setDynFormValue(form, form.propKeys('color').currentKey, '#ff0000');

    const template = _render_color.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const picker = container.querySelector('sl-color-picker');
    expect(picker?.hasAttribute('inline')).toBe(true);
    expect(picker?.getAttribute('format')).toBe('hex');
  });

  it('renders rating with max and precision', () => {
    const form = new DeForm();
    const field: RatingFieldConfig = {
      name: 'rating',
      type: 'rating',
      max: 5,
      precision: 0.5,
    };

    setDynFormValue(form, form.propKeys('rating').currentKey, 4);

    const template = _render_rating.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const rating = container.querySelector('sl-rating');
    expect(rating?.getAttribute('max')).toBe('5');
    expect(rating?.getAttribute('precision')).toBe('0.5');
  });

  it('renders text input with placeholder and required', () => {
    const form = new DeForm();
    const field: TextFieldConfig = {
      name: 'title',
      type: 'text',
      placeholder: 'Title',
      required: true,
    };

    setDynFormValue(form, form.propKeys('title').currentKey, 'Hello');

    const template = _render_text.call(form, field, {});
    const container = document.createElement('div');
    render(template, container);

    const input = container.querySelector('sl-input');
    expect(input?.getAttribute('type')).toBe('text');
    expect(input?.getAttribute('placeholder')).toBe('Title');
    expect(input?.hasAttribute('required')).toBe(true);
  });

  it('renders email input with label', () => {
    const form = new DeForm();
    const field: TextFieldConfig = {
      name: 'email',
      type: 'email',
      label: 'Email',
    };

    setDynFormValue(form, form.propKeys('email').currentKey, 'a@b.com');

    const template = _render_email.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const input = container.querySelector('sl-input');
    expect(input?.getAttribute('type')).toBe('email');
    expect(input?.getAttribute('label')).toBe('Email');
  });

  it('renders number input with min, max, and step', () => {
    const form = new DeForm();
    const field: TextFieldConfig = {
      name: 'age',
      type: 'number',
      min: 1,
      max: 10,
      step: 2,
    };

    setDynFormValue(form, form.propKeys('age').currentKey, 4);

    const template = _render_number.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const input = container.querySelector('sl-input');
    expect(input?.getAttribute('type')).toBe('number');
    expect(input?.getAttribute('min')).toBe('1');
    expect(input?.getAttribute('max')).toBe('10');
    expect(input?.getAttribute('step')).toBe('2');
  });

  it('renders password confirmation when required', () => {
    const form = new DeForm();
    const field: TextFieldConfig = {
      name: 'password',
      type: 'password',
      requireConfirmation: true,
    };

    setDynFormValue(form, form.propKeys('password').currentKey, 'secret');

    const template = _render_password.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const inputs = container.querySelectorAll('sl-input');
    expect(inputs.length).toBe(2);
    expect(inputs[0]?.getAttribute('type')).toBe('password');
    expect(inputs[1]?.getAttribute('name')).toBe('password_repeat');
  });

  it('renders toggle-field with active variant only', () => {
    const form = new DeForm();
    const field: ToggleFieldConfig = {
      name: 'contact',
      type: 'toggleField',
      defaultTo: 0,
      labels: ['Email', 'Phone'],
      fields: [
        { name: 'email', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    };

    setDynNumber(form, form.propKeys('contact').variantIndexKey, 0);

    const template = _render_toggleField.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    expect(container.querySelector('sl-input')).not.toBeNull();
    expect(container.textContent).toContain('Email');
  });
});
