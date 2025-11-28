import { html, ifDefined } from '../../vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_email(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-input
      type="email"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      minlength=${ifd(field.minLength)}
      maxlength=${ifd(field.maxLength)}
      size=${ifd(field.size)}
      .value=${ifd(this[currentKey] || "")}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?disabled=${field.disabled}
      ?data-dirty-field=${this[isDirtyKey]}
      @input=${this.handleInput}
      >
    </sl-input>
  `;
}