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
  /** Whether the field should be hidden */
  hidden?: boolean;
  /** Whether to break to new line after this field */
  breakline?: boolean;
  /** Placeholder text for input fields */
  placeholder?: string;
  /** Condition for revealing this field */
  revealOn?: string;
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
}

/**
 * Toggle field configuration
 */
export interface ToggleFieldConfig extends BaseFieldConfig {
  type: 'toggle' | 'toggleField';
  /** Default value (0 or 1) */
  defaultTo?: 0 | 1;
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
}

/**
 * Rating field configuration
 */
export interface RatingFieldConfig extends BaseFieldConfig {
  type: 'rating';
  /** Maximum rating value */
  max?: number;
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
}

/**
 * Color picker field configuration
 */
export interface ColorFieldConfig extends BaseFieldConfig {
  type: 'color';
  /** Default color value */
  defaultTo?: string;
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
}

/**
 * Seed phrase field configuration
 */
export interface SeedphraseFieldConfig extends BaseFieldConfig {
  type: 'seedphrase';
  /** Number of words in the seed phrase */
  words?: number;
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
  field: string;
  /** Validation type */
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  /** Validation message */
  message: string;
  /** Additional validation parameters */
  params?: Record<string, any>;
}

// ============================================================================
// Form Data and State Types
// ============================================================================

/**
 * Form data model - key-value pairs for field values
 */
export interface FormDataModel {
  [key: string]: any;
}

/**
 * Change tracking payload for field updates
 */
export interface ChangePayload {
  /** Name of the field that changed */
  fieldName: string;
  /** Original value from form initialization */
  originalValue: any;
  /** Previous value before the change */
  priorValue: any;
  /** New value after the change */
  newValue: any;
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
export type FieldRenderer = (field: FieldConfig, options: RenderOptions) => any;

/**
 * Render options passed to field renderers
 */
export interface RenderOptions {
  /** Label element to include */
  labelEl?: any;
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
  fields: Record<string, FieldConfig>;
  /** Theme setting */
  theme: 'light' | 'dark';
  /** Orientation setting */
  orientation: string;
  /** Submit handler function */
  onSubmit?: (payload: SubmitPayload) => void;
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
  
  // Methods
  _handleInput: (event: Event) => void;
  _handleToggle: (event: Event) => void;
  _handleChoice: (event: Event) => void;
  _handleRating: (event: Event) => void;
  _handleTabChange: (event: Event, tabName: string) => void;
  _handleSubmit: (event: Event) => void;
  _checkForChanges: (fieldName: string, newValue: any) => void;
  propKeys: (fieldName: string) => PropKeys;
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
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * Form change event
 */
export interface FormChangeEvent extends CustomEvent {
  detail: ChangePayload;
}

/**
 * Tab change event
 */
export interface TabChangeEvent extends CustomEvent {
  detail: {
    tabName: string;
    deForm: DeForm;
  };
}

/**
 * Form submit event
 */
export interface FormSubmitEvent extends CustomEvent {
  detail: SubmitPayload;
}

/**
 * Discard changes event
 */
export interface DiscardEvent extends CustomEvent {
  detail: {
    deForm: DeForm;
  };
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Function that can be bound to a class instance
 */
export type BindableFunction = (...args: any[]) => any;

/**
 * Map of functions that can be bound to a class
 */
export type FunctionMap = Record<string, BindableFunction>;

/**
 * Debounced function type
 */
export type DebouncedFunction<T extends (...args: any[]) => any> = T & {
  cancel: () => void;
  flush: () => void;
};

// All types are already exported above
