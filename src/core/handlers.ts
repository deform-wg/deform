import type { ChangePayload, DeForm, FormValue } from '../typedefs/index.js';
import {
  emitChangeEvent,
  emitTabChangeEvent,
  emitDiscardEvent
} from './events.js';
import { isNamedElement } from '../utils/dom-guards.js';
import { getDynFormValue, setDynFormValue } from '../utils/dynamic-props.js';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readName(target: unknown): string | null {
  if (!isObject(target)) return null;
  const n = target['name'];
  return typeof n === 'string' ? n : null;
}

function readValue(target: unknown): FormValue | null {
  if (!isObject(target)) return null;
  const v = target['value'];
  if (v === null || v === undefined) return v;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v;
  if (Array.isArray(v) && v.every((x) => typeof x === 'string')) return v;
  if (Array.isArray(v) && v.every((x) => typeof x === 'number')) return v;
  if (Array.isArray(v) && v.every((x) => typeof x === 'string' || typeof x === 'number')) return v;
  return null;
}

function readChecked(target: unknown): boolean | null {
  if (!isObject(target)) return null;
  const c = target['checked'];
  return typeof c === 'boolean' ? c : null;
}

/**
 * Handles input events for text-based form controls.
 */
export function _handleInput(this: DeForm, event: Event): void {
  const name = readName(event.target);
  const value = readValue(event.target);
  if (!name || typeof value !== 'string') return;
  const { currentKey, originalKey } = this.propKeys(name);

  const fieldName = name;
  const originalValue = getDynFormValue(this, originalKey);
  const priorValue = getDynFormValue(this, currentKey);
  const newValue: FormValue = value;

  setDynFormValue(this, currentKey, newValue);
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
  const name = readName(event.target);
  const checked = readChecked(event.target);
  if (!name || checked === null) return;
  const { currentKey, originalKey } = this.propKeys(name);

  const fieldName = name;
  const originalValue = getDynFormValue(this, originalKey);
  const priorValue = getDynFormValue(this, currentKey);
  const newValue: FormValue = checked;

  setDynFormValue(this, currentKey, newValue);
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
 * Handles choice events for select/radio form controls.
 */
export function _handleChoice(this: DeForm, event: Event): void {
  const name = readName(event.target);
  const value = readValue(event.target);
  if (!name || value === null) return;
  const { currentKey, originalKey } = this.propKeys(name);

  const fieldName = name;
  const originalValue = getDynFormValue(this, originalKey);
  const priorValue = getDynFormValue(this, currentKey);
  const newValue: FormValue = value;

  setDynFormValue(this, currentKey, newValue);
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
 * Handles rating control events.
 */
export function _handleRating(this: DeForm, event: Event): void {
  const target = event.target;
  if (!isObject(target)) return;
  const dataset = target['dataset'];
  const name = isObject(dataset) ? dataset['name'] : undefined;
  const value = target['value'];
  if (typeof name !== 'string' || typeof value !== 'number') return;
  const { currentKey, originalKey } = this.propKeys(name);

  const fieldName = name;
  const originalValue = getDynFormValue(this, originalKey);
  const priorValue = getDynFormValue(this, currentKey);
  const newValue: FormValue = value;

  setDynFormValue(this, currentKey, newValue);
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
 * Handles tab change events for multi-section forms.
 */
export function _handleTabChange(this: DeForm, _event: Event, tabName: string): void {
  const priorTabName = this._activeFormId;
  this._activeFormId = tabName;

  emitTabChangeEvent({
    ...(priorTabName ? { priorTabName } : {}),
    newTabName: tabName,
    timestamp: Date.now(),
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
  const shadowRoot = (this as unknown as { shadowRoot?: ShadowRoot | null }).shadowRoot ?? null;
  const modifiedFieldNodes = shadowRoot?.querySelectorAll(
    `#${this._activeFormId} [data-dirty-field]`,
  ) ?? [];
  Array.from(modifiedFieldNodes)
    .filter(isNamedElement)
    .map((node) => node.name)
    .forEach((fieldName: string) => {
      const { currentKey, originalKey } = this.propKeys(fieldName);
      const orig = getDynFormValue(this, originalKey);
      setDynFormValue(this, currentKey, orig);
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

  if (deForm.onChange && typeof deForm.onChange === 'function') {
    try {
      const change = {
        fieldName,
        originalValue,
        priorValue,
        newValue,
        ...(timestamp !== undefined ? { timestamp } : {}),
      };
      deForm.onChange(change, deForm);
    } catch (onChangeErr) {
      console.error('An error occured when executing the provided onChange function', onChangeErr);
    }
  }
}
