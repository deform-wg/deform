import { html, nothing } from "lit";

export function generateActionLabel(formInstance, fieldName, actionName, actionLabel) {
  const { labelKey } = formInstance.propKeys(fieldName);
  return html`
    <sl-button variant="text"
      class="label-action"
      size="small"
      data-action-name=${actionName}
      ?loading=${formInstance[labelKey]}
      @click=${(e) => { 
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
  `
}