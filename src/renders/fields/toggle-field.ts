import { html, css, nothing } from "lit";
import type { TemplateResult } from "lit";
import type { DeForm, ToggleFieldConfig, FieldConfig } from '../../typedefs/index.js';

const fieldToggleStyles = css`
  .field-toggle::part(label) {
    padding: 0em;
  }
`;

interface ToggleFieldWithFields extends ToggleFieldConfig {
  fields: FieldConfig[];
  labels: string[];
}

/**
 * Renders a toggle field that switches between multiple field variants.
 */
export function _render_toggleField(this: DeForm, field: ToggleFieldWithFields): TemplateResult {
  const { variantIndexKey } = this.propKeys(field.name);

  const switchField = (showingIndex: number): void => {
    if (showingIndex === 0) { (this as any)[variantIndexKey] = 1; }
    if (showingIndex === 1) { (this as any)[variantIndexKey] = 0; }
  };

  return html`
    <div class="form-control no-margin">
      ${field.fields.map((f, index) => {
        if (index !== (this as any)[variantIndexKey]) return nothing;
        return html`${(this as any)[`_render_${f.type}`](f)}`;
      })}
    </div>
    <sl-button 
      variant="text"
      class="field-toggle"
      @click=${() => switchField((this as any)[variantIndexKey])}
      >${field.labels[(this as any)[variantIndexKey]]}</sl-button
    >
    <style>
      ${fieldToggleStyles}
    </style>
  `;
}
