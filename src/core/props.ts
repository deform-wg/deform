import type { DeForm, FieldConfig, FormConfig, PropKeys } from '../typedefs/index.js';

// Type for LitElement constructor with createProperty
interface LitElementConstructor {
  createProperty: (name: string, options: object) => void;
}

/**
 * Initializes reactive properties for all form fields.
 * Creates current value, original value, dirty tracking, and other state properties.
 */
export function _initializeFormFieldProperties(this: DeForm, newValue: FormConfig): void {
  newValue.sections.forEach((section) => {
    // For each section, create a property to track modified field count
    const constructor = this.constructor as unknown as LitElementConstructor;
    constructor.createProperty(`_form_${section.name}_count`, {
      type: Number,
    });
    (this as any)[`_form_${section.name}_count`] = 0;

    this._flattenedFields = this._flattenedFields || [];
    section.fields.forEach((field) => {
      // Push all field types.
      this._flattenedFields.push(field);

      // Additionally, for toggleFields push nested fields.
      if (field.type === "toggleField" && 'fields' in field) {
        (field as any).fields.forEach((f: FieldConfig) => {
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
      const isMultiSelect = field.type === 'select' && 'multiple' in field && (field as any).multiple;
      const propertyType = isMultiSelect ? Array : String;

      // Create the standard property
      constructor.createProperty(currentKey, { type: propertyType });

      // Create the prefixed property (used for change tracking)
      constructor.createProperty(originalKey, { type: propertyType });

      // Initialize multi-select fields with empty array to prevent Shoelace errors
      if (isMultiSelect) {
        (this as any)[currentKey] = (this as any)[currentKey] || [];
        (this as any)[originalKey] = (this as any)[originalKey] || [];
      }

      // Initialize with default value from field config if provided
      if ('value' in field && field.value !== undefined) {
        (this as any)[currentKey] = field.value;
        (this as any)[originalKey] = field.value;
      }

      // Create a property for dirty tracking
      constructor.createProperty(isDirtyKey, { type: Boolean });

      if (field.type === "password" && 'requireConfirmation' in field && field.requireConfirmation) {
        constructor.createProperty(repeatKey, { type: String });
      }

      // Create a property to track field visibility (for A/B fields)
      if (field.type === "toggleField") {
        constructor.createProperty(variantIndexKey, { type: Number });
        (this as any)[variantIndexKey] = parseInt(String((field as any).defaultTo)) || 0;
      }

      // Create a property to track reveal condition
      if ('revealOn' in field && field.revealOn) {
        const exists = this._rules.find(r => r.self === field.name);
        if (exists) return;

        constructor.createProperty(revealKey, { type: Boolean });
        constructor.createProperty(labelKey, { type: Boolean });

        try {
          let rule: any = {};

          if (typeof field.revealOn === 'function') {
            rule = {
              self: field.name,
              fn: field.revealOn
            };
          } else {
            rule = {
              self: field.name,
              target: (field.revealOn as any)[0],
              operator: (field.revealOn as any)[1],
              value: (field.revealOn as any)[2],
            };
          }

          this._rules.push(rule);
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
export function _initializeValuesPreservingEdits(this: DeForm, newValue: Record<string, any>): void {
  const _newValue: Record<string, any> = {};
  // When dynamic-form is provided new values via an external actor
  // We should not immediately adopt them as the user may have edits.
  // Preserve edits.
  Object.keys(newValue).forEach((key) => {
    const { currentKey, originalKey, isDirtyKey } = this.propKeys(key);

    if ((this as any)[isDirtyKey]) {
      // If the field is dirty, retain the current value
      _newValue[key] = (this as any)[currentKey];
    } else {
      // If the field is not dirty, update it with the new value
      (this as any)[currentKey] = newValue[key];
      (this as any)[originalKey] = newValue[key];
      _newValue[key] = newValue[key];
    }
  });

  (this as any)._values = _newValue;
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
