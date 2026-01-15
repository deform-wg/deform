import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, TextFieldConfig } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

const ifd = ifDefined;

/**
 * Renders an email input field.
 */
export function _render_email(this: DeForm, field: TextFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-input
      type="email"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      minlength=${ifd(field.minlength)}
      maxlength=${ifd(field.maxlength)}
      size=${ifd(field.size)}
      .value=${ifd(String(getDynFormValue(this, currentKey) ?? ''))}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?disabled=${field.disabled}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @input=${this._handleInput}
      >
    </sl-input>
  `;
}
