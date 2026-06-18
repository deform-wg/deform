// Main entry point for the deform package
import { ensureAllThemeStyles } from './theme/shoelace-theme.js';
import './deform.js';

// Load both theme styles so consumers only need one import.
ensureAllThemeStyles();

// Export the deform class for programmatic usage
export { deform } from './deform.js';

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
