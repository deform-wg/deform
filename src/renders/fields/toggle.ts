import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, ToggleConfig } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

const ifd = ifDefined;

/**
 * Renders a toggle/switch field.
 */
export function _render_toggle(this: DeForm, field: ToggleConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-switch
      name=${field.name}
      ?checked=${getDynFormValue(this, currentKey) === true}
      .value=${getDynFormValue(this, currentKey)}
      ?disabled=${field.disabled}
      ?required=${field.required}
      size=${ifd(field.size)}
      help-text=${ifd(field.help)}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @sl-change=${this._handleToggle}>
      ${field.label}
    </sl-switch>
  `;
}
