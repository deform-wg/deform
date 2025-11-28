import { html, ifDefined } from '../../vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_textarea(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-textarea
      name=${field.name}
      .value=${ifd(this[currentKey] || "")}
      size=${ifd(field.size)}
      ?filled=${field.filled}
      label=${ifd(field.label)}
      help-text=${ifd(field.help)}
      placeholder=${ifd(field.placeholder)}
      rows=${ifd(field.rows)}
      resize=${ifd(field.resize)}
      ?disabled=${field.disabled}
      ?readonly=${field.readonly}
      ?required=${field.required}
      minlength=${ifd(field.minlength)}
      maxlength=${ifd(field.maxlength)}
      autocapitalize=${ifd(field.autocapitalize)}
      autocorrect=${ifd(field.autocorrect)}
      autocomplete=${ifd(field.autocomplete)}
      ?autofocus=${field.autofocus}
      enterkeyhint=${ifd(field.enterkeyhint)}
      ?spellcheck=${field.spellcheck}
      inputmode=${ifd(field.inputmode)}
      ?data-dirty-field=${this[isDirtyKey]}
      @input=${this._handleInput}
    ></sl-textarea>
  `;
}
