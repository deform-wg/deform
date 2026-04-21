import { render } from 'lit';
import { describe, expect, it } from 'vitest';
import { DeForm } from '../../de-form.js';
import type { FormConfig, TextFieldConfig } from '../../typedefs/index.js';
import { setDynNumber } from '../../utils/dynamic-props.js';
import { _generateField, _generateFormControls, _generateOneOrManyForms } from '../form.js';

const sampleFields: FormConfig = {
  sections: [
    {
      name: 'profile',
      fields: [{ name: 'name', type: 'text', label: 'Name' }],
    },
    {
      name: 'settings',
      fields: [{ name: 'theme', type: 'text', label: 'Theme' }],
    },
  ],
};

describe('renderers/form', () => {
  it('renders nothing for hidden fields', () => {
    const form = new DeForm();
    const field: TextFieldConfig = { name: 'secret', type: 'text', hidden: true };

    const template = _generateField.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    expect(container.querySelector('*')).toBeNull();
  });

  it('renders a field wrapper with label', () => {
    const form = new DeForm();
    const field: TextFieldConfig = { name: 'name', type: 'text', label: 'Name' };

    const template = _generateField.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    const wrapper = container.querySelector('.form-control');
    expect(wrapper).not.toBeNull();
    expect(container.querySelector('sl-input')).not.toBeNull();
    const label = container.querySelector('sl-input span[slot="label"]');
    expect(label?.textContent).toContain('Name');
  });

  it('falls back to error field when renderer is missing', () => {
    const form = new DeForm();
    const field = { name: 'mystery', type: 'text' } as const;
    Object.defineProperty(form, '_render_text', { value: undefined });

    const template = _generateField.call(form, field);
    const container = document.createElement('div');
    render(template, container);

    expect(container.querySelector('.render-error')).not.toBeNull();
  });

  it('renders form controls based on change count and options', () => {
    const form = new DeForm();
    form.allowDiscardChanges = true;
    form.onSubmit = async () => {};
    form._celebrate = false;
    form._loading = false;

    setDynNumber(form, '_form_profile_count', 2);

    const template = _generateFormControls.call(form, { formId: 'profile' });
    const container = document.createElement('div');
    render(template, container);

    expect(container.querySelector('#profile__reset_button')).not.toBeNull();
    const saveButton = container.querySelector('#profile__save_button');
    expect(saveButton).not.toBeNull();
    expect(saveButton?.hasAttribute('disabled')).toBe(false);
  });

  it('renders multiple sections as tab group', () => {
    const form = new DeForm();
    form.showModifiedCount = true;
    form._loading = false;

    setDynNumber(form, '_form_profile_count', 1);
    setDynNumber(form, '_form_settings_count', 0);

    const template = _generateOneOrManyForms.call(form, sampleFields);
    const container = document.createElement('div');
    render(template, container);

    expect(container.querySelector('sl-tab-group')).not.toBeNull();
    expect(container.querySelectorAll('sl-tab').length).toBe(2);
    expect(container.querySelectorAll('sl-tab-panel').length).toBe(2);
    const activeTag = container.querySelector('sl-tag[data-active]');
    expect(activeTag?.textContent).toContain('1');
  });

  it('renders a single section as a form', () => {
    const form = new DeForm();
    const single: FormConfig = {
      sections: [
        {
          name: 'profile',
          fields: [{ name: 'name', type: 'text', label: 'Name' }],
        },
      ],
    };

    const template = _generateOneOrManyForms.call(form, single);
    const container = document.createElement('div');
    render(template, container);

    expect(container.querySelector('form#profile')).not.toBeNull();
  });
});
