import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, SeedphraseFieldConfig } from '../../typedefs/index.js';

const ifd = ifDefined;

/**
 * Renders a seedphrase textarea field.
 */
export function _render_seedphrase(this: DeForm, field: SeedphraseFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-textarea
      name=${field.name}
      .value=${ifd((this as any)[currentKey] || "")}
      size=${ifd((field as any).size)}
      ?filled=${(field as any).filled}
      label=${ifd(field.label)}
      help-text=${ifd(field.help)}
      placeholder=${ifd(field.placeholder)}
      rows=${ifd((field as any).rows)}
      resize=${ifd((field as any).resize)}
      ?disabled=${(field as any).disabled}
      ?readonly=${(field as any).readonly}
      ?required=${field.required}
      minlength=${ifd((field as any).minlength)}
      maxlength=${ifd((field as any).maxlength)}
      autocapitalize=${ifd((field as any).autocapitalize)}
      autocorrect=${ifd((field as any).autocorrect)}
      autocomplete=${ifd((field as any).autocomplete)}
      ?autofocus=${(field as any).autofocus}
      enterkeyhint=${ifd((field as any).enterkeyhint)}
      ?spellcheck=${(field as any).spellcheck}
      inputmode=${ifd((field as any).inputmode)}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @input=${this._handleInput}
    ></sl-textarea>
  `;
}
