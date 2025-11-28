import { LitElement, html, classMap, css } from "./vendor/@lit/all@3.1.2/lit-all.min.js";
import * as methods from './core/index.js';
import * as renders from './renders/index.js';
import { bindToClass } from "./utils/class-bind.js";
import { styles } from "./theme/styles.js";
import { accents, supportedAccents } from "./theme/accents.js";
import { onceThenDebounce } from "./utils/debounce.js";
import { asyncTimeout } from "./utils/timeout.ts";

// Add shoelace once. Use components anywhere.
import { setBasePath } from "./vendor/@shoelace/cdn@2.19.1/utilities/base-path.js";
import "./vendor/@shoelace/cdn@2.19.1/shoelace.js";
setBasePath("./vendor/@shoelace/cdn@2.19.1/");

class DeForm extends LitElement {
  static get properties() {
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
      _celebrate: { type: Boolean }
    };
  }

  static get styles() {
    return [styles, accents];
  }

  constructor() {
    super();
    
    bindToClass(methods, this);
    bindToClass(renders, this);
    this.values = {};
    this.fields = {};
    this.theme = "dark";
    this.orientation = "";
    this.accent = "sky";
    this.requireCommit = false;
    this.markModifiedFields = false;
    this.allowDiscardChanges = false;
    this._activeFormId = null;
    this._dirty = 0;
    this._initializing = false;
    this._loading = false;

    this._rules = [];
    this._flattenedFields = [];

    // Add the class to the host element
    this.classList.add('sl-theme-dark');
    
    // Create and append the shoelace stylesheet to shadow root
    // const linkElemLightTheme = document.createElement('link');
    // linkElemLightTheme.rel = 'stylesheet';
    // linkElemLightTheme.href = './vendor/@shoelace/cdn@2.19.1/themes/light.css';

    // const linkElemDarkTheme = document.createElement('link');
    // linkElemDarkTheme.rel = 'stylesheet';
    // linkElemDarkTheme.href = './vendor/@shoelace/cdn@2.19.1/themes/dark.css';
    
    // Store stylesheet references
    // this._lightThemeLink = document.createElement('link');
    // this._lightThemeLink.rel = 'stylesheet';
    // this._lightThemeLink.href = './vendor/@shoelace/cdn@2.19.1/themes/light.css';

    // this._darkThemeLink = document.createElement('link');
    // this._darkThemeLink.rel = 'stylesheet';
    // this._darkThemeLink.href = './vendor/@shoelace/cdn@2.19.1/themes/dark.css';
    
    // Load stylesheets immediately when shadow root is available
    this.updateComplete.then(() => {
      // Append both stylesheets immediately
      // this.shadowRoot.appendChild(linkElemLightTheme);
      // this.shadowRoot.appendChild(linkElemDarkTheme);
      
      // Then update to the correct theme
      this._updateThemeStylesheet(this.theme);
    });

  }

  _updateThemeStylesheet(newTheme) {
    if (!this.shadowRoot) return;
    
    // Remove existing theme stylesheets
    // this._lightThemeLink.remove();
    // this._darkThemeLink.remove();
    
    // Add appropriate stylesheet
    if (newTheme === 'light') {
      this.classList.remove('sl-theme-dark');
      this.classList.add('sl-theme-light');
      // this.shadowRoot.appendChild(this._lightThemeLink);
    } else {
      this.classList.remove('sl-theme-light');
      this.classList.add('sl-theme-dark');
      // this.shadowRoot.appendChild(this._darkThemeLink);
    }
  }

  set fields(newValue) {
    this._fields = newValue;
    if (!newValue.sections) return;

    // Create a reactive property for every form field.
    this._initializeFormFieldProperties(newValue);
  }

  set values(newValue) {
    if (!newValue) return;

    // When an external actor (such as a  parent component, web socket)
    // provides new values, set them but preserve unsaved edits.
    this._initializeValuesPreservingEdits(newValue);
  }

  set _dirty(value) {
    // Adjust only if incoming value differs, also emit change event.
    if (this.__dirty !== value) {
      this.__dirty = value;
      this._dispatchEvent("dirty-change", { dirty: this._dirty });
    }
  }

  set _loading(value) {
    // Adjust only if incoming value differs, also emit change event.
    if (this.__loading !== value) {
      this.__loading = value;
      this._dispatchEvent("loading-change", { loading: this._loading });
    }
  }

  get fields() {
    return this._fields;
  }

  get values() {
    return this._values;
  }

  get _dirty() {
    return this.__dirty;
  }

  get _loading() {
    return this.__loading;
  }

  toggleLoader() {
    this._initializing = !this._initializing;
  }

  toggleCelebrate() {
    // Not an async function
    this._celebrate = true;
    setTimeout(() => {
      this._celebrate = false;
    }, 1500);
  }

  toggleLabelLoader(fieldName) {
    const { labelKey } = this.propKeys(fieldName);
    this[labelKey] = !this[labelKey];
    this.requestUpdate();
  }

  getFormValues = () => {
    // Purpose of this method is to return the values of the form
    // In a key/val structure, where key is the field name, val is the field value.
    // eg. { colour: '#0000FF' }
    const out = {}
    this._flattenedFields.forEach(field => {
      out[field.name] = this[`_${field.name}`]
    });
    return out;
  }

  getState = () => {
    // Extending getFormValues, this does the same except for any field that has
    // an options property, it will supply the selected option object as the value.
    // eg. { colour: { value: '#0000FF', label: 'Blue', primary: true } }
    const out = {};
    this._flattenedFields.forEach(field => {
      out[field.name] = field.options
        ? field.options.find(option => option.value === this[`_${field.name}`])
        : this[`_${field.name}`]
    });
    return out;
  }

  getAccents() {
    return { 
      accents: supportedAccents,
      current: supportedAccents.find(a => a.name === this.accent)
    }
  }

  setValue(fieldName, newValue) {
    const { currentKey } = this.propKeys(fieldName);
    this[currentKey] = newValue;
    this._checkForChanges();
  }

  async firstUpdated() {
    await asyncTimeout(100);
    this._activeFormId = this.shadowRoot.querySelector('form').id;
    this._checkForChanges();
  }

  render() {
    if (!this?.fields?.sections || this._initializing) {
      return html`<div class="loader-overlay">
        <sl-spinner style="font-size: 2rem; --indicator-color: #bbb;"></sl-spinner>
      </div>`
    }

    return html`
      <div class="dynamic-form-wrapper">
        ${this._generateOneOrManyForms(this.fields)}
      </div>
    `;
  }

  async updated(changedProperties) {
    if (changedProperties.has('theme')) {
      this._updateThemeStylesheet(this.theme);
    }
    await this._onUpdate(changedProperties);
  }
}

customElements.define("de-form", DeForm);

// Export the DeForm class for programmatic usage
export { DeForm };
