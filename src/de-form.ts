import type { PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import * as methods from './core/index.js';
import * as renders from './renders/index.js';
import { accents, supportedAccents } from './theme/accents.js';
import {
  applyThemeClass,
  type DeformTheme,
  ensureShoelaceBasePath,
} from './theme/shoelace-theme.js';
import { styles } from './theme/styles.js';
import type {
  DeForm as DeFormInterface,
  FieldConfig,
  FormConfig,
  FormDataModel,
  FormStateModel,
  FormValue,
  PropKeys,
  SelectOption,
  ValidationRule,
} from './typedefs/index.js';
import { bindToClass } from './utils/class-bind.js';
import {
  getDynBoolean,
  getDynFormValue,
  setDynBoolean,
  setDynFormValue,
} from './utils/dynamic-props.js';
import { asyncTimeout } from './utils/timeout.js';
// Add shoelace once. Use components anywhere.
import '@shoelace-style/shoelace/dist/shoelace.js';

ensureShoelaceBasePath();

interface AccentInfo {
  name: string;
  [key: string]: string | number | boolean | null | undefined;
}

class DeForm extends LitElement {
  // Reactive properties
  declare values: FormDataModel;
  declare theme: DeformTheme;
  declare orientation: string;
  declare onSubmit:
    | ((changes: FormDataModel, form: HTMLFormElement, deform: DeFormInterface) => Promise<unknown>)
    | undefined;
  declare onChange:
    | ((
        change: Omit<import('./typedefs/index.js').ChangePayload, 'deForm'>,
        deForm: DeFormInterface,
      ) => void)
    | undefined;
  declare requireCommit: boolean;
  declare markModifiedFields: boolean;
  declare showModifiedCount: boolean;
  declare allowDiscardChanges: boolean;
  declare accent: string;
  declare _activeFormId: string | null;
  declare _initializing: boolean;
  declare _rules: ValidationRule[];
  declare _celebrate: boolean;

  // Methods bound in at runtime via bindToClass()
  declare _initializeFormFieldProperties: (newValue: FormConfig) => void;
  declare _initializeValuesPreservingEdits: (newValue: FormDataModel) => void;
  declare _dispatchEvent: (name: string, detail: Record<string, unknown>) => void;
  declare _generateOneOrManyForms: (data: FormConfig) => TemplateResult;
  declare _generateField: (field: FieldConfig) => TemplateResult | typeof import('lit').nothing;
  declare _generateErrorField: (field: FieldConfig) => TemplateResult;
  declare _generateFormControls: (options: {
    formId: string;
    submitLabel?: string;
    submitLabelSuccess?: string;
  }) => TemplateResult;
  declare _onUpdate: (changedProperties: PropertyValues) => Promise<void>;
  declare _checkForChanges: (fieldName?: string, newValue?: unknown) => void;
  declare _handleInput: (event: Event) => void;
  declare _handleToggle: (event: Event) => void;
  declare _handleChoice: (event: Event) => void;
  declare _handleRating: (event: Event) => void;
  declare _handleTabChange: (event: Event, tabName: string) => void;
  declare _handleSubmit: (event: Event) => Promise<void>;
  declare _handleDiscardChanges: (event: Event) => void;
  declare _shouldUpdateForm: (changedProperties: Map<string, unknown>) => boolean;
  declare _getTargetForm: (changedProperties: Map<string, unknown>) => HTMLFormElement | null;
  declare _updateActiveFormId: (
    form: HTMLFormElement,
    changedProperties: Map<string, unknown>,
  ) => void;
  declare _checkAndSetFieldDirtyStatus: (fieldName: string) => boolean;
  declare _checkAndSetConditionMetFlags: (
    rule: ValidationRule,
    currentState: FormStateModel,
    currentValues: FormDataModel,
  ) => void;
  declare checkValidity: (form: HTMLFormElement) => boolean;
  declare getChanges: (form: HTMLFormElement) => FormDataModel;
  declare commitChanges: (form: HTMLFormElement) => void;
  declare retainChanges: () => void;

  // Internal state
  private _fields: FormConfig | undefined;
  private __dirty: number = 0;
  private __loading: boolean = false;
  _flattenedFields: FieldConfig[] = [];

  static override get properties() {
    return {
      values: { type: Object },
      fields: { type: Object },
      theme: { type: String },
      orientation: { type: String },
      onSubmit: { type: Object },
      requireCommit: { type: Boolean },
      markModifiedFields: { type: Boolean },
      showModifiedCount: { type: Boolean },
      allowDiscardChanges: { type: Boolean },
      accent: { type: String, reflect: true },
      _activeFormId: { type: String, state: true },
      _dirty: { type: Number, state: true },
      _initializing: { type: Boolean },
      _loading: { type: Boolean, state: true },

      _rules: { type: Object, state: true },
      _celebrate: { type: Boolean },
    };
  }

  static override get styles() {
    return [styles, accents];
  }

  constructor() {
    super();

    bindToClass(methods, this);
    bindToClass(renders, this);
    this.values = {};
    this.theme = 'dark';
    this.orientation = '';
    this.accent = 'sky';
    this.requireCommit = false;
    this.markModifiedFields = false;
    this.showModifiedCount = false;
    this.allowDiscardChanges = false;
    this._activeFormId = null;
    this._initializing = false;
    this._celebrate = false;

    this._rules = [];
    this._flattenedFields = [];
    // Add the theme class to the host element immediately.
    this._updateThemeStylesheet(this.theme);
  }

  private _updateThemeStylesheet(newTheme: DeformTheme): void {
    applyThemeClass(newTheme, this);
  }

  set fields(newValue: FormConfig | undefined) {
    this._fields = newValue;
    if (!newValue?.sections) return;

    if (newValue.theme) {
      this.theme = newValue.theme;
    }
    if (newValue.orientation) {
      this.orientation = newValue.orientation;
    }
    if (newValue.accent) {
      this.accent = newValue.accent;
    }
    if (typeof newValue.requireCommit === 'boolean') {
      this.requireCommit = newValue.requireCommit;
    }
    if (typeof newValue.markModifiedFields === 'boolean') {
      this.markModifiedFields = newValue.markModifiedFields;
    }
    if (typeof newValue.showModifiedCount === 'boolean') {
      this.showModifiedCount = newValue.showModifiedCount;
    }
    if (typeof newValue.allowDiscardChanges === 'boolean') {
      this.allowDiscardChanges = newValue.allowDiscardChanges;
    }

    // Create a reactive property for every form field.
    this._initializeFormFieldProperties(newValue);
  }

  get fields(): FormConfig | undefined {
    return this._fields;
  }

  set _dirty(value: number) {
    // Adjust only if incoming value differs, also emit change event.
    if (this.__dirty !== value) {
      this.__dirty = value;
      this._dispatchEvent('dirty-change', { dirty: this._dirty });
    }
  }

  get _dirty(): number {
    return this.__dirty;
  }

  set _loading(value: boolean) {
    // Adjust only if incoming value differs, also emit change event.
    if (this.__loading !== value) {
      this.__loading = value;
      this._dispatchEvent('loading-change', { loading: this._loading });
    }
  }

  get _loading(): boolean {
    return this.__loading;
  }

  toggleLoader(): void {
    this._initializing = !this._initializing;
  }

  toggleCelebrate(): void {
    // Not an async function
    this._celebrate = true;
    setTimeout(() => {
      this._celebrate = false;
    }, 1500);
  }

  toggleLabelLoader(fieldName: string): void {
    const { labelKey } = this.propKeys(fieldName);
    setDynBoolean(this, labelKey, !getDynBoolean(this, labelKey));
    this.requestUpdate();
  }

  getFormValues = (): FormDataModel => {
    // Purpose of this method is to return the values of the form
    // In a key/val structure, where key is the field name, val is the field value.
    // eg. { colour: '#0000FF' }
    const out: FormDataModel = {};
    this._flattenedFields.forEach((field) => {
      out[field.name] = getDynFormValue(this, `_${field.name}`);
    });
    return out;
  };

  getState = (): FormStateModel => {
    // Extending getFormValues, this does the same except for any field that has
    // an options property, it will supply the selected option object as the value.
    // eg. { colour: { value: '#0000FF', label: 'Blue', primary: true } }
    const out: FormStateModel = {};
    this._flattenedFields.forEach((field) => {
      if ('options' in field && field.options) {
        const raw = getDynFormValue(this, `_${field.name}`);
        if (typeof raw === 'string' || typeof raw === 'number') {
          out[field.name] = field.options.find((option: SelectOption) => option.value === raw);
        } else {
          out[field.name] = undefined;
        }
      } else {
        const v = getDynFormValue(this, `_${field.name}`);
        out[field.name] = v;
      }
    });
    return out;
  };

  getAccents(): { accents: AccentInfo[]; current: AccentInfo | undefined } {
    return {
      accents: supportedAccents,
      current: supportedAccents.find((a) => a.name === this.accent),
    };
  }

  setValue(fieldName: string, newValue: FormValue): void {
    const { currentKey } = this.propKeys(fieldName);
    setDynFormValue(this, currentKey, newValue);
    this._checkForChanges();
  }

  propKeys(fieldName: string): PropKeys {
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

  override async firstUpdated(): Promise<void> {
    await asyncTimeout(100);
    const form = this.shadowRoot?.querySelector('form');
    if (form) {
      this._activeFormId = form.id;
    }
    this._checkForChanges();
  }

  override render() {
    if (!this?.fields?.sections || this._initializing) {
      return html`<div class="loader-overlay">
        <sl-spinner style="font-size: 2rem; --indicator-color: #bbb;"></sl-spinner>
      </div>`;
    }

    return html`
      <div class="dynamic-form-wrapper">
        ${this._generateOneOrManyForms(this.fields)}
      </div>
    `;
  }

  override async updated(changedProperties: PropertyValues): Promise<void> {
    if (changedProperties.has('theme')) {
      this._updateThemeStylesheet(this.theme);
    }
    await this._onUpdate(changedProperties);
  }
}

customElements.define('de-form', DeForm);

// Export the DeForm class for programmatic usage
export { DeForm };
