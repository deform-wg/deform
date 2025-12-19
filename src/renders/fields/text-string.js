import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

const ifd = ifDefined

export function _render_text(field, options) {
  const { currentKey, originalKey, isDirtyKey } = this.propKeys(field.name);

  return html`
    <sl-input
      type="text"
      name=${field.name}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      minlength=${ifd(field.minlength)}
      maxlength=${ifd(field.maxlength)}
      pattern=${ifd(field.pattern)}
      size=${ifd(field.size)}
      .value=${ifd(this[currentKey] || "")}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?data-dirty-field=${this[isDirtyKey]}
      @input=${this._handleInput}
      >
      ${options.labelEl}
    </sl-input>
  `;
} 

