import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { DeForm, CheckboxFieldConfig } from '../../typedefs/index.js';

/**
 * Renders a checkbox field.
 */
export function _render_checkbox(this: DeForm, field: CheckboxFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`<sl-checkbox
    name=${field.name}
    ?checked=${(this as any)[currentKey]}
    .value=${(this as any)[currentKey]}
    ?disabled=${(field as any).disabled}
    ?indeterminate=${(field as any).indeterminate}
    ?required=${field.required}
    ?data-dirty-field=${(this as any)[isDirtyKey]}
    @sl-change=${this._handleToggle}>
    ${field.label}
  </sl-checkbox>
  `;
}
