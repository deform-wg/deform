import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { DeForm, TextFieldConfig } from '../../typedefs/index.js';

const ifd = ifDefined;

/**
 * Renders a password input field with optional confirmation.
 */
export function _render_password(this: DeForm, field: TextFieldConfig): TemplateResult {
  const { currentKey, isDirtyKey, repeatKey } = this.propKeys(field.name);

  // Custom validation to check if both passwords match
  const validatePasswordsMatch = (_event: Event): void => {
    const passwordEl = (this as any).shadowRoot.querySelector(`[name=${field.name}]`) as any;
    (this as any)[currentKey] !== (this as any)[repeatKey]
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
      .value=${ifd((this as any)[currentKey] || "")}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?disabled=${(field as any).disabled}
      ?password-toggle=${field.passwordToggle}
      ?data-dirty-field=${(this as any)[isDirtyKey]}
      @input=${(event: Event) => {
          this._handleInput(event);
          field.requireConfirmation && validatePasswordsMatch(event);
        }}
    >
    </sl-input>
    ${field.requireConfirmation ? html`
      <sl-input
        type="password"
        name=${`${field.name}_repeat`}
        label="Repeat password"
        help-text="Just to be sure you know your password"
        size=${ifd(field.size)}
        ?clearable=${field.clearable}
        ?disabled=${(field as any).disabled}
        data-repeat-field
        .value=${ifd((this as any)[repeatKey])}
        required
        password-toggle
        @input=${(event: Event) => {
          this._handleInput(event);
          validatePasswordsMatch(event);
        }}
      >
    </sl-input>
    ` : nothing}
  `;
}
