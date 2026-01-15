import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, RatingFieldConfig } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

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
      value=${Number(getDynFormValue(this, currentKey) ?? 0)}
      label=${ifd(field.label)}
      max=${ifd(field.max)}
      precision=${ifd(field.precision)}
      ?disabled=${field.disabled}
      ?readonly=${field.readonly}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @sl-change=${this._handleRating}>
    </sl-rating>
  `;
}
