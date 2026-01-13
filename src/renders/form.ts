import { html, nothing } from "lit";
import type { TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { classMap } from "lit/directives/class-map.js";
import { generateActionLabel } from "./action.js";
import type { DeForm, FormConfig, FormSection, FieldConfig } from '../typedefs/index.js';

interface FormControlOptions {
  formId: string;
  submitLabel?: string;
  submitLabelSuccess?: string;
}


/**
 * Generates one or multiple forms based on the number of sections.
 * Multiple sections render as a tabbed interface.
 */
export function _generateOneOrManyForms(this: DeForm, data: FormConfig): TemplateResult {
  const tabs = data.sections.map((section) => {
    const changeCount = (this as any)[`_form_${section.name}_count`];
    return html`
      <sl-tab
        @click=${(event: Event) => this._handleTabChange(event, section.name)}
        slot="nav"
        ?disabled=${this._loading}
        class="capitalize"
        panel=${section.name}
      >
        ${section.name}
        ${this.showModifiedCount ? html`
          <sl-tag
            pill
            size="small"
            ?data-active=${changeCount}
            class="tag-change-indicator ${this.showModifiedCount}"
            variant="neutral"
            >${changeCount}
          </sl-tag>
        ` : nothing}
      </sl-tab>
    `;
  });

  const form = (section: FormSection, _index: number = 0): TemplateResult => {
    if (!section.fields || section.fields.length === 0) {
      return html`
        <form
          id=${section.name}
          @submit=${this._handleSubmit}
          ?data-mark-modified=${this.markModifiedFields}
        >
          <p>No fields in this section</p>
        </form>
      `;
    }

    const formFields = repeat(
      section.fields,
      (field) => field.name,
      (field) => (this as any)._generateField(field),
    );

    const formControls = (this as any)._generateFormControls({
      formId: section.name,
      submitLabel: section.submitLabel || "Save",
      submitLabelSuccess: section.submitLabelSuccess || ""
    });
    return html`
      <form
        id=${section.name}
        @submit=${this._handleSubmit}
        ?data-mark-modified=${this.markModifiedFields}
      >
        ${formFields} ${formControls}
      </form>
    `;
  };

  const panels = data.sections.map((section, index) => {
    return html`
      <sl-tab-panel name=${section.name}>
        ${form(section, index)}
      </sl-tab-panel>
    `;
  });

  // if multiple sections, render tabs and panels
  if (data.sections.length > 1)
    return html`
      <sl-tab-group
        placement=${this.orientation === "portrait" ? "top" : "start"}
      >
        ${tabs} ${panels}
      </sl-tab-group>
    `;

  if (data.sections.length === 1) {
    return html`${form(data.sections[0]!)}`;
  }

  // Empty sections array
  return html`<p>No form sections configured</p>`;
}

/**
 * Generates a single form field with label and wrapper.
 */
export function _generateField(this: DeForm, field: FieldConfig): TemplateResult | typeof nothing {
  try {
    // Hidden fields, never render HTML
    if ('hidden' in field && field.hidden) return nothing;

    // Fields with reveal rules render HTML if rule conditions are met
    if ('revealOn' in field && field.revealOn && !(this as any)[this.propKeys(field.name).revealKey]) return nothing;

    // Stylistic
    const formControlClasses = classMap({
      'form-control': true,
      'breakline': 'breakline' in field && !!field.breakline
    });

    // Form Label
    const actionEl = ('labelAction' in field && field.labelAction) ? generateActionLabel(
      this,
      field.name,
      field.labelAction.name,
      field.labelAction.label
    ) : nothing;

    const labelEl = ('label' in field && field.label) ? html`
      <span slot="label">
        ${field.label}
        ${actionEl}
      </span>
    ` : nothing;

    const fieldElement = (this as any)[`_render_${field.type}`](field, { labelEl });

    return html`
      <div class=${formControlClasses}>
        ${fieldElement}
      </div>
    `;
  } catch (fieldRenderError) {
    console.error("Dynamic form field error:", { field, fieldRenderError });
    return (this as any)._generateErrorField(field);
  }
}

/**
 * Generates an error field display when a field fails to render.
 */
export function _generateErrorField(this: DeForm, field: FieldConfig): TemplateResult {
  return html`
    <div class="form-control render-error" no-collect>
      <sl-input
        label="Field Error"
        help-text="${field.type} is not a valid field type"
        value=${field.type}
      >
        <sl-icon name="exclamation-diamond" slot="prefix"></sl-icon>
      </sl-input>
    </div>
  `;
}

/**
 * Generates the form control buttons (submit, discard).
 */
export function _generateFormControls(this: DeForm, options: FormControlOptions = { formId: '' }): TemplateResult {
  const changeCount = (this as any)[`_form_${options.formId}_count`];
  return html`
    <div class="footer-controls">
      ${this.allowDiscardChanges && changeCount
        ? html`
            <sl-button
              variant="text"
              id="${options.formId}__reset_button"
              @click=${(this as any)._handleDiscardChanges}
            >
              Discard changes
            </sl-button>
          `
        : nothing}

      ${this.onSubmit ? html`
        <sl-button
          id="${options.formId}__save_button"
          variant="primary"
          type="submit"
          ?loading=${this._loading}
          ?disabled=${!changeCount || (this as any)._celebrate}
          form=${options.formId}
        >
          ${(this as any)._celebrate ? html`
            <sl-icon name="check-lg" slot=${options.submitLabelSuccess ? "prefix" : ""}></sl-icon>
            ${options.submitLabelSuccess}
            ` : (options.submitLabel || "Save")}
        </sl-button>
      ` : nothing}
    </div>
  `;
}
