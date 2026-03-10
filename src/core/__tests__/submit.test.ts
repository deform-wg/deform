import { describe, expect, it, vi } from 'vitest';
import { DeForm } from '../../de-form.js';
import { getDynFormValue, setDynFormValue } from '../../utils/dynamic-props.js';
import { checkValidity, commitChanges, getChanges, retainChanges } from '../submit.js';

describe('submit helpers', () => {
  it('checkValidity throws when form is missing', () => {
    const deForm = new DeForm();
    expect(() => checkValidity.call(deForm, null as unknown as HTMLFormElement)).toThrow(
      'dynamic-form checkValidity called without providing form Node',
    );
  });

  it('getChanges throws when form is missing', () => {
    const deForm = new DeForm();
    expect(() => getChanges.call(deForm, null as unknown as HTMLFormElement)).toThrow(
      'dynamic-form getChanges called without providing form Node',
    );
  });

  it('commitChanges throws when form is missing', () => {
    const deForm = new DeForm();
    expect(() => commitChanges.call(deForm, null as unknown as HTMLFormElement)).toThrow(
      'dynamic-form commitChanges called without providing form Node',
    );
  });

  it('commitChanges syncs original values and emits success', () => {
    const form = new DeForm();
    const formEl = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'title';
    input.setAttribute('data-dirty-field', 'true');
    formEl.appendChild(input);

    const { currentKey, originalKey } = form.propKeys('title');
    setDynFormValue(form, currentKey, 'new');
    setDynFormValue(form, originalKey, 'old');

    const dispatchSpy = vi.spyOn(form, 'dispatchEvent');

    commitChanges.call(form, formEl);

    expect(getDynFormValue(form, originalKey)).toBe('new');
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
  });

  it('handleSubmit calls onSubmit and commits when allowed', async () => {
    const form = new DeForm();
    const formEl = document.createElement('form');
    const event = new Event('submit');
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    Object.defineProperty(event, 'currentTarget', { value: formEl });

    form.requireCommit = false;
    form.checkValidity = vi.fn(() => true);
    form.getChanges = vi.fn(() => ({ title: 'new' }));
    form.onSubmit = vi.fn(async () => ({}));
    form.commitChanges = vi.fn();

    await form._handleSubmit(event);

    expect(form.onSubmit).toHaveBeenCalled();
    expect(form.commitChanges).toHaveBeenCalledWith(formEl);
    expect(form._loading).toBe(false);
  });

  it('handleSubmit does not call onSubmit when validation fails', async () => {
    const form = new DeForm();
    const formEl = document.createElement('form');
    const event = new Event('submit');
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    Object.defineProperty(event, 'currentTarget', { value: formEl });

    form.checkValidity = vi.fn(() => false);
    form.onSubmit = vi.fn(async () => ({}));
    form.commitChanges = vi.fn();

    await form._handleSubmit(event);

    expect(form.onSubmit).not.toHaveBeenCalled();
    expect(form.commitChanges).not.toHaveBeenCalled();
  });

  it('retainChanges clears loading state without committing', () => {
    const form = new DeForm();
    form._loading = true;

    retainChanges.call(form);

    expect(form._loading).toBe(false);
  });
});
