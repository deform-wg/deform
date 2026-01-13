import type { DeForm, ChangePayload } from '../typedefs/index.js';
import {
  emitChangeEvent,
  emitTabChangeEvent,
  emitDiscardEvent
} from './events.js';

/**
 * Handles input events for text-based form controls.
 */
export function _handleInput(this: DeForm, event: Event): void {
  const target = event.target as HTMLInputElement;
  const { currentKey, originalKey } = this.propKeys(target.name);

  const fieldName = target.name;
  const originalValue = (this as any)[originalKey];
  const priorValue = (this as any)[currentKey];
  const newValue = target.value;

  (this as any)[currentKey] = newValue;
  this._checkForChanges(fieldName, newValue);

  const changePayload: ChangePayload = {
    fieldName,
    originalValue,
    priorValue,
    newValue,
    timestamp: Date.now(),
    deForm: this
  };

  emitChangeEvent(changePayload);
  onChangeCallback(changePayload);
}

/**
 * Handles toggle/checkbox events for boolean form controls.
 */
export function _handleToggle(this: DeForm, event: Event): void {
  const target = event.target as HTMLInputElement;
  const { currentKey, originalKey } = this.propKeys(target.name);

  const fieldName = target.name;
  const originalValue = (this as any)[originalKey];
  const priorValue = (this as any)[currentKey];
  const newValue = target.checked;

  (this as any)[currentKey] = newValue;
  this._checkForChanges(fieldName, newValue);

  const changePayload: ChangePayload = {
    fieldName,
    originalValue,
    priorValue,
    newValue,
    deForm: this
  };

  emitChangeEvent(changePayload);
  onChangeCallback(changePayload);
}

/**
 * Handles choice events for select/radio form controls.
 */
export function _handleChoice(this: DeForm, event: Event): void {
  const target = event.target as HTMLSelectElement;
  const { currentKey, originalKey } = this.propKeys(target.name);

  const fieldName = target.name;
  const originalValue = (this as any)[originalKey];
  const priorValue = (this as any)[currentKey];
  const newValue = target.value;

  (this as any)[currentKey] = newValue;
  this._checkForChanges(fieldName, newValue);

  const changePayload: ChangePayload = {
    fieldName,
    originalValue,
    priorValue,
    newValue,
    deForm: this
  };

  emitChangeEvent(changePayload);
  onChangeCallback(changePayload);
}

/**
 * Handles rating control events.
 */
export function _handleRating(this: DeForm, event: Event): void {
  const target = event.target as HTMLElement & { value: number; dataset: DOMStringMap };
  const { currentKey, originalKey } = this.propKeys(target.dataset['name']!);

  const fieldName = target.dataset['name']!;
  const originalValue = (this as any)[originalKey];
  const priorValue = (this as any)[currentKey];
  const newValue = target.value;

  (this as any)[currentKey] = newValue;
  this._checkForChanges(fieldName, newValue);

  const changePayload: ChangePayload = {
    fieldName,
    originalValue,
    priorValue,
    newValue,
    deForm: this
  };

  emitChangeEvent(changePayload);
  onChangeCallback(changePayload);
}

/**
 * Handles tab change events for multi-section forms.
 */
export function _handleTabChange(this: DeForm, _event: Event, tabName: string): void {
  this._activeFormId = tabName;

  emitTabChangeEvent({
    priorTabName: 'todo..',
    newTabName: tabName,
    deForm: this
  });
}

/**
 * Handles discard changes button click.
 * Resets all modified fields to their original values.
 */
export function _handleDiscardChanges(this: DeForm, event: Event): void {
  event.preventDefault();

  // Reset fields of active form to initial data state
  const modifiedFieldNodes = (this as any).shadowRoot.querySelectorAll(
    `#${this._activeFormId} [data-dirty-field]`,
  );
  Array.from(modifiedFieldNodes as NodeListOf<HTMLElement>)
    .map((node) => (node as any).name)
    .forEach((fieldName: string) => {
      const { currentKey, originalKey } = this.propKeys(fieldName);
      (this as any)[currentKey] = (this as any)[originalKey];
    });

  this._checkForChanges();
  emitDiscardEvent({
    deForm: this
  });
}

/**
 * Internal callback that invokes the user-provided onChange handler if present.
 */
function onChangeCallback(options: ChangePayload): void {
  const {
    fieldName,
    originalValue,
    priorValue,
    newValue,
    timestamp,
    deForm,
  } = options;

  if ((deForm as any).onChange && typeof (deForm as any).onChange === 'function') {
    try {
      (deForm as any).onChange({
        fieldName,
        originalValue,
        priorValue,
        newValue,
        timestamp
      }, deForm);
    } catch (onChangeErr) {
      console.error('An error occured when executing the provided onChange function', onChangeErr);
    }
  }
}
