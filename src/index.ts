// Main entry point for the deform package
import { ensureAllThemeStyles } from './theme/shoelace-theme.js';
import './de-form.js';

// Load both theme styles so consumers only need one import.
ensureAllThemeStyles();

// Export the DeForm class for programmatic usage
export { DeForm } from './de-form.js';

// Export types for consumers
export type {
  BaseFieldConfig,
  ChangePayload,
  CheckboxFieldConfig,
  ColorFieldConfig,
  DateFieldConfig,
  FieldConfig,
  FormConfig,
  FormDataModel,
  FormSection,
  LabelAction,
  PropKeys,
  RadioButtonFieldConfig,
  RadioFieldConfig,
  RangeFieldConfig,
  RatingFieldConfig,
  RenderOptions,
  RevealFunction,
  RevealOn,
  RevealOperator,
  RevealTuple,
  SeedphraseFieldConfig,
  SelectFieldConfig,
  SelectOption,
  SubmitPayload,
  TextareaFieldConfig,
  TextFieldConfig,
  ToggleConfig,
  ToggleFieldConfig,
  ValidationRule,
} from './typedefs/index.js';
