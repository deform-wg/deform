import { describe, expect, it, vi } from 'vitest';
import { DeForm } from '../../de-form.js';
import { getDynFormValue, setDynFormValue } from '../../utils/dynamic-props.js';

describe('handlers', () => {
  it('handleInput updates value and dispatches change event', () => {
    const form = new DeForm();
    const { currentKey, originalKey } = form.propKeys('name');
    setDynFormValue(form, originalKey, 'old');

    const input = document.createElement('input');
    input.name = 'name';
    input.value = 'new';

    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: input });

    const dispatchSpy = vi.spyOn(form, 'dispatchEvent');

    form._handleInput(event);

    expect(getDynFormValue(form, currentKey)).toBe('new');
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('handleToggle updates boolean value', () => {
    const form = new DeForm();
    const { currentKey, originalKey } = form.propKeys('enabled');
    setDynFormValue(form, originalKey, false);

    const checkbox = document.createElement('input');
    checkbox.name = 'enabled';
    checkbox.checked = true;

    const event = new Event('sl-change');
    Object.defineProperty(event, 'target', { value: checkbox });

    form._handleToggle(event);

    expect(getDynFormValue(form, currentKey)).toBe(true);
  });

  it('handleChoice updates selection value', () => {
    const form = new DeForm();
    const { currentKey, originalKey } = form.propKeys('color');
    setDynFormValue(form, originalKey, 'red');

    const target = { name: 'color', value: 'blue' };
    const event = new Event('sl-change');
    Object.defineProperty(event, 'target', { value: target });

    form._handleChoice(event);

    expect(getDynFormValue(form, currentKey)).toBe('blue');
  });

  it('handleRating uses dataset name and numeric value', () => {
    const form = new DeForm();
    const { currentKey, originalKey } = form.propKeys('rating');
    setDynFormValue(form, originalKey, 1);

    const target = { dataset: { name: 'rating' }, value: 4 };
    const event = new Event('sl-change');
    Object.defineProperty(event, 'target', { value: target });

    form._handleRating(event);

    expect(getDynFormValue(form, currentKey)).toBe(4);
  });

  it('handleTabChange updates active id', () => {
    const form = new DeForm();
    form._activeFormId = 'profile';

    form._handleTabChange(new Event('click'), 'settings');

    expect(form._activeFormId).toBe('settings');
  });

  it('handleDiscardChanges resets current values', async () => {
    const form = new DeForm();

    const { currentKey, originalKey } = form.propKeys('name');
    setDynFormValue(form, currentKey, 'new');
    setDynFormValue(form, originalKey, 'old');

    form._activeFormId = 'profile';
    const shadowRoot = document.createElement('div');
    shadowRoot.innerHTML = `
      <form id="profile">
        <input name="name" data-dirty-field />
      </form>
    `;
    Object.defineProperty(form, 'shadowRoot', { value: shadowRoot });

    const event = new Event('click');
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });

    form._handleDiscardChanges(event);

    expect(getDynFormValue(form, currentKey)).toBe('old');
  });
});
