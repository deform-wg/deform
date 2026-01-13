import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, RadioButtonFieldConfig, SelectOption } from '../../typedefs/index.js';

const ifd = ifDefined;

/**
 * Renders a radio button group field.
 */
export function _render_radioButton(this: DeForm, field: RadioButtonFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-radio-group
      label=${ifd(field.label)}
      help-text=${ifd(field.help)}
      name=${field.name}
      size=${ifd((field as any).size)}
      .value=${(this as any)[currentKey]}
      ?disabled=${(field as any).disabled}
      ?required=${field.required}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @sl-change=${this._handleChoice}
    >
      ${field.options.map(
        (option: SelectOption) => html`
          <sl-radio-button
            value=${option.value}
            ?checked=${(option as any).checked}
            ?disabled=${option.disabled}
          >
            ${option.label}
          </sl-radio-button>
        `
      )}
    </sl-radio-group>
  `;
}
