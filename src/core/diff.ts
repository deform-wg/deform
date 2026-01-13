import type { DeForm, FormDataModel, FormSection, FieldConfig, FormStateModel, FormValue, ValidationRule } from '../typedefs/index.js';
import { getDynFormValue, setDynBoolean, setDynNumber } from '../utils/dynamic-props.js';

/**
 * Checks all form fields for changes and updates dirty state.
 * Also triggers evaluation of reveal conditions.
 */
export function _checkForChanges(this: DeForm): void {
  const fields = this.fields;
  if (!fields?.sections) return;
  let dirty = 0;

  // Firstly, check if any field differs from prior state.
  fields.sections.forEach((section: FormSection) => {
    const flattenedFields: FieldConfig[] = [];
    let sectionChangeCount = 0;

    section.fields.forEach((field: FieldConfig) => {
      flattenedFields.push(field);
      if (field.type === 'toggleField') {
        flattenedFields.push(...field.fields);
      }
    });

    flattenedFields.forEach((field: FieldConfig) => {
      if (this._checkAndSetFieldDirtyStatus(field.name)) {
        sectionChangeCount++;
        dirty++;
      }
    });

    setDynNumber(this, `_form_${section.name}_count`, sectionChangeCount);
  });

  this._dirty = dirty;

  // [HACK] Process rules on next tick
  // Secondly, test whether any rule targeted fields have condition changes.
  setTimeout(() => {
    const currentState = this.getState();
    const currentValues = this.getFormValues();
    this._rules.forEach((rule: ValidationRule) => {
      if (rule.self) {
        this._checkAndSetConditionMetFlags(rule, currentState, currentValues);
      }
    });
  }, 1);
}

/**
 * Evaluates reveal conditions for a field based on its rule definition.
 */
export function _checkAndSetConditionMetFlags(
  this: DeForm,
  rule: ValidationRule,
  currentState: FormStateModel,
  currentValues: FormDataModel
): void {
  if (!rule.self) return;
  const revealKey = this.propKeys(rule.self).revealKey;

  if (!rule.fn) {
    // Obtain targets current value
    const targetValue = rule.target ? getDynFormValue(this, this.propKeys(rule.target).currentKey) : undefined;
    const desiredValue = rule.value;

    // Test the rule
    let newState: boolean;
    switch (rule.operator) {
      case "=":
        newState = targetValue == desiredValue;
        break;
      case "!=":
        newState = targetValue !== undefined && targetValue != desiredValue;
        break;
      default:
        newState = false;
    }

    // Toggle field flag (and being a reactive property, the UI will update);
    setDynBoolean(this, revealKey, newState);
  }

  if (rule.fn) {
    const shouldReveal = !!rule.fn(currentState, currentValues);
    setDynBoolean(this, revealKey, shouldReveal);
  }
}

/**
 * Checks if a field's current value differs from its original value
 * and updates the dirty flag accordingly.
 */
export function _checkAndSetFieldDirtyStatus(this: DeForm, fieldName: string): boolean {
  const { currentKey, originalKey, isDirtyKey } = this.propKeys(fieldName);

  // Replace undefined with an empty string for comparison
  // to handle the situation where a user has backspaced an input to "".
  const curr = (getDynFormValue(this, currentKey) ?? "") as FormValue | "";
  const orig = (getDynFormValue(this, originalKey) ?? "") as FormValue | "";
  const isDirty = curr !== orig;

  // Update the isDirty flag and return its value
  setDynBoolean(this, isDirtyKey, isDirty);
  return isDirty;
}
