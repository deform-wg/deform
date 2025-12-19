import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

const ifd = ifDefined

export function _render_toggle(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-switch
      name=${field.name}
      ?checked=${this[currentKey]}
      .value=${this[currentKey]}
      ?disabled=${field.disabled}
      ?required=${field.required}
      size=${ifd(field.size)}
      help-text=${ifd(field.helpText)}
      ?data-dirty-field=${this[isDirtyKey]}
      @sl-change=${this._handleToggle}>
      ${field.label}
    </sl-switch>
  `;
}