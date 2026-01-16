import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';
import { DeForm } from '../../de-form.js';
import { setDynBoolean } from '../../utils/dynamic-props.js';
import { generateActionLabel } from '../action.js';

describe('renders/action', () => {
  it('renders action button with correct label and attributes', () => {
    const form = new DeForm();
    const template = generateActionLabel(form, 'email', 'verify', 'Verify Email');
    const container = document.createElement('div');
    render(template, container);

    const button = container.querySelector('sl-button');
    expect(button).not.toBeNull();
    expect(button?.textContent?.trim()).toBe('Verify Email');
    expect(button?.getAttribute('variant')).toBe('text');
    expect(button?.getAttribute('size')).toBe('small');
    expect(button?.getAttribute('data-action-name')).toBe('verify');
  });

  it('shows loading state when label key is true', () => {
    const form = new DeForm();
    const { labelKey } = form.propKeys('email');
    setDynBoolean(form, labelKey, true);

    const template = generateActionLabel(form, 'email', 'verify', 'Verify Email');
    const container = document.createElement('div');
    render(template, container);

    const button = container.querySelector('sl-button');
    expect(button?.hasAttribute('loading')).toBe(true);
  });

  it('does not show loading state when label key is false', () => {
    const form = new DeForm();
    const { labelKey } = form.propKeys('email');
    setDynBoolean(form, labelKey, false);

    const template = generateActionLabel(form, 'email', 'verify', 'Verify Email');
    const container = document.createElement('div');
    render(template, container);

    const button = container.querySelector('sl-button');
    expect(button?.hasAttribute('loading')).toBe(false);
  });

  it('dispatches action-label-triggered event on click', async () => {
    const form = new DeForm();
    const eventHandler = vi.fn();
    form.addEventListener('action-label-triggered', eventHandler);

    const template = generateActionLabel(form, 'email', 'verify', 'Verify Email');
    const container = document.createElement('div');
    render(template, container);

    const button = container.querySelector('sl-button');
    // Use dispatchEvent instead of .click() as Shoelace buttons need full shadow DOM
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(eventHandler).toHaveBeenCalledTimes(1);
    const event = eventHandler.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({ fieldName: 'email', actionName: 'verify' });
  });

  it('prevents default behavior on click', () => {
    const form = new DeForm();
    const template = generateActionLabel(form, 'email', 'verify', 'Verify');
    const container = document.createElement('div');
    render(template, container);

    const button = container.querySelector('sl-button');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

    button?.dispatchEvent(clickEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('event bubbles and is composed', async () => {
    const form = new DeForm();
    const events: CustomEvent[] = [];
    form.addEventListener('action-label-triggered', (e) => {
      events.push(e as CustomEvent);
    });

    const template = generateActionLabel(form, 'test', 'action', 'Test');
    const container = document.createElement('div');
    render(template, container);

    const button = container.querySelector('sl-button');
    // Use dispatchEvent instead of .click() as Shoelace buttons need full shadow DOM
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(events).toHaveLength(1);
    const capturedEvent = events[0];
    expect(capturedEvent.bubbles).toBe(true);
    expect(capturedEvent.composed).toBe(true);
  });
});
