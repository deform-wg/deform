import { css, html, ifDefined } from '../../vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

// TODO. Bug. Value is not being included in serialized form data.

export function _render_rating(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-rating
      name=${field.name}
      value=${this[currentKey]}
      label=${ifd(field.label)}
      max=${ifd(field.max)}
      precision=${ifd(field.precision)}
      ?disabled=${field.disabled}
      ?readonly=${field.readonly}
      ?data-dirty-field=${this[isDirtyKey]}
      @sl-change=${this._handleRating}>
    </sl-rating>
  `;
}
