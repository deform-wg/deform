import { html, ifDefined } from '../../vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_radioButton(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-radio-group
      label=${ifd(field.label)}
      help-text=${ifd(field.helpText)}
      name=${field.name}
      size=${ifd(field.size)}
      .value=${this[currentKey]}
      ?disabled=${field.disabled}
      ?required=${field.required}
      ?data-dirty-field=${this[isDirtyKey]}
      @sl-change=${this._handleChoice}
    >
      ${field.options.map(
        (option) => html`
          <sl-radio-button
            value=${option.value}
            ?checked=${option.checked}
            ?disabled=${option.disabled}
          >
            ${option.label}
          </sl-radio-button>
        `
      )}
    </sl-radio-group>
  `;
}