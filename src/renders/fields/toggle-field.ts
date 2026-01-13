import { html, css, nothing } from "lit";
import type { TemplateResult } from "lit";
import type { DeForm, ToggleFieldConfig } from '../../typedefs/index.js';
import type { FieldConfig, RenderOptions } from '../../typedefs/index.js';
import { getDynNumber, setDynNumber } from '../../utils/dynamic-props.js';

const fieldToggleStyles = css`
  .field-toggle::part(label) {
    padding: 0em;
  }
`;

/**
 * Renders a toggle field that switches between multiple field variants.
 */
export function _render_toggleField(this: DeForm, field: ToggleFieldConfig): TemplateResult {
  const { variantIndexKey } = this.propKeys(field.name);

  const switchField = (showingIndex: number): void => {
    if (showingIndex === 0) { setDynNumber(this, variantIndexKey, 1); }
    if (showingIndex === 1) { setDynNumber(this, variantIndexKey, 0); }
  };

  const activeIndex = getDynNumber(this, variantIndexKey);

  return html`
    <div class="form-control no-margin">
      ${field.fields.map((f, index) => {
        if (index !== activeIndex) return nothing;
        const renderFn = (this as unknown as Record<string, unknown>)[`_render_${f.type}`];
        const element = typeof renderFn === 'function'
          ? (renderFn as (field: FieldConfig, options: RenderOptions) => unknown)(f, { labelEl: nothing })
          : nothing;
        return html`${element}`;
      })}
    </div>
    <sl-button 
      variant="text"
      class="field-toggle"
      @click=${() => switchField(activeIndex)}
      >${field.labels[activeIndex]}</sl-button
    >
    <style>
      ${fieldToggleStyles}
    </style>
  `;
}
