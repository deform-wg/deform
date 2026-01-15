/**
 * DeForm Type Definitions
 *
 * This file contains the core type definitions for the DeForm library.
 * These types are designed to provide comprehensive type safety while
 * maintaining backward compatibility during the JavaScript to TypeScript migration.
 */

// ============================================================================
// Core Form Configuration Types
// ============================================================================

/**
 * Main form configuration interface
 */
export interface FormConfig {
  /** Array of form sections */
  sections: FormSection[];
  /** Theme preference - light or dark */
  theme?: 'light' | 'dark';
  /** Layout orientation */
  orientation?: 'portrait' | 'landscape';
  /** Color accent for the theme */
  accent?: string;
  /** Whether to require explicit commit of changes */
  requireCommit?: boolean;
  /** Whether to mark modified fields visually */
  markModifiedFields?: boolean;
  /** Whether to show count of modified fields */
  showModifiedCount?: boolean;
  /** Whether to allow discarding changes */
  allowDiscardChanges?: boolean;
}

/**
 * Form section containing related fields
 */
export interface FormSection {
  /** Unique identifier for the section */
  name: string;
  /** Fields within this section */
  fields: FieldConfig[];
  /** Custom submit button label */
  submitLabel?: string;
  /** Label to show after successful submission */
  submitLabelSuccess?: string;
}

// ============================================================================
// Field Configuration Types
// ============================================================================

/**
 * Base field configuration properties
 */
export interface BaseFieldConfig {
  /** Unique field identifier */
  name: string;
  /** Field type (discriminator) */
  type: string;
  /** Display label for the field */
  label?: string;
  /** Help text displayed below the field */
  help?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field should be hidden */
  hidden?: boolean;
  /** Whether to break to new line after this field */
  breakline?: boolean;
  /** Placeholder text for input fields */
  placeholder?: string;
  /** Visual size hint for Shoelace controls */
  size?: 'small' | 'medium' | 'large';
  /** Initial/default value (type depends on field) */
  value?: FormValue;
  /** Condition for revealing this field */
  revealOn?: RevealOn;
  /** Action button associated with the label */
  labelAction?: LabelAction;
}

/**
 * Text input field configuration
 */
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'password' | 'number';
  /** Minimum character length */
  minlength?: number;
  /** Maximum character length */
  maxlength?: number;
  /** Regex pattern for validation */
  pattern?: string;
  /** Visual size of the input */
  size?: 'small' | 'medium' | 'large';
  /** Whether the field can be cleared */
  clearable?: boolean;
  /** Whether to require password confirmation */
  requireConfirmation?: boolean;
  /** Whether to show password toggle */
  passwordToggle?: boolean;
  /** Min value (primarily for number/date-like inputs) */
  min?: number;
  /** Max value (primarily for number/date-like inputs) */
  max?: number;
  /** Step increment (primarily for number inputs) */
  step?: number;
  /** Hide spin buttons (Shoelace sl-input) */
  noSpinButtons?: boolean;
  /** Autofocus the control */
  autofocus?: boolean;
}

/**
 * Select dropdown field configuration
 */
export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  /** Available options for selection */
  options: SelectOption[];
  /** Whether multiple selections are allowed */
  multiple?: boolean;
  /** Whether the field can be cleared */
  clearable?: boolean;
  /** Max options visible in the dropdown before scrolling */
  maxOptionsVisible?: number;
  /** Hoist dropdown to avoid clipping in overflow containers */
  hoist?: boolean;
}

/**
 * Radio button field configuration
 */
export interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio';
  /** Available options for selection */
  options: SelectOption[];
}

/**
 * Radio button (single) field configuration
 */
export interface RadioButtonFieldConfig extends BaseFieldConfig {
  type: 'radioButton';
  /** Available options for selection */
  options: SelectOption[];
}

/**
 * Checkbox field configuration
 */
export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  /** Default checked state */
  defaultTo?: boolean;
  /** Whether the checkbox is indeterminate */
  indeterminate?: boolean;
}

/**
 * Toggle field configuration
 */
/**
 * Toggle/switch field configuration (boolean).
 */
export interface ToggleConfig extends BaseFieldConfig {
  type: 'toggle';
  /** Default checked state */
  defaultTo?: boolean;
}

/**
 * Toggle field configuration that swaps between multiple field variants.
 */
export interface ToggleFieldConfig extends BaseFieldConfig {
  type: 'toggleField';
  /** Default variant index (0 or 1) */
  defaultTo?: 0 | 1;
  /** Alternate field variants */
  fields: FieldConfig[];
  /** Labels for the toggle button corresponding to variants */
  labels: string[];
}

/**
 * Range slider field configuration
 */
export interface RangeFieldConfig extends BaseFieldConfig {
  type: 'range';
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step?: number;
  /** Show tooltip while dragging */
  showTooltip?: boolean;
}

/**
 * Rating field configuration
 */
export interface RatingFieldConfig extends BaseFieldConfig {
  type: 'rating';
  /** Maximum rating value */
  max?: number;
  /** Rating precision */
  precision?: number;
  /** Read-only mode */
  readonly?: boolean;
}

/**
 * Date field configuration
 */
export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
  /** Minimum allowed date */
  min?: string;
  /** Maximum allowed date */
  max?: string;
  /** Whether the field can be cleared */
  clearable?: boolean;
}

/**
 * Color picker field configuration
 */
export interface ColorFieldConfig extends BaseFieldConfig {
  type: 'color';
  /** Default color value */
  defaultTo?: string;
  /** Render inline instead of a popover */
  inline?: boolean;
  /** Enable opacity slider */
  opacity?: boolean;
  /** Disable format toggle button */
  noFormatToggle?: boolean;
  /** Uppercase hex values */
  uppercase?: boolean;
  /** Color format */
  format?: string;
  /** Swatches list */
  swatches?: string;
}

/**
 * Textarea field configuration
 */
export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  /** Minimum character length */
  minlength?: number;
  /** Maximum character length */
  maxlength?: number;
  /** Number of visible rows */
  rows?: number;
  /** Filled style */
  filled?: boolean;
  /** Resize mode */
  resize?: string;
  /** Read-only mode */
  readonly?: boolean;
  /** Autocapitalize setting */
  autocapitalize?: string;
  /** Autocorrect setting */
  autocorrect?: string;
  /** Autocomplete setting */
  autocomplete?: string;
  /** Autofocus the control */
  autofocus?: boolean;
  /** Enter key hint */
  enterkeyhint?: string;
  /** Spellcheck setting */
  spellcheck?: boolean;
  /** Input mode */
  inputmode?: string;
}

/**
 * Seed phrase field configuration
 */
export interface SeedphraseFieldConfig extends BaseFieldConfig {
  type: 'seedphrase';
  /** Number of words in the seed phrase */
  words?: number;
  /** Minimum character length */
  minlength?: number;
  /** Maximum character length */
  maxlength?: number;
  /** Number of visible rows */
  rows?: number;
  /** Filled style */
  filled?: boolean;
  /** Resize mode */
  resize?: string;
  /** Read-only mode */
  readonly?: boolean;
  /** Autocapitalize setting */
  autocapitalize?: string;
  /** Autocorrect setting */
  autocorrect?: string;
  /** Autocomplete setting */
  autocomplete?: string;
  /** Autofocus the control */
  autofocus?: boolean;
  /** Enter key hint */
  enterkeyhint?: string;
  /** Spellcheck setting */
  spellcheck?: boolean;
  /** Input mode */
  inputmode?: string;
}

/**
 * Union type for all field configurations
 */
export type FieldConfig =
  | TextFieldConfig
  | SelectFieldConfig
  | RadioFieldConfig
  | RadioButtonFieldConfig
  | CheckboxFieldConfig
  | ToggleConfig
  | ToggleFieldConfig
  | RangeFieldConfig
  | RatingFieldConfig
  | DateFieldConfig
  | ColorFieldConfig
  | TextareaFieldConfig
  | SeedphraseFieldConfig;

// ============================================================================
// Supporting Types
// ============================================================================

/**
 * Select option for dropdown and radio fields
 */
export interface SelectOption {
  /** Option value */
  value: string | number;
  /** Display label */
  label: string;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Whether this option is initially checked (radio/radio-button convenience) */
  checked?: boolean;
}

/**
 * Label action configuration
 */
export interface LabelAction {
  /** Action name/identifier */
  name: string;
  /** Display label for the action */
  label: string;
}

/**
 * Validation rule configuration
 */
export interface ValidationRule {
  /** Field name to validate */
  field?: string;
  /** Validation type */
  type?: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  /** Validation message */
  message?: string;
  /** Additional validation parameters */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** Self field name (for reveal rules) */
  self?: string;
  /** Target field name (for reveal rules) */
  target?: string;
  /** Operator for comparison (for reveal rules) */
  operator?: RevealOperator;
  /** Value to compare against (for reveal rules) */
  value?: FormValue;
  /** Custom function for reveal rules */
  fn?: RevealFunction;
}

// ============================================================================
// Reveal / Conditional Rendering Types
// ============================================================================

/** Supported operators for reveal rules. */
export type RevealOperator = '=' | '!=';

/**
 * Tuple form of reveal rules:
 * `[targetFieldName, operator, desiredValue]`
 */
export type RevealTuple = readonly [target: string, operator: RevealOperator, value: FormValue];

/** Function form of reveal rules. */
export type RevealFunction = (
  currentState: FormStateModel,
  currentValues: FormDataModel,
) => boolean;

/** Union of supported reveal rule definitions. */
export type RevealOn = RevealTuple | RevealFunction;

// ============================================================================
// Form Data and State Types
// ============================================================================

/**
 * Form data model - key-value pairs for field values
 */
export type FormValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | Array<string | number>;

export type FormDataModel = Record<string, FormValue>;

/**
 * Form state model, used by `getState()`.
 * Option-based fields return the selected option object rather than the raw value.
 */
export type FormStateValue = FormValue | SelectOption | undefined;
export type FormStateModel = Record<string, FormStateValue>;

/**
 * Change tracking payload for field updates
 */
export interface ChangePayload {
  /** Name of the field that changed */
  fieldName: string;
  /** Original value from form initialization */
  originalValue: FormValue;
  /** Previous value before the change */
  priorValue: FormValue;
  /** New value after the change */
  newValue: FormValue;
  /** Timestamp of the change */
  timestamp?: number;
  /** Reference to the DeForm instance */
  deForm: DeForm;
}

/**
 * Form submission payload
 */
export interface SubmitPayload {
  /** Form identifier */
  formId: string;
  /** Current form values */
  values: FormDataModel;
  /** Original form values */
  originalValues: FormDataModel;
  /** Whether the form has unsaved changes */
  hasChanges: boolean;
  /** Reference to the DeForm instance */
  deForm: DeForm;
}

// ============================================================================
// Renderer and Component Types
// ============================================================================

/**
 * Field renderer function signature
 */
export type FieldRenderer = (field: FieldConfig, options: RenderOptions) => unknown;

/**
 * Render options passed to field renderers
 */
export interface RenderOptions {
  /** Label element to include */
  labelEl?: import('lit').TemplateResult | typeof import('lit').nothing;
  /** Additional CSS classes */
  classes?: string;
}

/**
 * DeForm component interface
 */
export interface DeForm {
  /** Current form values */
  values: FormDataModel;
  /** Field configurations */
  fields: FormConfig | undefined;
  /** Theme setting */
  theme: 'light' | 'dark';
  /** Orientation setting */
  orientation: string;
  /** Submit handler function */
  onSubmit?: (changes: FormDataModel, form: HTMLFormElement, deForm: DeForm) => Promise<unknown>;
  /**
   * Optional change handler invoked after value-change events.
   * Kept for backward compatibility with prior JS API.
   */
  onChange?: (change: Omit<ChangePayload, 'deForm'>, deForm: DeForm) => void;
  /** Whether to require commit of changes */
  requireCommit: boolean;
  /** Whether to mark modified fields */
  markModifiedFields: boolean;
  /** Whether to show modified count */
  showModifiedCount: boolean;
  /** Whether to allow discarding changes */
  allowDiscardChanges: boolean;
  /** Color accent */
  accent: string;

  // Internal state properties
  _activeFormId: string | null;
  _dirty: number;
  _initializing: boolean;
  _loading: boolean;
  _rules: ValidationRule[];
  _flattenedFields: FieldConfig[];
  _celebrate: boolean;

  // Methods
  // Core lifecycle / helpers (bound at runtime)
  _initializeFormFieldProperties: (newValue: FormConfig) => void;
  _initializeValuesPreservingEdits: (newValue: FormDataModel) => void;
  _dispatchEvent: (name: string, detail: Record<string, unknown>) => void;
  _onUpdate: (changedProperties: Map<string, unknown>) => Promise<void>;

  // Render helpers (bound at runtime)
  _generateOneOrManyForms: (data: FormConfig) => import('lit').TemplateResult;
  _generateField: (
    field: FieldConfig,
  ) => import('lit').TemplateResult | typeof import('lit').nothing;
  _generateErrorField: (field: FieldConfig) => import('lit').TemplateResult;
  _generateFormControls: (options: {
    formId: string;
    submitLabel?: string;
    submitLabelSuccess?: string;
  }) => import('lit').TemplateResult;

  // State helpers
  getFormValues: () => FormDataModel;
  getState: () => FormStateModel;
  setValue: (fieldName: string, newValue: FormValue) => void;
  toggleLabelLoader: (fieldName: string) => void;

  _handleInput: (event: Event) => void;
  _handleToggle: (event: Event) => void;
  _handleChoice: (event: Event) => void;
  _handleRating: (event: Event) => void;
  _handleTabChange: (event: Event, tabName: string) => void;
  _handleSubmit: (event: Event) => void;
  _handleDiscardChanges: (event: Event) => void;
  _checkForChanges: (fieldName?: string, newValue?: FormValue) => void;
  _checkAndSetFieldDirtyStatus: (fieldName: string) => boolean;
  _checkAndSetConditionMetFlags: (
    rule: ValidationRule,
    currentState: FormStateModel,
    currentValues: FormDataModel,
  ) => void;
  _shouldUpdateForm: (changedProperties: Map<string, unknown>) => boolean;
  _getTargetForm: (changedProperties: Map<string, unknown>) => HTMLFormElement | null;
  _updateActiveFormId: (form: HTMLFormElement, changedProperties: Map<string, unknown>) => void;
  propKeys: (fieldName: string) => PropKeys;
  checkValidity: (form: HTMLFormElement) => boolean;
  getChanges: (form: HTMLFormElement) => FormDataModel;
  commitChanges: (form: HTMLFormElement) => void;
  retainChanges: () => void;
  dispatchEvent: (event: Event) => boolean;
}

/**
 * Property key mapping for field state
 */
export interface PropKeys {
  /** Key for current field value */
  currentKey: string;
  /** Key for original field value */
  originalKey: string;
  /** Key for dirty state */
  isDirtyKey: string;
  /** Key for password repeat field */
  repeatKey: string;
  /** Key for toggle field variant index */
  variantIndexKey: string;
  /** Key for reveal condition state */
  revealKey: string;
  /** Key for label loading state */
  labelKey: string;
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * Form change event
 */
export type FormChangeEvent = CustomEvent<ChangePayload>;

/**
 * Tab change event
 */
export type TabChangeEvent = CustomEvent<{
  tabName: string;
  deForm: DeForm;
}>;

/**
 * Form submit event
 */
export type FormSubmitEvent = CustomEvent<SubmitPayload>;

/**
 * Discard changes event
 */
export type DiscardEvent = CustomEvent<{
  deForm: DeForm;
}>;

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Function that can be bound to a class instance
 */
export type BindableFunction = (...args: never[]) => unknown;

/**
 * Map of functions that can be bound to a class
 */
export type FunctionMap = Record<string, BindableFunction>;

/**
 * Debounced function type
 */
export type DebouncedFunction<T extends (...args: unknown[]) => unknown> = T & {
  cancel: () => void;
  flush: () => void;
};

// All types are already exported above
