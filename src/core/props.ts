import type {
  DeForm,
  FieldConfig,
  FormConfig,
  FormDataModel,
  FormValue,
  PropKeys,
  ValidationRule,
} from '../typedefs/index.js';
import {
  getDynBoolean,
  getDynFormValue,
  setDyn,
  setDynFormValue,
  setDynNumber,
} from '../utils/dynamic-props.js';

// Type for LitElement constructor with createProperty
interface LitElementConstructor {
  createProperty: (name: string, options: object) => void;
}

type FieldPropertyType =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ArrayConstructor;

function getFieldPropertyType(field: FieldConfig): FieldPropertyType {
  // Multi-select values must be arrays.
  if (field.type === 'select' && field.multiple) return Array;

  // Boolean controls.
  if (field.type === 'checkbox' || field.type === 'toggle') return Boolean;

  // Numeric-ish controls.
  if (field.type === 'range' || field.type === 'rating') return Number;

  // Default to string for text-ish controls and everything else.
  return String;
}

/**
 * Initializes reactive properties for all form fields.
 * Creates current value, original value, dirty tracking, and other state properties.
 */
export function _initializeFormFieldProperties(this: DeForm, newValue: FormConfig): void {
  newValue.sections.forEach((section) => {
    // For each section, create a property to track modified field count
    const elementCtor = this.constructor as unknown as LitElementConstructor;
    elementCtor.createProperty(`_form_${section.name}_count`, {
      type: Number,
    });
    setDynNumber(this, `_form_${section.name}_count`, 0);

    this._flattenedFields = this._flattenedFields || [];
    section.fields.forEach((field) => {
      // Push all field types.
      this._flattenedFields.push(field);

      // Additionally, for toggleFields push nested fields.
      if (field.type === 'toggleField') {
        field.fields.forEach((f: FieldConfig) => {
          this._flattenedFields.push(f);
        });
      }
    });

    this._flattenedFields.forEach((field) => {
      const {
        currentKey,
        originalKey,
        isDirtyKey,
        repeatKey,
        variantIndexKey,
        revealKey,
        labelKey,
      } = this.propKeys(field.name);

      // Determine property type based on field configuration
      const propertyType = getFieldPropertyType(field);
      const isMultiSelect = propertyType === Array;

      // Create the standard property
      elementCtor.createProperty(currentKey, { type: propertyType });

      // Create the prefixed property (used for change tracking)
      elementCtor.createProperty(originalKey, { type: propertyType });

      // Initialize multi-select fields with empty array to prevent Shoelace errors
      if (isMultiSelect) {
        const curr = getDynFormValue(this, currentKey);
        const orig = getDynFormValue(this, originalKey);
        setDynFormValue(this, currentKey, Array.isArray(curr) ? curr : []);
        setDynFormValue(this, originalKey, Array.isArray(orig) ? orig : []);
      }

      // Initialize with default value from field config if provided
      if ('value' in field && field.value !== undefined) {
        setDynFormValue(this, currentKey, field.value);
        setDynFormValue(this, originalKey, field.value);
      }

      // Create a property for dirty tracking
      elementCtor.createProperty(isDirtyKey, { type: Boolean });

      if (
        field.type === 'password' &&
        'requireConfirmation' in field &&
        field.requireConfirmation
      ) {
        elementCtor.createProperty(repeatKey, { type: String });
      }

      // Create a property to track field visibility (for A/B fields)
      if (field.type === 'toggleField') {
        elementCtor.createProperty(variantIndexKey, { type: Number });
        setDynNumber(
          this,
          variantIndexKey,
          typeof field.defaultTo === 'number' ? field.defaultTo : 0,
        );
      }

      // Create a property to track reveal condition
      if (field.revealOn) {
        const exists = this._rules.find((r) => r.self === field.name);
        if (exists) return;

        elementCtor.createProperty(revealKey, { type: Boolean });
        elementCtor.createProperty(labelKey, { type: Boolean });

        try {
          if (typeof field.revealOn === 'function') {
            const rule: ValidationRule = {
              self: field.name,
              fn: field.revealOn,
            };
            this._rules.push(rule);
          } else {
            const [target, operator, value] = field.revealOn;
            const rule: ValidationRule = {
              self: field.name,
              target,
              operator,
              value,
            };
            this._rules.push(rule);
          }
        } catch (ruleErr) {
          console.warn('Error with field rule', ruleErr, field.revealOn);
        }
      }
    });
  });
}

/**
 * Initializes form values while preserving any unsaved edits.
 * When new values come from external sources (parent component, websocket),
 * dirty fields keep their current values.
 */
export function _initializeValuesPreservingEdits(this: DeForm, newValue: FormDataModel): void {
  const _newValue: FormDataModel = {};
  // When dynamic-form is provided new values via an external actor
  // We should not immediately adopt them as the user may have edits.
  // Preserve edits.
  Object.keys(newValue).forEach((key) => {
    const { currentKey, originalKey, isDirtyKey } = this.propKeys(key);

    if (getDynBoolean(this, isDirtyKey)) {
      // If the field is dirty, retain the current value
      const curr = getDynFormValue(this, currentKey);
      _newValue[key] = curr;
    } else {
      // If the field is not dirty, update it with the new value
      const v = newValue[key] as FormValue;
      setDynFormValue(this, currentKey, v);
      setDynFormValue(this, originalKey, v);
      _newValue[key] = v;
    }
  });

  setDyn(this, '_values', _newValue);
}

/**
 * Generates property key names for a given field.
 * Used for accessing current values, original values, dirty state, etc.
 */
export function propKeys(fieldName: string): PropKeys {
  const lowerName = fieldName.toLowerCase();
  return {
    currentKey: `_${lowerName}`,
    originalKey: `__${lowerName}`,
    isDirtyKey: `__${lowerName}_is_dirty`,
    repeatKey: `_${lowerName}_repeat`,
    variantIndexKey: `_${lowerName}_variant`,
    revealKey: `_${lowerName}_reveal_condition_met`,
    labelKey: `_${lowerName}_label`,
  };
}
