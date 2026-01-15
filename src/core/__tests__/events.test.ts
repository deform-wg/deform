import { describe, expect, it, vi } from 'vitest';
import { DeForm } from '../../de-form.js';
import {
  _dispatchPublicEvent,
  emitChangeEvent,
  emitDiscardEvent,
  emitTabChangeEvent,
} from '../events.js';

describe('emitChangeEvent', () => {
  it('throws when fieldName is missing', () => {
    const form = new DeForm();

    expect(() => {
      // @ts-expect-error missing fieldName
      emitChangeEvent({ newValue: 'x', originalValue: 'x', priorValue: 'x', deForm: form });
    }).toThrow('fieldName is required for change event');
  });

  it('throws when newValue is missing', () => {
    const form = new DeForm();

    expect(() => {
      // @ts-expect-error missing newValue
      emitChangeEvent({ fieldName: 'name', originalValue: 'x', priorValue: 'x', deForm: form });
    }).toThrow('newValue is required for change event');
  });

  it('dispatches a deform value-change event payload', () => {
    const form = new DeForm();
    const dispatchSpy = vi.spyOn(form, 'dispatchEvent');

    emitChangeEvent({
      fieldName: 'name',
      originalValue: 'old',
      priorValue: 'prior',
      newValue: 'new',
      timestamp: 123,
      deForm: form,
    });

    const event = dispatchSpy.mock.calls[0]?.[0];
    expect(event?.type).toBe('deform-value-change');
    if (event && 'detail' in event) {
      expect(event.detail).toEqual({
        fieldName: 'name',
        originalValue: 'old',
        priorValue: 'prior',
        newValue: 'new',
        timestamp: 123,
      });
    } else {
      throw new Error('Expected CustomEvent with detail');
    }
  });
});

describe('emitTabChangeEvent', () => {
  it('throws when newTabName is missing', () => {
    const form = new DeForm();

    expect(() => {
      // @ts-expect-error missing newTabName
      emitTabChangeEvent({ deForm: form });
    }).toThrow('newTabName is required for tab change event');
  });
});

describe('emitDiscardEvent', () => {
  it('dispatches a deform discard-changes event', () => {
    const form = new DeForm();
    const dispatchSpy = vi.spyOn(form, 'dispatchEvent');

    emitDiscardEvent({
      timestamp: 456,
      deForm: form,
    });

    const event = dispatchSpy.mock.calls[0]?.[0];
    expect(event?.type).toBe('deform-discard-changes');
    if (event && 'detail' in event) {
      expect(event.detail).toEqual({ timestamp: 456 });
    } else {
      throw new Error('Expected CustomEvent with detail');
    }
  });
});

describe('_dispatchPublicEvent', () => {
  it('throws when name is missing', () => {
    const form = new DeForm();

    expect(() => {
      _dispatchPublicEvent('', { ok: true }, form);
    }).toThrow('Event name is required');
  });

  it('throws when detail is missing', () => {
    const form = new DeForm();

    expect(() => {
      // @ts-expect-error null detail should throw
      _dispatchPublicEvent('value-change', null, form);
    }).toThrow('Event detail is required');
  });
});
