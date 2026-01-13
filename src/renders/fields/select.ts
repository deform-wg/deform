import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, SelectFieldConfig, SelectOption } from '../../typedefs/index.js';

const ifd = ifDefined;

interface RenderOptions {
  labelEl?: TemplateResult | typeof import('lit').nothing;
}

/**
 * Renders a select dropdown field.
 */
export function _render_select(this: DeForm, field: SelectFieldConfig, options: RenderOptions): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-select
      name=${field.name}
      .value=${(this as any)[currentKey]}
      placeholder=${ifd(field.placeholder)}
      ?multiple=${field.multiple}
      size=${ifd((field as any).size)}
      maxOptionsVisible=${ifd((field as any).maxOptionsVisible)}
      ?hoist=${(field as any).hoist}
      ?required=${field.required}
      ?clearable=${field.clearable}
      ?disabled=${(field as any).disabled}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @sl-change=${this._handleChoice}
      @sl-hide=${(e: Event) => e.stopPropagation()}
      >
      ${options.labelEl}
      ${field.options.map((option: SelectOption) => html`
        <sl-option .value=${option.value}>${option.label}</sl-option>
      `)}
    </sl-select>
  `;
}
