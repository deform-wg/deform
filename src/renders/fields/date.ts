import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, DateFieldConfig } from '../../typedefs/index.js';

const ifd = ifDefined;

/**
 * Renders a date input field.
 */
export function _render_date(this: DeForm, field: DateFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-input
      type="date"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      min=${ifd(field.min)}
      max=${ifd(field.max)}
      size=${ifd((field as any).size)}
      .value=${(this as any)[currentKey]}
      ?clearable=${(field as any).clearable}
      ?required=${field.required}
      ?disabled=${(field as any).disabled}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @input=${this._handleInput}
      >
    </sl-input>
  `;
}
