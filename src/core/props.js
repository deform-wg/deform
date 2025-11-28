export function _initializeFormFieldProperties(newValue) {
  newValue.sections.forEach((section) => {
    // For each section, create a property to track modified field count
    this.constructor.createProperty(`_form_${section.name}_count`, {
      type: Number,
    });
    this[`_form_${section.name}_count`] = 0;

    this._flattenedFields = this._flattenedFields || [];
    section.fields.forEach((field) => {
      // Push all field types.
      this._flattenedFields.push(field);

      // Additionally, for toggleFields push nested fields.
      if (field.type === "toggleField") {
        field.fields.forEach((f) => {
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

      // Create the standard property
      this.constructor.createProperty(currentKey, { type: String });

      // Create the prefixed property (used for change tracking)
      this.constructor.createProperty(originalKey, { type: String });

      // Initialize with default value from field config if provided
      if (field.value !== undefined) {
        this[currentKey] = field.value;
        this[originalKey] = field.value;
      }

      // Create a property for dirty tracking
      this.constructor.createProperty(isDirtyKey, { type: Boolean });

      if (field.type === "password" && field.requireConfirmation) {
        this.constructor.createProperty(repeatKey, { type: String });
      }

      // Create a property to track field visibility (for A/B fields)
      if (field.type === "toggleField") {
        this.constructor.createProperty(variantIndexKey, { type: Number });
        this[variantIndexKey] = parseInt(field.defaultTo) || 0;
      }

      // Create a property to track reveal condition
      if (field.revealOn) {
        const exists = this._rules.find(r => r.self === field.name);
        if (exists) return;

        this.constructor.createProperty(revealKey, { type: Boolean });
        this.constructor.createProperty(labelKey, { type: Boolean });

        try {
          let rule = {}

          if (typeof field.revealOn === 'function') {
            rule = {
               self: field.name,
               fn: field.revealOn
            }
          } else {
            rule = {
              self: field.name,
              target: field.revealOn[0],
              operator: field.revealOn[1],
              value: field.revealOn[2],
            }
          }

          this._rules.push(rule)
        } catch (ruleErr) {
          console.warn('Error with field rule', ruleErr, field.revealOn)
        }
      }
    });
  });
}

export function _initializeValuesPreservingEdits(newValue) {
  const _newValue = {};
  // When dynamic-form is provided new values via an external actor
  // We should not immediately adopt them as the user may have edits.
  // Preserve edits.
  Object.keys(newValue).forEach((key) => {
    const { currentKey, originalKey, isDirtyKey } = this.propKeys(key);

    if (this[isDirtyKey]) {
      // If the field is dirty, retain the current value
      _newValue[key] = this[currentKey];
    } else {
      // If the field is not dirty, update it with the new value
      this[currentKey] = newValue[key];
      this[originalKey] = newValue[key];
      _newValue[key] = newValue[key];
    }
  });

  this._values = _newValue;
}

export function propKeys(fieldName) {
  return {
    currentKey: `_${fieldName.toLowerCase()}`,
    originalKey: `__${fieldName.toLowerCase()}`,
    isDirtyKey: `__${fieldName.toLowerCase()}_is_dirty`,
    repeatKey: `_${fieldName.toLowerCase()}_repeat`,
    variantIndexKey: `_${fieldName.toLowerCase()}_variant`,
    revealKey: `_${fieldName.toLowerCase()}_reveal_condition_met`,
    labelKey: `_${fieldName.toLowerCase()}_label`,
  };
}
