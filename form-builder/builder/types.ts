import type { FieldConfig } from '../../src/typedefs/index.js';

export type SelectedField = { sectionIndex: number; fieldIndex: number };

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'radioButton'
  | 'toggle'
  | 'toggleField'
  | 'range'
  | 'rating'
  | 'date'
  | 'color'
  | 'seedphrase';

export interface FieldTypeOption {
  type: FieldType;
  label: string;
  icon: string;
}

export interface FieldDefinition {
  type: FieldType;
  label: string;
  icon: string;
  settings: FieldConfig[];
}

export type ImportSummary = {
  status: 'success' | 'error';
  message: string;
  warnings: string[];
  errors: string[];
};
