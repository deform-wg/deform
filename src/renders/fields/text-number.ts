import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, TextFieldConfig } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

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
      min=${ifd(field.min)}
      max=${ifd(field.max)}
      step=${ifd(field.step)}
      size=${ifd(field.size)}
      .value=${ifd(String(getDynFormValue(this, currentKey) ?? ''))}
      ?clearable=${field.clearable}
      ?noSpinButtons=${field.noSpinButtons}
      ?autofocus=${field.autofocus}
      ?required=${field.required}
      ?disabled=${field.disabled}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @input=${this._handleInput}
      >
    </sl-input>
  `;
}
