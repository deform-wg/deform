import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, RadioFieldConfig, SelectOption } from '../../typedefs/index.js';

const ifd = ifDefined;

/**
 * Renders a radio group field.
 */
export function _render_radio(this: DeForm, field: RadioFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-radio-group
      name=${field.name}
      label=${ifd(field.label)}
      help-text=${ifd(field.help)}
      size=${ifd((field as any).size)}
      .value=${(this as any)[currentKey]}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @sl-change=${this._handleChoice}
    >
      ${field.options.map((option: SelectOption) => html`
        <sl-radio
          value=${option.value}
          ?checked=${(option as any).checked}
          ?disabled=${option.disabled}>
          ${option.label}
        </sl-radio>
      `)}
    </sl-radio-group>
  `;
}
