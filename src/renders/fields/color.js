import { html, ifDefined } from '../../vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_color (field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-color-picker
      name=${field.name}
      .value=${this[currentKey]}
      ?disabled=${field.disabled}
      ?inline=${field.inline}
      ?opacity=${field.opacity}
      ?noFormatToggle=${field.opacity}
      ?uppercase=${field.uppercase}
      format=${ifd(field.format)}
      swatches=${ifd(field.swatches)}
      size=${ifd(field.size)}
      ?data-dirty-field=${this[isDirtyKey]}
      @sl-change=${this._handleChoice}>
    </sl-color-picker>
  `;
}
