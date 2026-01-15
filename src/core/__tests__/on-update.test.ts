import { describe, expect, it, vi } from 'vitest';
import { DeForm } from '../../de-form.js';
import { _getTargetForm, _onUpdate, _shouldUpdateForm, _updateActiveFormId } from '../on-update.js';

describe('on-update helpers', () => {
  it('shouldUpdateForm returns true for fields or active form updates', () => {
    const form = new DeForm();
    expect(_shouldUpdateForm.call(form, new Map([['fields', {}]]))).toBe(true);
    expect(_shouldUpdateForm.call(form, new Map([['_activeFormId', 'x']]))).toBe(true);
    expect(_shouldUpdateForm.call(form, new Map([['values', {}]]))).toBe(false);
  });

  it('getTargetForm selects initial form on data initialization', async () => {
    const form = new DeForm();
    const shadowRoot = document.createElement('div');
    shadowRoot.innerHTML = `
      <form id="profile"></form>
      <form id="settings"></form>
    `;
    Object.defineProperty(form, 'shadowRoot', { value: shadowRoot });

    const target = _getTargetForm.call(form, new Map([['fields', {}]]));
    expect(target?.id).toBe('profile');
  });

  it('getTargetForm selects active form when set', async () => {
    const form = new DeForm();
    form._activeFormId = 'settings';
    const shadowRoot = document.createElement('div');
    shadowRoot.innerHTML = `
      <form id="profile"></form>
      <form id="settings"></form>
    `;
    Object.defineProperty(form, 'shadowRoot', { value: shadowRoot });

    const target = _getTargetForm.call(form, new Map([['_activeFormId', 'settings']]));
    expect(target?.id).toBe('settings');
  });

  it('updateActiveFormId sets active form on init', () => {
    const form = new DeForm();
    const formEl = document.createElement('form');
    formEl.id = 'profile';

    _updateActiveFormId.call(form, formEl, new Map([['fields', {}]]));

    expect(form._activeFormId).toBe('profile');
  });

  it('onUpdate runs change checks and waits for custom elements', async () => {
    const form = new DeForm();
    const shadowRoot = document.createElement('div');
    shadowRoot.innerHTML = `<form id="profile"><sl-input></sl-input></form>`;
    Object.defineProperty(form, 'shadowRoot', { value: shadowRoot });

    const checkSpy = vi.spyOn(form, '_checkForChanges');
    const whenDefined = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('customElements', { whenDefined });

    await _onUpdate.call(form, new Map([['fields', {}]]));

    expect(checkSpy).toHaveBeenCalled();
    expect(whenDefined).toHaveBeenCalledWith('sl-input');
  });
});
