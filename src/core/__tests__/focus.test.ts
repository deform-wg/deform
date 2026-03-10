import { describe, expect, it, vi } from 'vitest';
import { DeForm } from '../../de-form.js';
import { focus } from '../focus.js';

describe('focus', () => {
  it('focuses a field by name', () => {
    const form = new DeForm();
    const shadowRoot = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('name', 'email');
    input.focus = vi.fn();
    shadowRoot.appendChild(input);
    Object.defineProperty(form, 'shadowRoot', { value: shadowRoot });

    focus.call(form, 'email');

    expect(input.focus).toHaveBeenCalled();
  });

  it('does nothing when fieldName is empty', () => {
    const form = new DeForm();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    focus.call(form, '');

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('warns when field is not found', () => {
    const form = new DeForm();
    const shadowRoot = document.createElement('div');
    Object.defineProperty(form, 'shadowRoot', { value: shadowRoot });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    focus.call(form, 'missing');

    expect(warnSpy).toHaveBeenCalledWith('field focus issue: missing not found');
    warnSpy.mockRestore();
  });

  it('warns when focus method does not exist', () => {
    const form = new DeForm();
    const shadowRoot = document.createElement('div');
    const element = document.createElement('div');
    element.setAttribute('name', 'custom');
    // Remove the focus method
    Object.defineProperty(element, 'focus', { value: undefined });
    shadowRoot.appendChild(element);
    Object.defineProperty(form, 'shadowRoot', { value: shadowRoot });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    focus.call(form, 'custom');

    expect(warnSpy).toHaveBeenCalledWith(
      'field focus issue: focus method does not exist for custom',
    );
    warnSpy.mockRestore();
  });
});
