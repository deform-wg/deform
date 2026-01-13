import type { DeForm, FormDataModel, FormSection, FieldConfig, ValidationRule } from '../typedefs/index.js';

/**
 * Checks all form fields for changes and updates dirty state.
 * Also triggers evaluation of reveal conditions.
 */
export function _checkForChanges(this: DeForm): void {
  const fields = (this as any).fields as { sections?: FormSection[] } | undefined;
  if (!fields?.sections) return;
  let dirty = 0;

  // Firstly, check if any field differs from prior state.
  fields.sections.forEach((section: FormSection) => {
    const flattenedFields: FieldConfig[] = [];
    let sectionChangeCount = 0;

    section.fields.forEach((field: FieldConfig) => {
      flattenedFields.push(field);
      if (field.type === 'toggleField' && 'fields' in field) {
        ((field as any).fields as FieldConfig[]).forEach((f: FieldConfig) => {
          flattenedFields.push(f);
        });
      }
    });

    flattenedFields.forEach((field: FieldConfig) => {
      if (this._checkAndSetFieldDirtyStatus(field.name)) {
        sectionChangeCount++;
        dirty++;
      }
    });

    (this as any)[`_form_${section.name}_count`] = sectionChangeCount;
  });

  this._dirty = dirty;

  // [HACK] Process rules on next tick
  // Secondly, test whether any rule targeted fields have condition changes.
  setTimeout(() => {
    const currentState = (this as any).getState();
    const currentValues = (this as any).getFormValues();
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
  currentState: FormDataModel,
  currentValues: FormDataModel
): void {
  if (!rule.self) return;
  const revealKey = this.propKeys(rule.self).revealKey;

  if (!rule.fn) {
    // Obtain targets current value
    const targetValue = rule.target ? (this as any)[this.propKeys(rule.target).currentKey] : undefined;
    const desiredValue = rule.value;

    // Test the rule
    let newState: boolean;
    switch (rule.operator) {
      case "=":
        newState = targetValue == desiredValue;
        break;
      case "!=":
        newState = targetValue && targetValue != desiredValue;
        break;
      default:
        newState = false;
    }

    // Toggle field flag (and being a reactive property, the UI will update);
    (this as any)[revealKey] = newState;
  }

  if (rule.fn) {
    const shouldReveal = !!rule.fn(currentState, currentValues);
    (this as any)[revealKey] = shouldReveal;
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
  const curr = (this as any)[currentKey] ?? "";
  const orig = (this as any)[originalKey] ?? "";
  const isDirty = curr !== orig;

  // Update the isDirty flag and return its value
  (this as any)[isDirtyKey] = isDirty;
  return isDirty;
}
