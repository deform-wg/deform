import type { FieldConfig, FormConfig, FormValue } from '../../src/typedefs/index.js';
import type { FieldDefinition, FieldType, FieldTypeOption } from './types.js';
import { stringifyRevealOn, suggestKey } from './utils.js';

const BASE_FIELD_SETTINGS: FieldConfig[] = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'name', type: 'text', label: 'Field Name', required: true },
  { name: 'help', type: 'text', label: 'Help Text' },
  { name: 'placeholder', type: 'text', label: 'Placeholder' },
  { name: 'required', type: 'toggle', label: 'Required' },
  { name: 'disabled', type: 'toggle', label: 'Disabled' },
  { name: 'hidden', type: 'toggle', label: 'Hidden' },
  { name: 'breakline', type: 'toggle', label: 'Break Line' },
  {
    name: 'size',
    type: 'select',
    label: 'Size',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
    ],
  },
  { name: 'value', type: 'text', label: 'Default Value' },
  { name: 'labelActionName', type: 'text', label: 'Label Action Name' },
  { name: 'labelActionLabel', type: 'text', label: 'Label Action Label' },
  {
    name: 'revealOnRaw',
    type: 'textarea',
    label: 'Reveal On (JSON)',
    help: 'Use JSON array: ["targetField", "=", "value"]',
  },
];

const TEXT_SETTINGS: FieldConfig[] = [
  { name: 'minlength', type: 'number', label: 'Min Length' },
  { name: 'maxlength', type: 'number', label: 'Max Length' },
  { name: 'pattern', type: 'text', label: 'Pattern' },
  { name: 'clearable', type: 'toggle', label: 'Clearable' },
  { name: 'requireConfirmation', type: 'toggle', label: 'Require Confirmation' },
  { name: 'passwordToggle', type: 'toggle', label: 'Password Toggle' },
  { name: 'noSpinButtons', type: 'toggle', label: 'No Spin Buttons' },
  { name: 'autofocus', type: 'toggle', label: 'Autofocus' },
];

const NUMBER_SETTINGS: FieldConfig[] = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'step', type: 'number', label: 'Step' },
];

const TEXTAREA_SETTINGS: FieldConfig[] = [
  { name: 'minlength', type: 'number', label: 'Min Length' },
  { name: 'maxlength', type: 'number', label: 'Max Length' },
  { name: 'rows', type: 'number', label: 'Rows' },
  { name: 'filled', type: 'toggle', label: 'Filled' },
  { name: 'resize', type: 'text', label: 'Resize' },
  { name: 'readonly', type: 'toggle', label: 'Read Only' },
  { name: 'autocapitalize', type: 'text', label: 'Autocapitalize' },
  { name: 'autocorrect', type: 'text', label: 'Autocorrect' },
  { name: 'autocomplete', type: 'text', label: 'Autocomplete' },
  { name: 'autofocus', type: 'toggle', label: 'Autofocus' },
  { name: 'enterkeyhint', type: 'text', label: 'Enter Key Hint' },
  { name: 'spellcheck', type: 'toggle', label: 'Spellcheck' },
  { name: 'inputmode', type: 'text', label: 'Input Mode' },
];

const SEEDPHRASE_SETTINGS: FieldConfig[] = [
  ...TEXTAREA_SETTINGS,
  { name: 'words', type: 'number', label: 'Words' },
];

const SELECT_SETTINGS: FieldConfig[] = [
  {
    name: 'optionsRaw',
    type: 'textarea',
    label: 'Options (value:label)',
    help: 'One option per line. Example: us:United States',
  },
  { name: 'multiple', type: 'toggle', label: 'Multiple' },
  { name: 'clearable', type: 'toggle', label: 'Clearable' },
  { name: 'maxOptionsVisible', type: 'number', label: 'Max Options Visible' },
  { name: 'hoist', type: 'toggle', label: 'Hoist' },
];

const RADIO_SETTINGS: FieldConfig[] = [
  {
    name: 'optionsRaw',
    type: 'textarea',
    label: 'Options (value:label)',
    help: 'One option per line. Example: us:United States',
  },
];

const CHECKBOX_SETTINGS: FieldConfig[] = [
  { name: 'defaultTo', type: 'toggle', label: 'Default Checked' },
  { name: 'indeterminate', type: 'toggle', label: 'Indeterminate' },
];

const TOGGLE_SETTINGS: FieldConfig[] = [{ name: 'defaultTo', type: 'toggle', label: 'Default On' }];

const TOGGLE_FIELD_SETTINGS: FieldConfig[] = [
  { name: 'defaultTo', type: 'number', label: 'Default Variant (0 or 1)' },
  {
    name: 'toggleLabels',
    type: 'textarea',
    label: 'Toggle Labels',
    help: 'One label per line.',
  },
];

const RANGE_SETTINGS: FieldConfig[] = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'step', type: 'number', label: 'Step' },
  { name: 'showTooltip', type: 'toggle', label: 'Show Tooltip' },
];

const RATING_SETTINGS: FieldConfig[] = [
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'precision', type: 'number', label: 'Precision' },
  { name: 'readonly', type: 'toggle', label: 'Read Only' },
];

const DATE_SETTINGS: FieldConfig[] = [
  { name: 'min', type: 'text', label: 'Min Date' },
  { name: 'max', type: 'text', label: 'Max Date' },
  { name: 'clearable', type: 'toggle', label: 'Clearable' },
];

const COLOR_SETTINGS: FieldConfig[] = [
  { name: 'defaultTo', type: 'text', label: 'Default Color' },
  { name: 'inline', type: 'toggle', label: 'Inline' },
  { name: 'opacity', type: 'toggle', label: 'Opacity' },
  { name: 'noFormatToggle', type: 'toggle', label: 'No Format Toggle' },
  { name: 'uppercase', type: 'toggle', label: 'Uppercase' },
  { name: 'format', type: 'text', label: 'Format' },
  { name: 'swatches', type: 'text', label: 'Swatches' },
];

export const FIELD_DEFINITIONS: Record<FieldType, FieldDefinition> = {
  text: { type: 'text', label: 'Text', icon: 'type', settings: TEXT_SETTINGS },
  email: { type: 'email', label: 'Email', icon: 'envelope', settings: TEXT_SETTINGS },
  password: { type: 'password', label: 'Password', icon: 'lock', settings: TEXT_SETTINGS },
  number: { type: 'number', label: 'Number', icon: '123', settings: NUMBER_SETTINGS },
  textarea: { type: 'textarea', label: 'Textarea', icon: 'justify', settings: TEXTAREA_SETTINGS },
  select: { type: 'select', label: 'Select', icon: 'list-ul', settings: SELECT_SETTINGS },
  checkbox: {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'check-square',
    settings: CHECKBOX_SETTINGS,
  },
  radio: { type: 'radio', label: 'Radio Group', icon: 'ui-radios', settings: RADIO_SETTINGS },
  radioButton: {
    type: 'radioButton',
    label: 'Radio Button',
    icon: 'circle',
    settings: RADIO_SETTINGS,
  },
  toggle: { type: 'toggle', label: 'Toggle', icon: 'toggle-on', settings: TOGGLE_SETTINGS },
  toggleField: {
    type: 'toggleField',
    label: 'Toggle Field',
    icon: 'shuffle',
    settings: TOGGLE_FIELD_SETTINGS,
  },
  range: { type: 'range', label: 'Range', icon: 'sliders', settings: RANGE_SETTINGS },
  rating: { type: 'rating', label: 'Rating', icon: 'star', settings: RATING_SETTINGS },
  date: { type: 'date', label: 'Date', icon: 'calendar', settings: DATE_SETTINGS },
  color: { type: 'color', label: 'Color', icon: 'palette', settings: COLOR_SETTINGS },
  seedphrase: {
    type: 'seedphrase',
    label: 'Seedphrase',
    icon: 'key',
    settings: SEEDPHRASE_SETTINGS,
  },
};

const FIELD_TYPE_ORDER: FieldType[] = [
  'text',
  'email',
  'password',
  'number',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'radioButton',
  'toggle',
  'toggleField',
  'range',
  'rating',
  'date',
  'color',
  'seedphrase',
];

const FIELD_TYPE_SET = new Set<string>(FIELD_TYPE_ORDER);

export function isFieldType(value: string): value is FieldType {
  return FIELD_TYPE_SET.has(value);
}

export const FIELD_TYPE_OPTIONS: FieldTypeOption[] = FIELD_TYPE_ORDER.map((type) => {
  const definition = FIELD_DEFINITIONS[type];
  return {
    type: definition.type,
    label: definition.label,
    icon: definition.icon,
  };
});

export function getFieldSettingsFields(field: FieldConfig): FieldConfig[] {
  const definition = isFieldType(field.type) ? FIELD_DEFINITIONS[field.type] : undefined;
  if (!definition) return [...BASE_FIELD_SETTINGS];
  return [...BASE_FIELD_SETTINGS, ...definition.settings];
}

export function buildFieldSettingsValues(field: FieldConfig): Record<string, FormValue> {
  const labelActionName = field.labelAction?.name ?? '';
  const labelActionLabel = field.labelAction?.label ?? '';
  const baseValues: Record<string, FormValue> = {
    label: field.label ?? '',
    name: field.name,
    help: field.help ?? '',
    placeholder: field.placeholder ?? '',
    required: field.required ?? false,
    disabled: field.disabled ?? false,
    hidden: field.hidden ?? false,
    breakline: field.breakline ?? false,
    size: field.size ?? 'medium',
    value: field.value ?? '',
    labelActionName,
    labelActionLabel,
    revealOnRaw: stringifyRevealOn(field.revealOn),
  };

  if ('minlength' in field && field.minlength !== undefined) {
    baseValues.minlength = field.minlength;
  }
  if ('maxlength' in field && field.maxlength !== undefined) {
    baseValues.maxlength = field.maxlength;
  }
  if ('pattern' in field && field.pattern !== undefined) {
    baseValues.pattern = field.pattern;
  }
  if ('clearable' in field && field.clearable !== undefined) {
    baseValues.clearable = field.clearable;
  }
  if ('requireConfirmation' in field && field.requireConfirmation !== undefined) {
    baseValues.requireConfirmation = field.requireConfirmation;
  }
  if ('passwordToggle' in field && field.passwordToggle !== undefined) {
    baseValues.passwordToggle = field.passwordToggle;
  }
  if ('noSpinButtons' in field && field.noSpinButtons !== undefined) {
    baseValues.noSpinButtons = field.noSpinButtons;
  }
  if ('autofocus' in field && field.autofocus !== undefined) {
    baseValues.autofocus = field.autofocus;
  }
  if ('min' in field && field.min !== undefined) {
    baseValues.min = field.min;
  }
  if ('max' in field && field.max !== undefined) {
    baseValues.max = field.max;
  }
  if ('step' in field && field.step !== undefined) {
    baseValues.step = field.step;
  }
  if ('rows' in field && field.rows !== undefined) {
    baseValues.rows = field.rows;
  }
  if ('filled' in field && field.filled !== undefined) {
    baseValues.filled = field.filled;
  }
  if ('resize' in field && field.resize !== undefined) {
    baseValues.resize = field.resize;
  }
  if ('readonly' in field && field.readonly !== undefined) {
    baseValues.readonly = field.readonly;
  }
  if ('autocapitalize' in field && field.autocapitalize !== undefined) {
    baseValues.autocapitalize = field.autocapitalize;
  }
  if ('autocorrect' in field && field.autocorrect !== undefined) {
    baseValues.autocorrect = field.autocorrect;
  }
  if ('autocomplete' in field && field.autocomplete !== undefined) {
    baseValues.autocomplete = field.autocomplete;
  }
  if ('enterkeyhint' in field && field.enterkeyhint !== undefined) {
    baseValues.enterkeyhint = field.enterkeyhint;
  }
  if ('spellcheck' in field && field.spellcheck !== undefined) {
    baseValues.spellcheck = field.spellcheck;
  }
  if ('inputmode' in field && field.inputmode !== undefined) {
    baseValues.inputmode = field.inputmode;
  }
  if ('words' in field && field.words !== undefined) {
    baseValues.words = field.words;
  }
  if ('multiple' in field && field.multiple !== undefined) {
    baseValues.multiple = field.multiple;
  }
  if ('maxOptionsVisible' in field && field.maxOptionsVisible !== undefined) {
    baseValues.maxOptionsVisible = field.maxOptionsVisible;
  }
  if ('hoist' in field && field.hoist !== undefined) {
    baseValues.hoist = field.hoist;
  }
  if ('indeterminate' in field && field.indeterminate !== undefined) {
    baseValues.indeterminate = field.indeterminate;
  }
  if ('showTooltip' in field && field.showTooltip !== undefined) {
    baseValues.showTooltip = field.showTooltip;
  }
  if ('precision' in field && field.precision !== undefined) {
    baseValues.precision = field.precision;
  }
  if ('defaultTo' in field && field.defaultTo !== undefined) {
    baseValues.defaultTo = field.defaultTo;
  }
  if ('inline' in field && field.inline !== undefined) {
    baseValues.inline = field.inline;
  }
  if ('opacity' in field && field.opacity !== undefined) {
    baseValues.opacity = field.opacity;
  }
  if ('noFormatToggle' in field && field.noFormatToggle !== undefined) {
    baseValues.noFormatToggle = field.noFormatToggle;
  }
  if ('uppercase' in field && field.uppercase !== undefined) {
    baseValues.uppercase = field.uppercase;
  }
  if ('format' in field && field.format !== undefined) {
    baseValues.format = field.format;
  }
  if ('swatches' in field && field.swatches !== undefined) {
    baseValues.swatches = field.swatches;
  }

  if (field.type === 'select' || field.type === 'radio' || field.type === 'radioButton') {
    baseValues.optionsRaw = (field.options ?? [])
      .map((option) => `${option.value}:${option.label}`)
      .join('\n');
  }

  if (field.type === 'toggleField') {
    baseValues.defaultTo = field.defaultTo ?? 0;
    baseValues.toggleLabels = field.labels?.join('\n') ?? '';
  }

  return baseValues;
}

const FORM_KEYS = [
  'sections',
  'theme',
  'orientation',
  'accent',
  'requireCommit',
  'markModifiedFields',
  'showModifiedCount',
  'allowDiscardChanges',
];

const SECTION_KEYS = ['name', 'fields', 'submitLabel', 'submitLabelSuccess'];

const BASE_FIELD_KEYS = [
  'name',
  'type',
  'label',
  'help',
  'required',
  'disabled',
  'hidden',
  'breakline',
  'placeholder',
  'size',
  'value',
  'revealOn',
  'labelAction',
];

const TYPE_KEYS: Record<string, string[]> = {
  text: [
    'minlength',
    'maxlength',
    'pattern',
    'clearable',
    'requireConfirmation',
    'passwordToggle',
    'min',
    'max',
    'step',
    'noSpinButtons',
    'autofocus',
  ],
  email: [
    'minlength',
    'maxlength',
    'pattern',
    'clearable',
    'requireConfirmation',
    'passwordToggle',
    'min',
    'max',
    'step',
    'noSpinButtons',
    'autofocus',
  ],
  password: [
    'minlength',
    'maxlength',
    'pattern',
    'clearable',
    'requireConfirmation',
    'passwordToggle',
    'min',
    'max',
    'step',
    'noSpinButtons',
    'autofocus',
  ],
  number: ['min', 'max', 'step', 'noSpinButtons', 'autofocus'],
  textarea: [
    'minlength',
    'maxlength',
    'rows',
    'filled',
    'resize',
    'readonly',
    'autocapitalize',
    'autocorrect',
    'autocomplete',
    'autofocus',
    'enterkeyhint',
    'spellcheck',
    'inputmode',
  ],
  seedphrase: [
    'words',
    'minlength',
    'maxlength',
    'rows',
    'filled',
    'resize',
    'readonly',
    'autocapitalize',
    'autocorrect',
    'autocomplete',
    'autofocus',
    'enterkeyhint',
    'spellcheck',
    'inputmode',
  ],
  select: ['options', 'multiple', 'clearable', 'maxOptionsVisible', 'hoist'],
  radio: ['options'],
  radioButton: ['options'],
  checkbox: ['defaultTo', 'indeterminate'],
  toggle: ['defaultTo'],
  toggleField: ['defaultTo', 'fields', 'labels'],
  range: ['min', 'max', 'step', 'showTooltip'],
  rating: ['max', 'precision', 'readonly'],
  date: ['min', 'max', 'clearable'],
  color: ['defaultTo', 'inline', 'opacity', 'noFormatToggle', 'uppercase', 'format', 'swatches'],
};

export function collectConfigWarnings(config: FormConfig): string[] {
  const warnings: string[] = [];
  const formUnknown = Object.keys(config).filter((key) => !FORM_KEYS.includes(key));
  if (formUnknown.length) {
    warnings.push(`Form config has unknown keys: ${formUnknown.join(', ')}`);
  }

  config.sections.forEach((section, sectionIndex) => {
    const sectionUnknown = Object.keys(section).filter((key) => !SECTION_KEYS.includes(key));
    if (sectionUnknown.length) {
      warnings.push(
        `Section "${section.name ?? `#${sectionIndex + 1}`}" has unknown keys: ${sectionUnknown.join(
          ', ',
        )}`,
      );
    }
    section.fields.forEach((field, fieldIndex) => {
      const knownKeys = [...BASE_FIELD_KEYS, ...(TYPE_KEYS[field.type] ?? [])];
      const unknownKeys = Object.keys(field).filter((key) => !knownKeys.includes(key));
      if (!unknownKeys.length) return;
      const details = unknownKeys
        .map((key) => {
          const suggestion = suggestKey(key, knownKeys);
          return suggestion ? `${key} (did you mean "${suggestion}"?)` : key;
        })
        .join(', ');
      warnings.push(`Field "${field.name ?? `#${fieldIndex + 1}`}" has unknown keys: ${details}`);
    });
  });

  return warnings;
}
