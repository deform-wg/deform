import type { DeForm } from '../typedefs/index.js';
import { customElementsReady } from '../utils/custom-elements-ready.js';

type PropertyKey = string;

function getShadowRoot(host: DeForm): ShadowRoot | null {
  const maybe = host as unknown as { shadowRoot?: ShadowRoot | null };
  return maybe.shadowRoot ?? null;
}

/**
 * Handles property updates and triggers form initialization when needed.
 */
export async function _onUpdate(
  this: DeForm,
  changedProperties: Map<PropertyKey, unknown>,
): Promise<void> {
  if (changedProperties.has('fields') || changedProperties.has('values')) {
    // Run rules.
    this._checkForChanges();
  }

  if (!this._shouldUpdateForm(changedProperties)) {
    return;
  }
  // Determine the appropriate form to target

  const form = this._getTargetForm(changedProperties);
  if (!form) {
    return;
  }

  // Update the active form ID if necessary
  this._updateActiveFormId(form, changedProperties);

  // Ensure all custom elements within the form are fully defined
  await customElementsReady(form);
}

/**
 * Determines if the form should be updated based on changed properties.
 */
export function _shouldUpdateForm(
  this: DeForm,
  changedProperties: Map<PropertyKey, unknown>,
): boolean {
  return changedProperties.has('fields') || changedProperties.has('_activeFormId');
}

/**
 * Gets the target form element based on initialization state.
 */
export function _getTargetForm(
  this: DeForm,
  changedProperties: Map<PropertyKey, unknown>,
): HTMLFormElement | null {
  const isDataInitialization =
    changedProperties.has('fields') &&
    (!changedProperties.has('_activeFormId') || !this._activeFormId);

  const formSelector = isDataInitialization ? 'form' : `form#${this._activeFormId}`;

  return getShadowRoot(this)?.querySelector<HTMLFormElement>(formSelector) ?? null;
}

/**
 * Updates the active form ID during initialization.
 */
export function _updateActiveFormId(
  this: DeForm,
  form: HTMLFormElement,
  changedProperties: Map<PropertyKey, unknown>,
): void {
  const isDataInitialization =
    changedProperties.has('fields') &&
    (!changedProperties.has('_activeFormId') || !this._activeFormId);

  if (isDataInitialization) {
    this._activeFormId = form.id;
  }
}
