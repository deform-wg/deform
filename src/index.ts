// Main entry point for the deform package
import './de-form.js';

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
