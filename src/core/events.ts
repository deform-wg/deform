import type { DeForm, ChangePayload } from '../typedefs/index.js';

type EventDetail = Record<string, string | number | boolean | null | undefined | object>;

interface TabChangeOptions {
  priorTabName?: string;
  newTabName: string;
  timestamp?: number;
  deForm: DeForm;
}

interface DiscardOptions {
  timestamp?: number;
  deForm: DeForm;
}

/**
 * Validates that a change event has all required properties.
 */
function validateChangeEvent(options: Partial<ChangePayload>): void {
  if (!options?.fieldName) {
    throw new Error('fieldName is required for change event');
  }
  if (options.newValue === undefined) {
    throw new Error('newValue is required for change event');
  }
}

/**
 * Validates that a tab change event has all required properties.
 */
function validateTabChangeEvent(options: Partial<TabChangeOptions>): void {
  if (!options?.newTabName) {
    throw new Error('newTabName is required for tab change event');
  }
}

/**
 * Dispatches an internal form event.
 */
export function _dispatchEvent(this: DeForm, name: string, detail: EventDetail): void {
  this.dispatchEvent(new CustomEvent(
    `form-${name}`, {
      detail,
      composed: true,
      bubbles: true,
    }));
}

/**
 * Dispatches a public deform event.
 */
export const _dispatchPublicEvent = (name: string, detail: EventDetail, deForm: DeForm): void => {
  if (!name) {
    throw new Error('Event name is required');
  }
  if (!detail) {
    throw new Error('Event detail is required');
  }

  deForm.dispatchEvent(new CustomEvent(
    `deform-${name}`, {
      detail,
      composed: true,
      bubbles: true,
    }));
};

/**
 * Emits a value change event when a field's value changes.
 */
export const emitChangeEvent = (options: ChangePayload): void => {
  validateChangeEvent(options);
  _dispatchPublicEvent('value-change', {
    fieldName: options.fieldName,
    originalValue: options.originalValue,
    priorValue: options.priorValue,
    newValue: options.newValue,
    timestamp: options.timestamp
  }, options.deForm);
};

/**
 * Emits a tab change event when the active tab changes.
 */
export const emitTabChangeEvent = (options: TabChangeOptions): void => {
  validateTabChangeEvent(options);
  _dispatchPublicEvent('tab-change', {
    priorTabName: options.priorTabName,
    newTabName: options.newTabName,
    timestamp: options.timestamp
  }, options.deForm);
};

/**
 * Emits a discard changes event when changes are discarded.
 */
export const emitDiscardEvent = (options: DiscardOptions): void => {
  _dispatchPublicEvent('discard-changes', {
    timestamp: options.timestamp
  }, options.deForm);
};
