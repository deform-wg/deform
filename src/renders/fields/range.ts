import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { deform, RangeFieldConfig } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

const ifd = ifDefined;

/**
 * Renders a range slider field.
 */
export function _render_range(this: deform, field: RangeFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-range
      name=${field.name}
      label=${ifd(field.label)}
      .value=${getDynFormValue(this, currentKey) ?? 0}
      min=${ifd(field.min)}
      max=${ifd(field.max)}
      step=${ifd(field.step)}
      ?disabled=${field.disabled}
      ?showTooltip=${field.showTooltip}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @sl-change=${this._handleChoice}>
    </sl-range>
  `;
}

// TODO: Works with numbers. Change tracking struggles with strings.
