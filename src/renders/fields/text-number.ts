import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, TextFieldConfig } from '../../typedefs/index.js';

const ifd = ifDefined;

/**
 * Renders a number input field.
 */
export function _render_number(this: DeForm, field: TextFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-input
      type="number"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      min=${ifd((field as any).min)}
      max=${ifd((field as any).max)}
      step=${ifd((field as any).step)}
      size=${ifd(field.size)}
      .value=${ifd((this as any)[currentKey] || "")}
      ?clearable=${field.clearable}
      ?noSpinButtons=${(field as any).noSpinButtons}
      ?autofocus=${(field as any).autofocus}
      ?required=${field.required}
      ?disabled=${(field as any).disabled}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @input=${this._handleInput}
      >
    </sl-input>
  `;
}
