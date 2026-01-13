import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, TextFieldConfig } from '../../typedefs/index.js';

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
      .value=${ifd((this as any)[currentKey] || "")}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?disabled=${(field as any).disabled}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @input=${this._handleInput}
      >
    </sl-input>
  `;
}
