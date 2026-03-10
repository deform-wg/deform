import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, TextareaFieldConfig } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

const ifd = ifDefined;

/**
 * Renders a textarea field.
 */
export function _render_textarea(this: DeForm, field: TextareaFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-textarea
      name=${field.name}
      .value=${ifd(String(getDynFormValue(this, currentKey) ?? ''))}
      size=${ifd(field.size)}
      ?filled=${field.filled}
      label=${ifd(field.label)}
      help-text=${ifd(field.help)}
      placeholder=${ifd(field.placeholder)}
      rows=${ifd(field.rows)}
      resize=${ifd(field.resize)}
      ?disabled=${field.disabled}
      ?readonly=${field.readonly}
      ?required=${field.required}
      minlength=${ifd(field.minlength)}
      maxlength=${ifd(field.maxlength)}
      autocapitalize=${ifd(field.autocapitalize)}
      autocorrect=${ifd(field.autocorrect)}
      autocomplete=${ifd(field.autocomplete)}
      ?autofocus=${field.autofocus}
      enterkeyhint=${ifd(field.enterkeyhint)}
      ?spellcheck=${field.spellcheck}
      inputmode=${ifd(field.inputmode)}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @input=${this._handleInput}
    ></sl-textarea>
  `;
}
