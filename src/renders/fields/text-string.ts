import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, TextFieldConfig } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

const ifd = ifDefined;

interface RenderOptions {
  labelEl?: TemplateResult | typeof import('lit').nothing;
}

/**
 * Renders a text input field.
 */
export function _render_text(this: DeForm, field: TextFieldConfig, options: RenderOptions): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);

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
      .value=${ifd(String(getDynFormValue(this, currentKey) ?? ""))}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @input=${this._handleInput}
      >
      ${options.labelEl}
    </sl-input>
  `;
}
