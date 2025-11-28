import { html } from '../../vendor/@lit/all@3.1.2/lit-all.min.js';

export function _render_checkbox(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`<sl-checkbox
    name=${field.name}
    ?checked=${this[currentKey]}
    .value=${this[currentKey]}
    ?disabled=${field.disabled}
    ?indeterminate=${field.indeterminate}
    ?required=${field.required}
    ?data-dirty-field=${this[isDirtyKey]}
    @sl-change=${this._handleToggle}>
    ${field.label}
  </sl-checkbox>
  `;
}