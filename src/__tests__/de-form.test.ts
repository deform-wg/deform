import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';
import { _initializeValuesPreservingEdits } from '../core/props.js';
import { DeForm } from '../de-form.js';
import type { FormConfig } from '../typedefs/index.js';
import { getDynBoolean, getDynFormValue, getDynNumber } from '../utils/dynamic-props.js';

const sampleFields: FormConfig = {
  sections: [
    {
      name: 'profile',
      fields: [
        { name: 'name', type: 'text', value: 'Alice' },
        {
          name: 'color',
          type: 'select',
          options: [
            { value: 'red', label: 'Red' },
            { value: 'blue', label: 'Blue' },
          ],
        },
      ],
    },
  ],
};

describe('DeForm component', () => {
  it('initializes with default properties', () => {
    const form = new DeForm();

    expect(form.theme).toBe('dark');
    expect(form.accent).toBe('sky');
    expect(form.requireCommit).toBe(false);
    expect(form.markModifiedFields).toBe(false);
    expect(form.allowDiscardChanges).toBe(false);
    expect(form._dirty).toBe(0);
  });

  it('creates reactive properties for field definitions', () => {
    const form = new DeForm();

    form.fields = sampleFields;
    form._checkForChanges();

    expect(getDynFormValue(form, '_name')).toBe('Alice');
    expect(getDynFormValue(form, '__name')).toBe('Alice');
    expect(getDynBoolean(form, '__name_is_dirty')).toBe(false);
  });

  it('applies top-level form configuration properties when fields are assigned', () => {
    const form = new DeForm();

    form.fields = {
      ...sampleFields,
      theme: 'light',
      accent: 'rose',
      orientation: 'landscape',
      requireCommit: true,
      markModifiedFields: true,
      showModifiedCount: true,
      allowDiscardChanges: true,
    };

    expect(form.theme).toBe('light');
    expect(form.accent).toBe('rose');
    expect(form.orientation).toBe('landscape');
    expect(form.requireCommit).toBe(true);
    expect(form.markModifiedFields).toBe(true);
    expect(form.showModifiedCount).toBe(true);
    expect(form.allowDiscardChanges).toBe(true);
  });

  it('preserves dirty edits when new values arrive', () => {
    const form = new DeForm();
    form.fields = sampleFields;
    _initializeValuesPreservingEdits.call(form, { name: 'Alice', color: 'red' });

    form.setValue('name', 'Bob');
    expect(getDynBoolean(form, '__name_is_dirty')).toBe(true);

    _initializeValuesPreservingEdits.call(form, { name: 'Charlie', color: 'blue' });

    expect(getDynFormValue(form, '_name')).toBe('Bob');
    expect(getDynFormValue(form, '__name')).toBe('Alice');
  });

  it('returns form values and state', () => {
    const form = new DeForm();
    form.fields = sampleFields;
    _initializeValuesPreservingEdits.call(form, { name: 'Alice', color: 'blue' });

    const values = form.getFormValues();
    expect(values).toEqual({ name: 'Alice', color: 'blue' });

    const state = form.getState();
    expect(state.color).toEqual({ value: 'blue', label: 'Blue' });
  });

  it('tracks dirty count when fields are modified', () => {
    const form = new DeForm();
    form.fields = sampleFields;
    _initializeValuesPreservingEdits.call(form, { name: 'Alice', color: 'red' });

    form.setValue('color', 'blue');

    expect(form._dirty).toBe(1);
    expect(getDynNumber(form, '_form_profile_count')).toBe(1);
  });

  it('renders a loader when fields are missing', () => {
    const form = new DeForm();
    const container = document.createElement('div');

    render(form.render(), container);

    expect(container.querySelector('.loader-overlay')).not.toBeNull();
  });

  it('renders form wrapper when fields are present', () => {
    const form = new DeForm();
    form.fields = sampleFields;
    const container = document.createElement('div');

    render(form.render(), container);

    expect(container.querySelector('.dynamic-form-wrapper')).not.toBeNull();
  });

  it('updates theme classes when theme changes', async () => {
    const form = new DeForm();
    document.body.appendChild(form);
    await form.updateComplete;

    form.theme = 'light';
    await form.updated(new Map([['theme', 'dark']]));

    expect(form.classList.contains('sl-theme-light')).toBe(true);
  });

  it('toggleLoader toggles _initializing state', () => {
    const form = new DeForm();
    expect(form._initializing).toBe(false);

    form.toggleLoader();
    expect(form._initializing).toBe(true);

    form.toggleLoader();
    expect(form._initializing).toBe(false);
  });

  it('toggleCelebrate sets and clears _celebrate flag', async () => {
    vi.useFakeTimers();
    const form = new DeForm();
    expect(form._celebrate).toBe(false);

    form.toggleCelebrate();
    expect(form._celebrate).toBe(true);

    vi.advanceTimersByTime(1500);
    expect(form._celebrate).toBe(false);

    vi.useRealTimers();
  });

  it('toggleLabelLoader toggles label loading state for a field', () => {
    const form = new DeForm();
    form.fields = sampleFields;
    const { labelKey } = form.propKeys('name');

    expect(getDynBoolean(form, labelKey)).toBe(false);

    form.toggleLabelLoader('name');
    expect(getDynBoolean(form, labelKey)).toBe(true);

    form.toggleLabelLoader('name');
    expect(getDynBoolean(form, labelKey)).toBe(false);
  });

  it('getAccents returns available accents and current selection', () => {
    const form = new DeForm();
    form.accent = 'sky';

    const { accents, current } = form.getAccents();

    expect(Array.isArray(accents)).toBe(true);
    expect(accents.length).toBeGreaterThan(0);
    expect(current?.name).toBe('sky');
  });

  it('initializes field values when values property is set', async () => {
    const form = new DeForm();
    form.fields = {
      sections: [
        {
          name: 'profile',
          fields: [
            { name: 'first', type: 'text' },
            { name: 'last', type: 'text' },
          ],
        },
      ],
    };

    // Setting values should initialize both current and original values
    form.values = { first: 'John', last: 'Doe' };

    // Trigger the update lifecycle
    await form.updated(new Map([['values', {}]]));

    // Both current and original should be set
    expect(getDynFormValue(form, '_first')).toBe('John');
    expect(getDynFormValue(form, '__first')).toBe('John');
    expect(getDynFormValue(form, '_last')).toBe('Doe');
    expect(getDynFormValue(form, '__last')).toBe('Doe');

    // Fields should not be dirty since values match
    expect(getDynBoolean(form, '__first_is_dirty')).toBe(false);
    expect(getDynBoolean(form, '__last_is_dirty')).toBe(false);
  });
});
