import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, RadioButtonFieldConfig, SelectOption } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

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
      size=${ifd(field.size)}
      .value=${String(getDynFormValue(this, currentKey) ?? '')}
      ?disabled=${field.disabled}
      ?required=${field.required}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @sl-change=${this._handleChoice}
    >
      ${field.options.map(
        (option: SelectOption) => html`
          <sl-radio-button
            value=${option.value}
            ?checked=${option.checked}
            ?disabled=${option.disabled}
          >
            ${option.label}
          </sl-radio-button>
        `
      )}
    </sl-radio-group>
  `;
}
