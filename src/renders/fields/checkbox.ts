import type { TemplateResult } from 'lit';
import { html } from 'lit';
import type { CheckboxFieldConfig, DeForm } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

/**
 * Renders a checkbox field.
 */
export function _render_checkbox(this: DeForm, field: CheckboxFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`<sl-checkbox
    name=${field.name}
    ?checked=${getDynFormValue(this, currentKey) === true}
    .value=${getDynFormValue(this, currentKey)}
    ?disabled=${field.disabled}
    ?indeterminate=${field.indeterminate}
    ?required=${field.required}
    ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
    @sl-change=${this._handleToggle}>
    ${field.label}
  </sl-checkbox>
  `;
}
