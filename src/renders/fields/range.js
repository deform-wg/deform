import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

const ifd = ifDefined

export function _render_range(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-range
      name=${field.name}
      label=${ifd(field.label)}
      .value=${ifd(this[currentKey])}
      min=${ifd(field.min)}
      max=${ifd(field.max)}
      step=${ifd(field.step)}
      ?disabled=${field.disabled}
      ?showTooltip=${field.showTooltip}
      ?data-dirty-field=${this[isDirtyKey]}
      @sl-change=${this._handleChoice}>
    </sl-range>
  `;
}

// TODO: Works with numbers. Change tracking struggles with strings.