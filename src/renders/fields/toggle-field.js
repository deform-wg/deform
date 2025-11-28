import {
  html,
  ifDefined,
  css,
  nothing,
} from "../../vendor/@lit/all@3.1.2/lit-all.min.js";

const ifd = ifDefined;

const fieldToggleStyles = css`
  .field-toggle::part(label) {
    padding: 0em;
  }
`;

export function _render_toggleField(field) {
  const { variantIndexKey } = this.propKeys(field.name);

  const switchField = (showingIndex) => {
    if (showingIndex === 0) { this[variantIndexKey] = 1 }
    if (showingIndex === 1) { this[variantIndexKey] = 0 }
  }

  return html`
    <div class="form-control no-margin">
      ${field.fields.map((f, index) => {
        if (index !== this[variantIndexKey]) return nothing;
        return html`${this[`_render_${f.type}`](f)}`;
      })}
    </div>
    <sl-button 
      variant="text"
      class="field-toggle"
      @click=${() => switchField(this[variantIndexKey])}
      >${field.labels[this[variantIndexKey]]}</sl-button
    >
    <style>
      ${fieldToggleStyles}
    </style>
  `;
}
