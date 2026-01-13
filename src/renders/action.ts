import { html } from "lit";
import type { TemplateResult } from "lit";
import type { DeForm } from '../typedefs/index.js';
import { getDynBoolean } from '../utils/dynamic-props.js';

/**
 * Generates an action button label for a form field.
 * When clicked, dispatches an 'action-label-triggered' event.
 */
export function generateActionLabel(
  formInstance: DeForm,
  fieldName: string,
  actionName: string,
  actionLabel: string
): TemplateResult {
  const { labelKey } = formInstance.propKeys(fieldName);
  return html`
    <sl-button variant="text"
      class="label-action"
      size="small"
      data-action-name=${actionName}
      ?loading=${getDynBoolean(formInstance, labelKey)}
      @click=${(e: Event) => {
        e.preventDefault();
        formInstance.dispatchEvent(new CustomEvent(
          `action-label-triggered`, {
            detail: { fieldName, actionName },
            composed: true,
            bubbles: true,
          }));
        }
      }
      >${actionLabel}
    </sl-button>
  `;
}
