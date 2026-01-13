// Main entry point for the deform package
import './de-form.js';

// Export the DeForm class for programmatic usage
export { DeForm } from './de-form.js';

// Export types for consumers
export type {
  FormConfig,
  FormSection,
  FieldConfig,
  BaseFieldConfig,
  TextFieldConfig,
  SelectFieldConfig,
  RadioFieldConfig,
  RadioButtonFieldConfig,
  CheckboxFieldConfig,
  ToggleFieldConfig,
  RangeFieldConfig,
  RatingFieldConfig,
  DateFieldConfig,
  ColorFieldConfig,
  TextareaFieldConfig,
  SeedphraseFieldConfig,
  SelectOption,
  LabelAction,
  ValidationRule,
  FormDataModel,
  ChangePayload,
  SubmitPayload,
  RenderOptions,
  PropKeys,
} from './typedefs/index.js';
