import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, ColorFieldConfig } from '../../typedefs/index.js';

const ifd = ifDefined;

/**
 * Renders a color picker field.
 */
export function _render_color(this: DeForm, field: ColorFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-color-picker
      name=${field.name}
      .value=${(this as any)[currentKey]}
      ?disabled=${(field as any).disabled}
      ?inline=${(field as any).inline}
      ?opacity=${(field as any).opacity}
      ?noFormatToggle=${(field as any).opacity}
      ?uppercase=${(field as any).uppercase}
      format=${ifd((field as any).format)}
      swatches=${ifd((field as any).swatches)}
      size=${ifd((field as any).size)}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @sl-change=${this._handleChoice}>
    </sl-color-picker>
  `;
}
