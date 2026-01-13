import type { DeForm, FormDataModel } from '../typedefs/index.js';
import { getFormControls } from '@shoelace-style/shoelace/dist/utilities/form.js';

/**
 * Validates all form controls within a form element.
 * Returns true if all controls pass validation.
 */
export function checkValidity(this: DeForm, form: HTMLFormElement): boolean {
  if (!form) {
    throw new Error('dynamic-form checkValidity called without providing form Node');
  }
  const formControls = getFormControls(form);
  const isValid = [...formControls].every((control: any) => control.checkValidity());
  return isValid;
}

/**
 * Collects all modified (dirty) field values from a form.
 * Returns an object with field names as keys and current values.
 */
export function getChanges(this: DeForm, form: HTMLFormElement): FormDataModel {
  if (!form) {
    throw new Error('dynamic-form getChanges called without providing form Node');
  }

  const modifiedFieldNodes = form.querySelectorAll('[data-dirty-field]:not([data-repeat-field])');

  // Collect data
  const formData: FormDataModel = {};
  Array
    .from(modifiedFieldNodes)
    .map((node) => (node as any).name)
    .forEach((fieldName: string) => {
      const { currentKey } = this.propKeys(fieldName);
      formData[fieldName] = (this as any)[currentKey];
    });

  return formData;
}

/**
 * Handles form submission.
 * Validates the form, collects changes, and calls the onSubmit handler.
 */
export async function _handleSubmit(this: DeForm, event: Event): Promise<void> {
  event.preventDefault();
  const formEl = event.currentTarget as HTMLFormElement;
  const isValid = this.checkValidity(formEl);
  const stagedChanges = this.getChanges(formEl);

  if (!isValid) {
    // Form has validation issues.
    return;
  }

  this._loading = true;
  const res = await this.onSubmit?.(stagedChanges, formEl, this);

  if (!res || (res as any).error) {
    // console.warn('Error submitting changes, changes not saved.', { res });
  }

  // If requireCommit is true, commitChanges must be called separately
  if (!this.requireCommit) {
    this.commitChanges(formEl);
    this._loading = false;
  }
}

/**
 * Commits staged changes by syncing current values to original values.
 * Resets dirty flags and dispatches a success event.
 */
export function commitChanges(this: DeForm, form: HTMLFormElement): void {
  if (!form) {
    throw new Error('dynamic-form commitChanges called without providing form Node');
  }

  // Get changes.
  const stagedChanges = this.getChanges(form);

  // Sync the prefixed properties
  Object.keys(stagedChanges).forEach((fieldName) => {
    const { currentKey, originalKey } = this.propKeys(fieldName);
    (this as any)[originalKey] = (this as any)[currentKey];
  });

  // Reset dirty flags on fields
  this._checkForChanges();

  // Dispatch a form success event.
  this.dispatchEvent(new CustomEvent('form-submit-success', {
    detail: {},
    composed: true,
    bubbles: true
  }));

  this._loading = false;
}

/**
 * Retains changes without committing, just clears the loading state.
 */
export function retainChanges(this: DeForm): void {
  this._loading = false;
}
