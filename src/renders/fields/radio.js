import { html, ifDefined } from '../../vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_radio(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-radio-group
      name=${field.name}
      label=${ifd(field.label)}
      help-text=${ifd(field.help)}
      size=${ifd(field.size)}
      .value=${this[currentKey]}
      ?data-dirty-field=${this[isDirtyKey]}
      @sl-change=${this._handleChoice}
    >
      ${field.options.map(option => html`
        <sl-radio
          value=${option.value}
          ?checked=${option.checked}
          ?disabled=${option.disabled}>
          ${option.label}
        </sl-radio>
      `)}
    </sl-radio-group>
  `;
}
