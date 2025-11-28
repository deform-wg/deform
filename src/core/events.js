function validateChangeEvent(options) {
  if (!options?.fieldName) {
    throw new Error('fieldName is required for change event');
  }
  if (options.newValue === undefined) {
    throw new Error('newValue is required for change event');
  }
}

function validateTabChangeEvent(options) {
  if (!options?.newTabName) {
    throw new Error('newTabName is required for tab change event');
  }
}

export function _dispatchEvent(name, detail) {
  // Internal event.
  this.dispatchEvent(new CustomEvent(
  `form-${name}`, {
    detail,
    composed: true,
    bubbles: true,
  }));
}

export const _dispatchPublicEvent = (name, detail, deForm) => {
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
}

export const emitChangeEvent = (options) => {
  validateChangeEvent(options);
  _dispatchPublicEvent('value-change', {
    fieldName: options.fieldName,
    originalValue: options.originalValue, 
    priorValue: options.priorValue,
    newValue: options.newValue,
    timestamp: options.timestamp
  }, options.deForm);
}

export const emitTabChangeEvent = (options) => {
  validateTabChangeEvent(options);
  _dispatchPublicEvent('tab-change', {
    priorTabName: options.priorTabName,
    newTabName: options.newTabName,
    timestamp: options.timestamp
  }, options.deForm);
}

export const emitDiscardEvent = (options) => {
  _dispatchPublicEvent('discard-changes', {
    timestamp: options.timestamp
  }, options.deForm);
}