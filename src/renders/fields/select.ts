import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, SelectFieldConfig, SelectOption } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

const ifd = ifDefined;

interface RenderOptions {
  labelEl?: TemplateResult | typeof import('lit').nothing;
}

/**
 * Renders a select dropdown field.
 */
export function _render_select(
  this: DeForm,
  field: SelectFieldConfig,
  options: RenderOptions,
): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-select
      name=${field.name}
      .value=${getDynFormValue(this, currentKey)}
      placeholder=${ifd(field.placeholder)}
      ?multiple=${field.multiple}
      size=${ifd(field.size)}
      maxOptionsVisible=${ifd(field.maxOptionsVisible)}
      ?hoist=${field.hoist}
      ?required=${field.required}
      ?clearable=${field.clearable}
      ?disabled=${field.disabled}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @sl-change=${this._handleChoice}
      @sl-hide=${(e: Event) => e.stopPropagation()}
      >
      ${options.labelEl}
      ${field.options.map(
        (option: SelectOption) => html`
        <sl-option .value=${option.value}>${option.label}</sl-option>
      `,
      )}
    </sl-select>
  `;
}
