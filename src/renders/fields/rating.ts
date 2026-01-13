import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, RatingFieldConfig } from '../../typedefs/index.js';

const ifd = ifDefined;

// TODO. Bug. Value is not being included in serialized form data.

/**
 * Renders a rating field.
 */
export function _render_rating(this: DeForm, field: RatingFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-rating
      name=${field.name}
      value=${(this as any)[currentKey]}
      label=${ifd(field.label)}
      max=${ifd(field.max)}
      precision=${ifd((field as any).precision)}
      ?disabled=${(field as any).disabled}
      ?readonly=${(field as any).readonly}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @sl-change=${this._handleRating}>
    </sl-rating>
  `;
}
