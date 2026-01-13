import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, ToggleFieldConfig } from '../../typedefs/index.js';

const ifd = ifDefined;

/**
 * Renders a toggle/switch field.
 */
export function _render_toggle(this: DeForm, field: ToggleFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-switch
      name=${field.name}
      ?checked=${(this as any)[currentKey]}
      .value=${(this as any)[currentKey]}
      ?disabled=${(field as any).disabled}
      ?required=${field.required}
      size=${ifd((field as any).size)}
      help-text=${ifd(field.help)}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @sl-change=${this._handleToggle}>
      ${field.label}
    </sl-switch>
  `;
}
