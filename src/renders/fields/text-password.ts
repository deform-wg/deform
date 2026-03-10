import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, TextFieldConfig } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

const ifd = ifDefined;

type CustomValidatable = HTMLElement & { setCustomValidity: (message: string) => void };

/**
 * Renders a password input field with optional confirmation.
 */
export function _render_password(this: DeForm, field: TextFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey, repeatKey } = this.propKeys(field.name);

  // Custom validation to check if both passwords match
  const validatePasswordsMatch = (_event: Event): void => {
    const shadowRoot = (this as unknown as { shadowRoot?: ShadowRoot | null }).shadowRoot ?? null;
    const passwordEl = shadowRoot?.querySelector<CustomValidatable>(`[name=${field.name}]`) ?? null;
    if (!passwordEl) return;

    const curr = String(getDynFormValue(this, currentKey) ?? '');
    const rep = String(getDynFormValue(this, repeatKey) ?? '');
    curr !== rep
      ? passwordEl.setCustomValidity('Passwords do not match')
      : passwordEl.setCustomValidity('');
  };

  return html`
    <sl-input
      type="password"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      minlength=${ifd(field.minlength)}
      maxlength=${ifd(field.maxlength)}
      pattern=${ifd(field.pattern)}
      size=${ifd(field.size)}
      .value=${ifd(String(getDynFormValue(this, currentKey) ?? ''))}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?disabled=${field.disabled}
      ?password-toggle=${field.passwordToggle}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @input=${(event: Event) => {
        this._handleInput(event);
        field.requireConfirmation && validatePasswordsMatch(event);
      }}
    >
    </sl-input>
    ${
      field.requireConfirmation
        ? html`
      <sl-input
        type="password"
        name=${`${field.name}_repeat`}
        label="Repeat password"
        help-text="Just to be sure you know your password"
        size=${ifd(field.size)}
        ?clearable=${field.clearable}
        ?disabled=${field.disabled}
        data-repeat-field
        .value=${ifd(String(getDynFormValue(this, repeatKey) ?? ''))}
        required
        password-toggle
        @input=${(event: Event) => {
          this._handleInput(event);
          validatePasswordsMatch(event);
        }}
      >
    </sl-input>
    `
        : nothing
    }
  `;
}
