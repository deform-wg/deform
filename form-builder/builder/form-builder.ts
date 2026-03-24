import type { TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { accents, supportedAccents } from '../../src/theme/accents.js';
import type {
  FieldConfig,
  FormConfig,
  FormSection,
  FormValue,
  SelectOption,
} from '../../src/typedefs/index.js';
import '../../src/index.ts';
import { defaultConfig } from './default-config.js';
import {
  buildFieldSettingsValues,
  collectConfigWarnings,
  FIELD_TYPE_OPTIONS,
  getFieldSettingsFields,
  isFieldType,
} from './field-registry.js';
import { builderStyles } from './styles.js';
import type { FieldType, ImportSummary, SelectedField } from './types.js';
import {
  cloneConfig,
  isFormConfig,
  isFormValue,
  isRecord,
  isTabGroup,
  parseRevealOn,
  toOptionalBoolean,
  toOptionalNumber,
  toOptionalString,
} from './utils.js';

type DeFormValueChangeDetail = {
  fieldName: string;
  newValue: FormValue;
};

type PreviewTabChangeDetail = {
  tabName: string;
};

type CodeValidationState = {
  status: 'success' | 'error';
  message: string;
  warnings: string[];
  errors: string[];
  parsedConfig: FormConfig | null;
};

const MOBILE_MEDIA_QUERY = '(max-width: 960px)';
const MOBILE_FAB_HOST_STYLE = [
  'position: fixed',
  'right: max(var(--sl-spacing-medium), env(safe-area-inset-right, 0px))',
  'bottom: max(calc(var(--sl-spacing-medium) * 2), env(safe-area-inset-bottom, 0px))',
  'z-index: 30',
  'display: inline-flex',
  'width: auto',
].join('; ');
const MOBILE_TOOLBOX_DRAWER_STYLE = '--size: 90dvh;';
const MOBILE_SETTINGS_DRAWER_STYLE = '--size: 90dvh;';

function isDeFormValueChangeDetail(value: unknown): value is DeFormValueChangeDetail {
  if (!isRecord(value)) return false;
  const fieldName = value.fieldName;
  const newValue = value.newValue;
  return typeof fieldName === 'string' && isFormValue(newValue);
}

function isPreviewTabChangeDetail(value: unknown): value is PreviewTabChangeDetail {
  if (!isRecord(value)) return false;
  return typeof value.tabName === 'string';
}

export class FormBuilder extends LitElement {
  static styles = [builderStyles, accents];

  static properties = {
    config: { type: Object },
    activeSectionIndex: { type: Number },
    selectedField: { type: Object },
    showPreview: { type: Boolean },
    dragOverIndex: { type: Number },
    statusMessage: { type: String },
    activeSettingsTab: { type: String },
    importSummary: { type: Object },
    showCodeModal: { type: Boolean },
    isCodeEditMode: { type: Boolean },
    codeEditorValue: { type: String },
    codeValidation: { type: Object },
    isMobile: { type: Boolean },
    isTouchDevice: { type: Boolean },
    showToolboxDrawer: { type: Boolean },
    showSettingsDrawer: { type: Boolean },
  };

  declare config: FormConfig;
  declare activeSectionIndex: number;
  declare selectedField: SelectedField | null;
  declare showPreview: boolean;
  declare dragOverIndex: number | null;
  declare statusMessage: string;
  declare activeSettingsTab: 'field-settings' | 'section-settings' | 'form-settings';
  declare importSummary: ImportSummary | null;
  declare showCodeModal: boolean;
  declare isCodeEditMode: boolean;
  declare codeEditorValue: string;
  declare codeValidation: CodeValidationState | null;
  declare isMobile: boolean;
  declare isTouchDevice: boolean;
  declare showToolboxDrawer: boolean;
  declare showSettingsDrawer: boolean;

  private readonly fileInputRef = createRef<HTMLInputElement>();
  private readonly storageKey = 'deform-form-builder-config';
  private mobileQuery: MediaQueryList | null = null;

  constructor() {
    super();
    this.config = cloneConfig(defaultConfig);
    this.activeSectionIndex = 0;
    this.selectedField = null;
    this.showPreview = false;
    this.dragOverIndex = null;
    this.statusMessage = '';
    this.activeSettingsTab = 'field-settings';
    this.importSummary = null;
    this.showCodeModal = false;
    this.isCodeEditMode = false;
    this.codeEditorValue = '';
    this.codeValidation = null;
    this.isMobile =
      typeof window !== 'undefined' ? window.matchMedia(MOBILE_MEDIA_QUERY).matches : false;
    this.isTouchDevice =
      typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    this.showToolboxDrawer = false;
    this.showSettingsDrawer = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.restoreConfig();
    this.applyThemeClass();
    this.mobileQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    this.syncMobileState(this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.handleMobileQueryChange);
  }

  override disconnectedCallback(): void {
    this.mobileQuery?.removeEventListener('change', this.handleMobileQueryChange);
    this.mobileQuery = null;
    super.disconnectedCallback();
  }

  private get activeSection(): FormSection | undefined {
    return this.config.sections[this.activeSectionIndex];
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('config')) {
      this.applyThemeClass();
      this.persistConfig();
    }
    if (changedProperties.has('activeSectionIndex') || changedProperties.has('config')) {
      void this.syncActiveTab();
    }
    if (changedProperties.has('activeSettingsTab')) {
      void this.syncSettingsTab();
    }
  }

  render() {
    return html`
      <div class="header">
        <div class="header-actions">
          ${
            this.statusMessage
              ? html`<sl-badge variant="neutral">${this.statusMessage}</sl-badge>`
              : nothing
          }
          ${this.isMobile ? this.renderMobileHeaderActions() : this.renderDesktopHeaderActions()}
        </div>
      </div>
      ${this.renderImportSummary()}

      <div class="main">
        ${
          this.isMobile
            ? nothing
            : html`
                <div class="sidebar" ?hidden=${this.showPreview}>
                  ${this.renderToolbox()}
                </div>
              `
        }
        <div class="canvas">
          ${this.showPreview ? this.renderPreview() : this.renderCanvas()}
        </div>
        ${
          this.isMobile
            ? nothing
            : html`
                <div class="properties" ?hidden=${this.showPreview}>
                  ${this.renderPropertiesPanel()}
                </div>
              `
        }
      </div>
      ${this.renderMobileEditingChrome()}
      ${this.renderCodeModal()}

      <input
        type="file"
        accept="application/json"
        style="display: none;"
        @change=${this.handleImportFile}
        ${ref(this.fileInputRef)}
      />
    `;
  }

  private renderDesktopHeaderActions(): TemplateResult {
    return html`
      <sl-button size="small" @click=${this.handleClear}>
        <sl-icon slot="prefix" name="trash"></sl-icon>
        Clear
      </sl-button>
      <sl-button size="small" @click=${this.handleResetDefault}>
        <sl-icon slot="prefix" name="arrow-counterclockwise"></sl-icon>
        Reset Default
      </sl-button>
      <sl-button size="small" @click=${this.handleImportClick}>
        <sl-icon slot="prefix" name="upload"></sl-icon>
        Import
      </sl-button>
      <sl-button size="small" @click=${this.handleOpenCodeModal}>
        <sl-icon slot="prefix" name="code"></sl-icon>
        Code
      </sl-button>
      <sl-button size="small" @click=${this.handleExport}>
        <sl-icon slot="prefix" name="download"></sl-icon>
        Export
      </sl-button>
      <sl-button size="small" variant="primary" @click=${this.togglePreview}>
        <sl-icon slot="prefix" name=${this.showPreview ? 'pencil' : 'eye'}></sl-icon>
        ${this.showPreview ? 'Edit' : 'Preview'}
      </sl-button>
    `;
  }

  private renderMobileHeaderActions(): TemplateResult {
    return html`
      ${
        this.showPreview
          ? nothing
          : html`
              <sl-button
                size="small"
                circle
                class="mobile-header-button"
                aria-label="Open settings"
                @click=${this.openSettingsDrawer}
              >
                <sl-icon name="gear"></sl-icon>
              </sl-button>
            `
      }
      <sl-button size="small" variant="primary" @click=${this.togglePreview}>
        <sl-icon slot="prefix" name=${this.showPreview ? 'pencil' : 'eye'}></sl-icon>
        ${this.showPreview ? 'Edit' : 'Preview'}
      </sl-button>
      <sl-dropdown placement="bottom-end" hoist>
        <sl-button
          slot="trigger"
          size="small"
          circle
          class="mobile-header-button"
          aria-label="Open actions menu"
        >
          <sl-icon name="three-dots-vertical"></sl-icon>
        </sl-button>
        <sl-menu>
          <sl-menu-item @click=${this.handleClear}>
            <sl-icon slot="prefix" name="trash"></sl-icon>
            Clear
          </sl-menu-item>
          <sl-menu-item @click=${this.handleResetDefault}>
            <sl-icon slot="prefix" name="arrow-counterclockwise"></sl-icon>
            Reset Default
          </sl-menu-item>
          <sl-menu-item @click=${this.handleImportClick}>
            <sl-icon slot="prefix" name="upload"></sl-icon>
            Import
          </sl-menu-item>
          <sl-menu-item @click=${this.handleOpenCodeModal}>
            <sl-icon slot="prefix" name="code"></sl-icon>
            Code
          </sl-menu-item>
          <sl-menu-item @click=${this.handleExport}>
            <sl-icon slot="prefix" name="download"></sl-icon>
            Export
          </sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    `;
  }

  private renderMobileEditingChrome(): TemplateResult | typeof nothing {
    if (!this.isMobile || this.showPreview) return nothing;
    return html`
      <sl-button
        class="mobile-fab"
        variant="primary"
        circle
        style=${MOBILE_FAB_HOST_STYLE}
        aria-label="Open toolbox"
        @click=${this.openToolboxDrawer}
      >
        <sl-icon
          name="plus"
          style="display: block; width: 1.4rem; height: 1.4rem; font-size: 1.4rem; line-height: 1;"
        ></sl-icon>
      </sl-button>

      <sl-drawer
        label="Toolbox"
        placement="bottom"
        class="mobile-drawer toolbox-drawer"
        style=${MOBILE_TOOLBOX_DRAWER_STYLE}
        ?open=${this.showToolboxDrawer}
        @sl-after-hide=${this.handleToolboxDrawerAfterHide}
      >
        ${this.renderToolbox()}
      </sl-drawer>

      <sl-drawer
        label="Settings"
        placement="bottom"
        class="mobile-drawer settings-drawer"
        style=${MOBILE_SETTINGS_DRAWER_STYLE}
        ?open=${this.showSettingsDrawer}
        @sl-after-hide=${this.handleSettingsDrawerAfterHide}
      >
        ${this.renderPropertiesPanel()}
      </sl-drawer>
    `;
  }

  private renderImportSummary(): TemplateResult | typeof nothing {
    if (!this.importSummary) return nothing;
    const hasWarnings = this.importSummary.warnings.length > 0;
    const hasErrors = this.importSummary.errors.length > 0;
    const variant =
      this.importSummary.status === 'error' ? 'danger' : hasWarnings ? 'warning' : 'success';
    const details =
      this.importSummary.status === 'error'
        ? this.importSummary.errors
        : this.importSummary.warnings;
    const summaryLabel = this.importSummary.status === 'error' ? 'Errors' : 'Warnings';
    return html`
      <div class="import-summary">
        <sl-alert
          variant=${variant}
          open
          closable
          @sl-after-hide=${this.clearImportSummary}
        >
          <sl-icon slot="icon" name=${variant === 'success' ? 'check-circle' : 'exclamation-triangle'}>
          </sl-icon>
          <strong>${this.importSummary.message}</strong>
          ${
            hasWarnings || hasErrors
              ? html`
                  <div style="margin-top: var(--sl-spacing-small);">
                    <div style="font-weight: 600; margin-bottom: var(--sl-spacing-x-small);">
                      ${summaryLabel}
                    </div>
                    <div class="import-summary-list">
                      <ul style="margin: 0; padding-left: 1.2rem;">
                        ${details.map((item) => html`<li>${item}</li>`)}
                      </ul>
                    </div>
                  </div>
                `
              : nothing
          }
        </sl-alert>
      </div>
    `;
  }

  private renderCodeModal(): TemplateResult {
    const jsonText = this.getCurrentJsonText();
    const validation = this.codeValidation;
    const hasValidation = this.isCodeEditMode && validation;
    const validationVariant =
      validation?.status === 'error'
        ? 'danger'
        : validation?.warnings.length
          ? 'warning'
          : 'success';
    const validationItems =
      validation?.status === 'error' ? validation.errors : (validation?.warnings ?? []);
    return html`
      <sl-dialog
        label="Form JSON"
        ?open=${this.showCodeModal}
        @sl-request-close=${this.handleCloseCodeModal}
        @sl-after-hide=${this.handleCloseCodeModal}
      >
        ${
          this.isCodeEditMode
            ? html`
                <div class="code-editor-wrap">
                  ${
                    hasValidation && validation
                      ? html`
                          <sl-alert class="code-validation" variant=${validationVariant} open>
                            <strong>${validation.message}</strong>
                            ${
                              validationItems.length
                                ? html`
                                    <div style="margin-top: var(--sl-spacing-x-small);">
                                      <div style="font-weight: 600; margin-bottom: var(--sl-spacing-2x-small);">
                                        ${validation.status === 'error' ? 'Errors' : 'Warnings'}
                                      </div>
                                      <ul style="margin: 0; padding-left: 1.2rem;">
                                        ${validationItems.map((item) => html`<li>${item}</li>`)}
                                      </ul>
                                    </div>
                                  `
                                : nothing
                            }
                          </sl-alert>
                        `
                      : nothing
                  }
                  ${this.renderCodeEditor()}
                </div>
              `
            : html`
                <div class="code-box" aria-label="Form JSON">
                  ${this.renderJsonCode(jsonText)}
                </div>
              `
        }
        <div slot="footer">
          <sl-button size="small" @click=${this.handleCopyCode}>
            <sl-icon slot="prefix" name="clipboard"></sl-icon>
            Copy
          </sl-button>
          ${
            this.isCodeEditMode
              ? html`
                  <sl-button size="small" @click=${this.handleCancelCodeEdit}>Cancel Edit</sl-button>
                  <sl-button
                    size="small"
                    variant="primary"
                    ?disabled=${this.codeValidation?.status !== 'success'}
                    @click=${this.handleImportCode}
                  >
                    <sl-icon slot="prefix" name="floppy"></sl-icon>
                    Save
                  </sl-button>
                `
              : html`
                  <sl-button size="small" @click=${this.handleStartCodeEdit}>
                    <sl-icon slot="prefix" name="pencil"></sl-icon>
                    Edit
                  </sl-button>
                `
          }
          <sl-button size="small" @click=${this.handleCloseCodeModal}>Close</sl-button>
        </div>
      </sl-dialog>
    `;
  }

  private renderToolbox(): TemplateResult {
    return html`
      <div class="section-header">
        <h3 style="margin: 0;">Toolbox</h3>
      </div>
      <div class="toolbox-grid">
        ${FIELD_TYPE_OPTIONS.map(
          (fieldType) => html`
            <div
              class="field-item"
              .draggable=${!this.isMobile}
              @dragstart=${(event: DragEvent) => this.handleToolboxDragStart(event, fieldType.type)}
              @click=${() => this.handleToolboxFieldClick(fieldType.type)}
            >
              <sl-icon name=${fieldType.icon}></sl-icon>
              ${fieldType.label}
            </div>
          `,
        )}
      </div>
    `;
  }

  private renderCanvas(): TemplateResult {
    if (!this.config.sections.length) {
      return html`
        <div class="empty-state">
          <sl-icon name="plus-circle" style="font-size: 2rem;"></sl-icon>
          <p>Start by adding a section.</p>
          <sl-button variant="primary" size="small" @click=${this.addSection}>
            Add Section
          </sl-button>
        </div>
      `;
    }

    return html`
      <div class="section-header builder-section-header">
        <div>
          <h2 style="margin: 0;">Sections</h2>
          <div style="color: var(--sl-color-neutral-600); font-size: 0.9rem;">
            ${this.config.sections.length} tab${this.config.sections.length === 1 ? '' : 's'}
          </div>
        </div>
        <div class="section-actions builder-section-actions">
          <sl-button size="small" @click=${this.addSection}>
            <sl-icon slot="prefix" name="plus"></sl-icon>
            Add Section
          </sl-button>
          <sl-button
            size="small"
            variant="danger"
            ?disabled=${this.config.sections.length <= 1}
            @click=${this.removeSection}
          >
            <sl-icon slot="prefix" name="trash"></sl-icon>
            Remove Section
          </sl-button>
        </div>
      </div>

      <sl-tab-group
        class="section-tabs"
        .active=${this.sectionPanelName(this.activeSectionIndex)}
        @sl-tab-show=${this.handleSectionTabShow}
      >
        ${this.config.sections.map(
          (section, index) => html`
            <sl-tab
              slot="nav"
              .panel=${this.sectionPanelName(index)}
              class="capitalize"
            >${section.name}</sl-tab>
          `,
        )}

        ${this.config.sections.map(
          (section, index) => html`
            <sl-tab-panel .name=${this.sectionPanelName(index)}>
              ${this.renderSectionCanvas(section, index)}
            </sl-tab-panel>
          `,
        )}
      </sl-tab-group>
    `;
  }

  private renderSectionCanvas(section: FormSection, sectionIndex: number): TemplateResult {
    if (!section.fields.length) {
      return html`
        <div
          class="empty-state"
          @dragover=${this.handleCanvasDragOver}
          @dragleave=${this.handleCanvasDragLeave}
          @drop=${(event: DragEvent) => this.handleCanvasDrop(event, sectionIndex)}
        >
          <sl-icon name=${this.isMobile ? 'plus-circle' : 'arrow-left'} style="font-size: 2rem;"></sl-icon>
          <p>${this.isMobile ? 'Tap + to add fields.' : 'Drag fields here from the toolbox.'}</p>
        </div>
      `;
    }

    return html`
      <div
        class="canvas-list"
        style="display: flex; flex-direction: column; gap: var(--sl-spacing-medium);"
        @dragover=${this.handleCanvasDragOver}
        @dragleave=${this.handleCanvasDragLeave}
        @drop=${(event: DragEvent) => this.handleCanvasDrop(event, sectionIndex)}
      >
        ${section.fields.map((field, index) => {
          const isSelected =
            this.selectedField?.sectionIndex === sectionIndex &&
            this.selectedField?.fieldIndex === index;
          const previewField: FieldConfig = {
            ...field,
            revealOn: undefined,
          };
          const previewConfig: FormConfig = {
            sections: [{ name: 'preview', fields: [previewField] }],
            theme: this.config.theme,
            orientation: this.config.orientation,
            accent: this.config.accent,
            requireCommit: this.config.requireCommit,
            markModifiedFields: this.config.markModifiedFields,
            showModifiedCount: this.config.showModifiedCount,
            allowDiscardChanges: this.config.allowDiscardChanges,
          };
          return html`
            <div class="canvas-drop-zone ${this.dragOverIndex === index ? 'active' : ''}"></div>
            <div
              class="canvas-item ${isSelected ? 'selected' : ''}"
              @click=${() => this.handleCanvasItemClick(sectionIndex, index)}
              @dragend=${this.handleDragEnd}
            >
              <div class="canvas-item-header">
                <div class="canvas-item-meta">
                  ${
                    this.isTouchDevice
                      ? nothing
                      : html`
                          <span
                            class="canvas-item-drag"
                            aria-label="Drag to reorder field"
                            draggable="true"
                            @dragstart=${(event: DragEvent) => {
                              event.stopPropagation();
                              this.handleCanvasDragStart(event, sectionIndex, index);
                            }}
                          >
                            <sl-icon name="grip-vertical"></sl-icon>
                          </span>
                        `
                  }
                  <span class="canvas-item-type">${field.type}</span>
                </div>
                <div class="canvas-item-actions">
                  ${
                    this.isTouchDevice
                      ? html`
                          <button
                            type="button"
                            class="touch-reorder-button"
                            aria-label="Move field up"
                            ?disabled=${index === 0}
                            @click=${(event: Event) =>
                              this.moveFieldByOffset(event, sectionIndex, index, -1)}
                          >
                            <sl-icon name="chevron-up"></sl-icon>
                          </button>
                          <button
                            type="button"
                            class="touch-reorder-button"
                            aria-label="Move field down"
                            ?disabled=${index === section.fields.length - 1}
                            @click=${(event: Event) =>
                              this.moveFieldByOffset(event, sectionIndex, index, 1)}
                          >
                            <sl-icon name="chevron-down"></sl-icon>
                          </button>
                        `
                      : nothing
                  }
                  ${
                    this.isMobile
                      ? html`
                          <sl-icon-button
                            name="pencil"
                            label="Edit field settings"
                            @click=${(event: Event) =>
                              this.openFieldSettings(event, sectionIndex, index)}
                          ></sl-icon-button>
                        `
                      : nothing
                  }
                  <sl-icon-button
                    name="trash"
                    label="Delete field"
                    @click=${(event: Event) => this.deleteField(event, sectionIndex, index)}
                  ></sl-icon-button>
                </div>
              </div>
              <div class="canvas-preview">
                <de-form
                  .fields=${previewConfig}
                  theme=${previewConfig.theme ?? 'dark'}
                  accent=${previewConfig.accent ?? 'sky'}
                ></de-form>
              </div>
            </div>
          `;
        })}
        <div
          class="canvas-drop-zone ${this.dragOverIndex === section.fields.length ? 'active' : ''}"
        ></div>
      </div>
    `;
  }

  private renderPreview(): TemplateResult {
    return html`
      <div class="preview-card">
        <de-form
          .fields=${this.config}
          theme=${this.config.theme ?? 'dark'}
          accent=${this.config.accent ?? 'sky'}
          orientation=${this.config.orientation ?? 'portrait'}
          .requireCommit=${this.config.requireCommit ?? false}
          .markModifiedFields=${this.config.markModifiedFields ?? false}
          .showModifiedCount=${this.config.showModifiedCount ?? false}
          .allowDiscardChanges=${this.config.allowDiscardChanges ?? false}
          @deform-tab-change=${this.handlePreviewTabChange}
        ></de-form>
      </div>
    `;
  }

  private renderPropertiesPanel(): TemplateResult {
    const activeSection = this.activeSection;
    const selectedField =
      this.selectedField && this.config.sections[this.selectedField.sectionIndex]?.fields
        ? this.config.sections[this.selectedField.sectionIndex].fields[
            this.selectedField.fieldIndex
          ]
        : null;

    return html`
      <div class="section-header">
        <h2 style="margin: 0;">Settings</h2>
      </div>
      <sl-tab-group
        class="settings-tabs"
        .active=${this.activeSettingsTab}
        @sl-tab-show=${this.handleSettingsTabShow}
      >
        <sl-tab slot="nav" .panel=${'field-settings'}>Field</sl-tab>
        <sl-tab slot="nav" .panel=${'section-settings'}>Section</sl-tab>
        <sl-tab slot="nav" .panel=${'form-settings'}>Form</sl-tab>

        <sl-tab-panel .name=${'field-settings'}>
          <div class="properties-group">
            <h3>Field Settings</h3>
            ${
              selectedField
                ? this.renderFieldSettings(selectedField)
                : html`<div class="empty-state">Select a field to adjust it.</div>`
            }
          </div>
        </sl-tab-panel>

        <sl-tab-panel .name=${'section-settings'}>
          <div class="properties-group">
            <h3>Section Settings</h3>
            ${
              activeSection
                ? this.renderSectionSettings(activeSection)
                : html`<div class="empty-state">Select a section to adjust it.</div>`
            }
          </div>
        </sl-tab-panel>

        <sl-tab-panel .name=${'form-settings'}>
          <div class="properties-group">
            <h3>Form Settings</h3>
            ${this.renderFormSettings()}
          </div>
        </sl-tab-panel>
      </sl-tab-group>
    `;
  }

  private renderFormSettings(): TemplateResult {
    const fields: FieldConfig[] = [
      {
        name: 'theme',
        type: 'select',
        label: 'Theme',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ],
      },
      {
        name: 'orientation',
        type: 'select',
        label: 'Orientation',
        options: [
          { value: 'portrait', label: 'Portrait' },
          { value: 'landscape', label: 'Landscape' },
        ],
      },
      {
        name: 'accent',
        type: 'select',
        label: 'Accent',
        options: supportedAccents.map((accent) => ({
          value: accent.name,
          label: accent.label,
        })),
      },
      { name: 'requireCommit', type: 'toggle', label: 'Require Commit' },
      { name: 'markModifiedFields', type: 'toggle', label: 'Mark Modified Fields' },
      { name: 'showModifiedCount', type: 'toggle', label: 'Show Modified Count' },
      { name: 'allowDiscardChanges', type: 'toggle', label: 'Allow Discard Changes' },
    ];

    const values = {
      theme: this.config.theme ?? 'dark',
      orientation: this.config.orientation ?? 'portrait',
      accent: this.config.accent ?? 'sky',
      requireCommit: this.config.requireCommit ?? false,
      markModifiedFields: this.config.markModifiedFields ?? false,
      showModifiedCount: this.config.showModifiedCount ?? false,
      allowDiscardChanges: this.config.allowDiscardChanges ?? false,
    };

    return html`
      <de-form
        .fields=${{ sections: [{ name: 'form', fields }] }}
        .values=${values}
        theme=${this.config.theme ?? 'dark'}
        accent=${this.config.accent ?? 'sky'}
        @deform-value-change=${this.handleFormSettingsChange}
      ></de-form>
    `;
  }

  private renderSectionSettings(section: FormSection): TemplateResult {
    const fields: FieldConfig[] = [
      { name: 'name', type: 'text', label: 'Section Name', required: true },
      { name: 'submitLabel', type: 'text', label: 'Submit Label' },
      { name: 'submitLabelSuccess', type: 'text', label: 'Submit Success Label' },
    ];

    return html`
      <de-form
        .fields=${{ sections: [{ name: 'section', fields }] }}
        .values=${{
          name: section.name,
          submitLabel: section.submitLabel,
          submitLabelSuccess: section.submitLabelSuccess,
        }}
        theme=${this.config.theme ?? 'dark'}
        accent=${this.config.accent ?? 'sky'}
        @deform-value-change=${this.handleSectionSettingsChange}
      ></de-form>
    `;
  }

  private renderFieldSettings(field: FieldConfig): TemplateResult {
    const fields = getFieldSettingsFields(field);
    const values = buildFieldSettingsValues(field);

    return html`
      <de-form
        .fields=${{ sections: [{ name: 'field', fields }] }}
        .values=${values}
        theme=${this.config.theme ?? 'dark'}
        accent=${this.config.accent ?? 'sky'}
        @deform-value-change=${this.handleFieldSettingsChange}
      ></de-form>
    `;
  }

  private handleToolboxDragStart(event: DragEvent, type: FieldType): void {
    event.dataTransfer?.setData('deform-toolbox-type', type);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
    this.dragPayload = null;
  }

  private handleToolboxFieldClick(type: FieldType): void {
    this.addField(type);
    if (this.isMobile) {
      this.showToolboxDrawer = false;
    }
  }

  private handleCanvasDragStart(event: DragEvent, sectionIndex: number, fieldIndex: number): void {
    const payload = JSON.stringify({ sectionIndex, fieldIndex });
    event.dataTransfer?.setData('deform-field-move', payload);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
    this.dragPayload = { sectionIndex, fieldIndex };
  }

  private handleCanvasDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const container = event.currentTarget;
    if (!(container instanceof HTMLElement)) return;
    this.scheduleDragOverUpdate(container, event.clientY);
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = this.dragPayload ? 'move' : 'copy';
    }
  }

  private handleCanvasDragLeave = (event: DragEvent): void => {
    const container = event.currentTarget;
    if (!(container instanceof HTMLElement)) {
      this.dragOverIndex = null;
      return;
    }
    if (event.relatedTarget instanceof Node && container.contains(event.relatedTarget)) {
      return;
    }
    this.cancelDragOverFrame();
    this.dragOverIndex = null;
  };

  private handleDragEnd = (): void => {
    this.cancelDragOverFrame();
    this.dragOverIndex = null;
    this.dragPayload = null;
  };

  private handleCanvasDrop(event: DragEvent, sectionIndex: number): void {
    event.preventDefault();
    event.stopPropagation();
    const container = event.currentTarget;
    const dropIndex =
      container instanceof HTMLElement ? this.getDropIndex(container, event.clientY) : undefined;
    const type = event.dataTransfer?.getData('deform-toolbox-type') ?? '';
    if (isFieldType(type)) {
      this.addField(type, sectionIndex, dropIndex);
    } else {
      this.moveFieldFromPayload(sectionIndex, dropIndex);
    }
    this.dragOverIndex = null;
    this.dragPayload = null;
  }

  private moveFieldFromPayload(targetSectionIndex: number, targetIndex?: number): void {
    const payload = this.dragPayload;
    if (!payload) return;
    const { sectionIndex, fieldIndex } = payload;
    const destinationIndex = typeof targetIndex === 'number' ? targetIndex : undefined;
    this.moveField(sectionIndex, fieldIndex, targetSectionIndex, destinationIndex);
  }

  private dragPayload: SelectedField | null = null;
  private dragOverFrame: number | null = null;
  private lastDragOverY: number | null = null;
  private lastDropIndex: number | null = null;

  private scheduleDragOverUpdate(container: HTMLElement, clientY: number): void {
    this.lastDragOverY = clientY;
    if (this.dragOverFrame !== null) return;
    this.dragOverFrame = window.requestAnimationFrame(() => {
      this.dragOverFrame = null;
      const latestY = this.lastDragOverY;
      if (latestY === null) return;
      const nextIndex = this.getDropIndex(container, latestY);
      if (nextIndex !== this.lastDropIndex) {
        this.lastDropIndex = nextIndex;
        this.dragOverIndex = nextIndex;
      }
    });
  }

  private cancelDragOverFrame(): void {
    if (this.dragOverFrame === null) return;
    window.cancelAnimationFrame(this.dragOverFrame);
    this.dragOverFrame = null;
    this.lastDragOverY = null;
    this.lastDropIndex = null;
  }

  private getDropIndex(container: HTMLElement, clientY: number): number {
    const items = Array.from(container.querySelectorAll<HTMLElement>('.canvas-item'));
    if (items.length === 0) return 0;
    for (let index = 0; index < items.length; index += 1) {
      const rect = items[index].getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (clientY < midpoint) {
        return index;
      }
    }
    return items.length;
  }

  private selectField(sectionIndex: number, fieldIndex: number): void {
    this.selectedField = { sectionIndex, fieldIndex };
    this.activeSettingsTab = 'field-settings';
    if (this.isMobile) {
      this.openSettingsDrawer();
    }
  }

  private handleCanvasItemClick(sectionIndex: number, fieldIndex: number): void {
    if (this.isMobile) return;
    this.selectField(sectionIndex, fieldIndex);
  }

  private openFieldSettings(event: Event, sectionIndex: number, fieldIndex: number): void {
    event.stopPropagation();
    this.selectField(sectionIndex, fieldIndex);
  }

  private moveFieldByOffset(
    event: Event,
    sectionIndex: number,
    fieldIndex: number,
    offset: -1 | 1,
  ): void {
    event.stopPropagation();
    const section = this.config.sections[sectionIndex];
    if (!section) return;
    const targetIndex = fieldIndex + offset;
    if (targetIndex < 0 || targetIndex >= section.fields.length) return;
    const insertionIndex = offset < 0 ? targetIndex : targetIndex + 1;
    this.moveField(sectionIndex, fieldIndex, sectionIndex, insertionIndex);
    this.selectedField = null;
  }

  private addSection = (): void => {
    const newSection: FormSection = {
      name: `section_${this.config.sections.length + 1}`,
      fields: [],
    };
    const updated = cloneConfig(this.config);
    updated.sections.push(newSection);
    this.config = updated;
    this.activeSectionIndex = updated.sections.length - 1;
    this.selectedField = null;
    this.activeSettingsTab = 'section-settings';
    if (this.isMobile) {
      this.openSettingsDrawer();
    }
  };

  private removeSection = (): void => {
    if (this.config.sections.length <= 1) return;
    const updated = cloneConfig(this.config);
    updated.sections.splice(this.activeSectionIndex, 1);
    this.config = updated;
    this.activeSectionIndex = Math.max(0, this.activeSectionIndex - 1);
    this.selectedField = null;
    this.activeSettingsTab = 'section-settings';
  };

  private addField(type: FieldType, sectionIndex?: number, targetIndex?: number): void {
    const resolvedSectionIndex = sectionIndex ?? this.activeSectionIndex;
    const updated = cloneConfig(this.config);
    const section = updated.sections[resolvedSectionIndex];
    if (!section) return;
    const newField = this.createField(type, updated);
    const insertIndex = typeof targetIndex === 'number' ? targetIndex : section.fields.length;
    section.fields.splice(insertIndex, 0, newField);
    this.config = updated;
    this.selectedField = { sectionIndex: resolvedSectionIndex, fieldIndex: insertIndex };
    this.activeSettingsTab = 'field-settings';
  }

  private deleteField(event: Event, sectionIndex: number, fieldIndex: number): void {
    event.stopPropagation();
    const updated = cloneConfig(this.config);
    const section = updated.sections[sectionIndex];
    if (!section) return;
    section.fields.splice(fieldIndex, 1);
    this.config = updated;
    if (
      this.selectedField &&
      this.selectedField.sectionIndex === sectionIndex &&
      this.selectedField.fieldIndex === fieldIndex
    ) {
      this.selectedField = null;
    }
  }

  private moveField(
    fromSectionIndex: number,
    fromIndex: number,
    toSectionIndex: number,
    toIndex?: number,
  ): void {
    const updated = cloneConfig(this.config);
    const fromSection = updated.sections[fromSectionIndex];
    const toSection = updated.sections[toSectionIndex];
    if (!fromSection || !toSection) return;
    const [moved] = fromSection.fields.splice(fromIndex, 1);
    if (!moved) return;
    let insertIndex = typeof toIndex === 'number' ? toIndex : toSection.fields.length;
    if (fromSectionIndex === toSectionIndex && typeof toIndex === 'number' && toIndex > fromIndex) {
      insertIndex -= 1;
    }
    insertIndex = Math.max(0, Math.min(insertIndex, toSection.fields.length));
    toSection.fields.splice(insertIndex, 0, moved);
    this.config = updated;
    this.selectedField = { sectionIndex: toSectionIndex, fieldIndex: insertIndex };
  }

  private createField(type: FieldType, config: FormConfig): FieldConfig {
    const baseName = this.createUniqueFieldName(type, config);
    if (type === 'select' || type === 'radio' || type === 'radioButton') {
      return {
        type,
        name: baseName,
        label: `New ${type} field`,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
      };
    }

    if (type === 'range') {
      return {
        type,
        name: baseName,
        label: 'Range',
        min: 0,
        max: 100,
      };
    }

    if (type === 'toggleField') {
      return {
        type,
        name: baseName,
        label: 'Toggle Field',
        defaultTo: 0,
        labels: ['Option A', 'Option B'],
        fields: [
          {
            type: 'text',
            name: `${baseName}_option_a`,
            label: 'Option A',
          },
          {
            type: 'text',
            name: `${baseName}_option_b`,
            label: 'Option B',
          },
        ],
      };
    }

    return {
      type,
      name: baseName,
      label: `New ${type} field`,
    };
  }

  private createUniqueFieldName(type: FieldType, config: FormConfig): string {
    const normalized = type.toLowerCase();
    const existing = new Set(
      config.sections.flatMap((section) => section.fields.map((field) => field.name)),
    );
    let counter = 1;
    let candidate = `${normalized}_${counter}`;
    while (existing.has(candidate)) {
      counter += 1;
      candidate = `${normalized}_${counter}`;
    }
    return candidate;
  }

  private handleSectionTabShow = (event: CustomEvent): void => {
    if (!isRecord(event.detail)) return;
    const name = event.detail.name;
    if (typeof name !== 'string') return;
    const index = this.sectionIndexFromPanel(name);
    if (index !== null) {
      this.activeSectionIndex = index;
      this.selectedField = null;
      this.activeSettingsTab = 'section-settings';
    }
  };

  private handlePreviewTabChange = (event: Event): void => {
    if (!(event instanceof CustomEvent)) return;
    if (!isPreviewTabChangeDetail(event.detail)) return;
    const tabName = event.detail.tabName;
    const index = this.config.sections.findIndex((section) => section.name === tabName);
    if (index >= 0) {
      this.activeSectionIndex = index;
      this.activeSettingsTab = 'section-settings';
    }
  };

  private handleSettingsTabShow = (event: CustomEvent): void => {
    if (!isRecord(event.detail)) return;
    const name = event.detail.name;
    if (name === 'field-settings' || name === 'section-settings' || name === 'form-settings') {
      this.activeSettingsTab = name;
    }
  };

  private sectionPanelName(index: number): string {
    return `section-${index}`;
  }

  private sectionIndexFromPanel(panel: string): number | null {
    if (!panel.startsWith('section-')) return null;
    const index = Number(panel.replace('section-', ''));
    return Number.isNaN(index) ? null : index;
  }

  private handleFieldSettingsChange = (event: Event): void => {
    const detail = this.getChangeDetail(event);
    if (!detail || !this.selectedField) return;
    const { fieldName, newValue } = detail;
    const updated = cloneConfig(this.config);
    const field =
      updated.sections[this.selectedField.sectionIndex]?.fields[this.selectedField.fieldIndex];
    if (!field) return;

    if (fieldName === 'optionsRaw') {
      const options = this.parseOptions(newValue);
      if ('options' in field) {
        field.options = options;
      }
    } else if (fieldName === 'toggleLabels' && field.type === 'toggleField') {
      field.labels = this.parseToggleLabels(newValue);
    } else if (fieldName === 'labelActionName' || fieldName === 'labelActionLabel') {
      const name = fieldName === 'labelActionName' ? newValue : (field.labelAction?.name ?? '');
      const label = fieldName === 'labelActionLabel' ? newValue : (field.labelAction?.label ?? '');
      const nextName = toOptionalString(name) ?? '';
      const nextLabel = toOptionalString(label) ?? '';
      field.labelAction = nextName || nextLabel ? { name: nextName, label: nextLabel } : undefined;
    } else if (fieldName === 'revealOnRaw') {
      const parsed = parseRevealOn(newValue);
      field.revealOn = parsed;
    } else {
      this.applyFieldProperty(field, fieldName, newValue);
    }

    updated.sections[this.selectedField.sectionIndex].fields[this.selectedField.fieldIndex] = field;
    this.config = updated;
  };

  private handleSectionSettingsChange = (event: Event): void => {
    const detail = this.getChangeDetail(event);
    if (!detail) return;
    const section = this.activeSection;
    if (!section) return;
    const updated = cloneConfig(this.config);
    const targetSection = updated.sections[this.activeSectionIndex];
    if (!targetSection) return;

    if (detail.fieldName === 'name') {
      targetSection.name = toOptionalString(detail.newValue) ?? targetSection.name;
    } else if (detail.fieldName === 'submitLabel') {
      targetSection.submitLabel = toOptionalString(detail.newValue);
    } else if (detail.fieldName === 'submitLabelSuccess') {
      targetSection.submitLabelSuccess = toOptionalString(detail.newValue);
    }

    this.config = updated;
  };

  private handleFormSettingsChange = (event: Event): void => {
    const detail = this.getChangeDetail(event);
    if (!detail) return;
    const updated = cloneConfig(this.config);

    if (detail.fieldName === 'theme') {
      updated.theme = detail.newValue === 'light' ? 'light' : 'dark';
    } else if (detail.fieldName === 'orientation') {
      const orientation = detail.newValue === 'landscape' ? 'landscape' : 'portrait';
      updated.orientation = orientation;
    } else if (detail.fieldName === 'accent') {
      updated.accent = toOptionalString(detail.newValue) ?? '';
    } else if (detail.fieldName === 'requireCommit') {
      updated.requireCommit = toOptionalBoolean(detail.newValue) ?? false;
    } else if (detail.fieldName === 'markModifiedFields') {
      updated.markModifiedFields = toOptionalBoolean(detail.newValue) ?? false;
    } else if (detail.fieldName === 'showModifiedCount') {
      updated.showModifiedCount = toOptionalBoolean(detail.newValue) ?? false;
    } else if (detail.fieldName === 'allowDiscardChanges') {
      updated.allowDiscardChanges = toOptionalBoolean(detail.newValue) ?? false;
    }

    this.config = updated;
  };

  private applyFieldProperty(field: FieldConfig, fieldName: string, rawValue: FormValue): void {
    switch (fieldName) {
      case 'label':
        field.label = toOptionalString(rawValue);
        return;
      case 'name': {
        const next = toOptionalString(rawValue);
        if (next) {
          field.name = next;
        }
        return;
      }
      case 'help':
        field.help = toOptionalString(rawValue);
        return;
      case 'placeholder':
        field.placeholder = toOptionalString(rawValue);
        return;
      case 'pattern':
        if ('pattern' in field) {
          field.pattern = toOptionalString(rawValue);
        }
        return;
      case 'resize':
        if ('resize' in field) {
          field.resize = toOptionalString(rawValue);
        }
        return;
      case 'autocapitalize':
        if ('autocapitalize' in field) {
          field.autocapitalize = toOptionalString(rawValue);
        }
        return;
      case 'autocorrect':
        if ('autocorrect' in field) {
          field.autocorrect = toOptionalString(rawValue);
        }
        return;
      case 'autocomplete':
        if ('autocomplete' in field) {
          field.autocomplete = toOptionalString(rawValue);
        }
        return;
      case 'enterkeyhint':
        if ('enterkeyhint' in field) {
          field.enterkeyhint = toOptionalString(rawValue);
        }
        return;
      case 'inputmode':
        if ('inputmode' in field) {
          field.inputmode = toOptionalString(rawValue);
        }
        return;
      case 'format':
        if ('format' in field) {
          field.format = toOptionalString(rawValue);
        }
        return;
      case 'swatches':
        if ('swatches' in field) {
          field.swatches = toOptionalString(rawValue);
        }
        return;
      case 'value':
        field.value = rawValue;
        return;
      case 'required':
        field.required = toOptionalBoolean(rawValue);
        return;
      case 'disabled':
        field.disabled = toOptionalBoolean(rawValue);
        return;
      case 'hidden':
        field.hidden = toOptionalBoolean(rawValue);
        return;
      case 'breakline':
        field.breakline = toOptionalBoolean(rawValue);
        return;
      case 'clearable':
        if ('clearable' in field) {
          field.clearable = toOptionalBoolean(rawValue);
        }
        return;
      case 'requireConfirmation':
        if ('requireConfirmation' in field) {
          field.requireConfirmation = toOptionalBoolean(rawValue);
        }
        return;
      case 'passwordToggle':
        if ('passwordToggle' in field) {
          field.passwordToggle = toOptionalBoolean(rawValue);
        }
        return;
      case 'noSpinButtons':
        if ('noSpinButtons' in field) {
          field.noSpinButtons = toOptionalBoolean(rawValue);
        }
        return;
      case 'autofocus':
        if ('autofocus' in field) {
          field.autofocus = toOptionalBoolean(rawValue);
        }
        return;
      case 'filled':
        if ('filled' in field) {
          field.filled = toOptionalBoolean(rawValue);
        }
        return;
      case 'readonly':
        if ('readonly' in field) {
          field.readonly = toOptionalBoolean(rawValue);
        }
        return;
      case 'multiple':
        if ('multiple' in field) {
          field.multiple = toOptionalBoolean(rawValue);
        }
        return;
      case 'hoist':
        if ('hoist' in field) {
          field.hoist = toOptionalBoolean(rawValue);
        }
        return;
      case 'indeterminate':
        if ('indeterminate' in field) {
          field.indeterminate = toOptionalBoolean(rawValue);
        }
        return;
      case 'showTooltip':
        if ('showTooltip' in field) {
          field.showTooltip = toOptionalBoolean(rawValue);
        }
        return;
      case 'inline':
        if ('inline' in field) {
          field.inline = toOptionalBoolean(rawValue);
        }
        return;
      case 'opacity':
        if ('opacity' in field) {
          field.opacity = toOptionalBoolean(rawValue);
        }
        return;
      case 'noFormatToggle':
        if ('noFormatToggle' in field) {
          field.noFormatToggle = toOptionalBoolean(rawValue);
        }
        return;
      case 'uppercase':
        if ('uppercase' in field) {
          field.uppercase = toOptionalBoolean(rawValue);
        }
        return;
      case 'minlength':
        if ('minlength' in field) {
          field.minlength = toOptionalNumber(rawValue);
        }
        return;
      case 'maxlength':
        if ('maxlength' in field) {
          field.maxlength = toOptionalNumber(rawValue);
        }
        return;
      case 'rows':
        if ('rows' in field) {
          field.rows = toOptionalNumber(rawValue);
        }
        return;
      case 'words':
        if ('words' in field) {
          field.words = toOptionalNumber(rawValue);
        }
        return;
      case 'step':
        if ('step' in field) {
          field.step = toOptionalNumber(rawValue);
        }
        return;
      case 'maxOptionsVisible':
        if ('maxOptionsVisible' in field) {
          field.maxOptionsVisible = toOptionalNumber(rawValue);
        }
        return;
      case 'precision':
        if ('precision' in field) {
          field.precision = toOptionalNumber(rawValue);
        }
        return;
      case 'min':
        if ('min' in field) {
          if (field.type === 'date') {
            field.min = toOptionalString(rawValue);
          } else {
            field.min = toOptionalNumber(rawValue);
          }
        }
        return;
      case 'max':
        if ('max' in field) {
          if (field.type === 'date') {
            field.max = toOptionalString(rawValue);
          } else {
            field.max = toOptionalNumber(rawValue);
          }
        }
        return;
      case 'defaultTo':
        if (field.type === 'toggleField') {
          const value = toOptionalNumber(rawValue);
          field.defaultTo = value === 1 ? 1 : 0;
        } else if (field.type === 'checkbox' || field.type === 'toggle') {
          field.defaultTo = toOptionalBoolean(rawValue);
        } else if (field.type === 'color') {
          field.defaultTo = toOptionalString(rawValue);
        }
        return;
      case 'size':
        if (rawValue === 'small' || rawValue === 'medium' || rawValue === 'large') {
          field.size = rawValue;
        }
        return;
      default:
        return;
    }
  }

  private parseOptions(value: FormValue): SelectOption[] {
    const raw = typeof value === 'string' ? value : '';
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [valuePart, labelPart] = line.split(':');
        const value = valuePart?.trim() ?? '';
        const label = labelPart?.trim() ?? value;
        return { value, label };
      })
      .filter((option) => option.value.length > 0);
  }

  private parseToggleLabels(value: FormValue): string[] {
    if (typeof value !== 'string') return [];
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  private getChangeDetail(event: Event): { fieldName: string; newValue: FormValue } | null {
    if (!(event instanceof CustomEvent)) return null;
    if (!isDeFormValueChangeDetail(event.detail)) return null;
    return { fieldName: event.detail.fieldName, newValue: event.detail.newValue };
  }

  private handleClear = (): void => {
    const shouldClear =
      this.config.sections.length === 0
        ? true
        : window.confirm('Clear the current form and start fresh?');
    if (!shouldClear) return;
    this.config = { sections: [{ name: 'main', fields: [] }] };
    this.activeSectionIndex = 0;
    this.selectedField = null;
    this.closeMobileDrawers();
    this.statusMessage = 'Cleared';
    setTimeout(() => {
      this.statusMessage = '';
    }, 1200);
  };

  private handleResetDefault = (): void => {
    const shouldReset = window.confirm('Reset to the default example?');
    if (!shouldReset) return;
    try {
      window.localStorage.removeItem(this.storageKey);
    } catch {
      // Ignore storage failures.
    }
    this.config = cloneConfig(defaultConfig);
    this.activeSectionIndex = 0;
    this.selectedField = null;
    this.closeMobileDrawers();
    this.statusMessage = 'Default restored';
    setTimeout(() => {
      this.statusMessage = '';
    }, 1400);
  };

  private handleImportClick = (): void => {
    this.fileInputRef.value?.click();
  };

  private handleImportFile = async (event: Event): Promise<void> => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed: unknown = JSON.parse(text);
      if (!isFormConfig(parsed)) {
        this.importSummary = {
          status: 'error',
          message: 'Import failed.',
          warnings: [],
          errors: ['Invalid config shape.'],
        };
        return;
      }
      this.applyImportedConfig(parsed, 'file');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown parsing error';
      this.importSummary = {
        status: 'error',
        message: 'Import failed.',
        warnings: [],
        errors: [message],
      };
    } finally {
      input.value = '';
      setTimeout(() => {
        this.statusMessage = '';
      }, 1600);
    }
  };

  private handleExport = (): void => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(this.config, null, 2),
    )}`;
    const anchor = document.createElement('a');
    anchor.href = dataStr;
    anchor.download = 'form-config.json';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    this.statusMessage = 'Config exported';
    setTimeout(() => {
      this.statusMessage = '';
    }, 1200);
  };

  private handleOpenCodeModal = (): void => {
    this.closeMobileDrawers();
    this.showCodeModal = true;
    this.isCodeEditMode = false;
    this.codeEditorValue = this.getCurrentJsonText();
    this.codeValidation = this.validateCodeInput(this.codeEditorValue);
  };

  private handleCloseCodeModal = (): void => {
    this.showCodeModal = false;
    this.isCodeEditMode = false;
    this.codeEditorValue = '';
    this.codeValidation = null;
  };

  private getCurrentJsonText(): string {
    return JSON.stringify(this.config, null, 2);
  }

  private handleCopyCode = async (): Promise<void> => {
    const jsonText = this.isCodeEditMode ? this.codeEditorValue : this.getCurrentJsonText();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(jsonText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = jsonText;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      this.statusMessage = 'Code copied';
    } catch {
      this.statusMessage = 'Copy failed';
    }
    setTimeout(() => {
      this.statusMessage = '';
    }, 1200);
  };

  private handleStartCodeEdit = (): void => {
    this.isCodeEditMode = true;
    this.codeEditorValue = this.getCurrentJsonText();
    this.codeValidation = this.validateCodeInput(this.codeEditorValue);
  };

  private handleCancelCodeEdit = (): void => {
    this.isCodeEditMode = false;
    this.codeEditorValue = this.getCurrentJsonText();
    this.codeValidation = this.validateCodeInput(this.codeEditorValue);
  };

  private handleCodeEditorInput = (event: Event): void => {
    const nextValue = this.getInputValue(event);
    if (nextValue === null) return;
    this.codeEditorValue = nextValue;
    this.codeValidation = this.validateCodeInput(nextValue);
  };

  private handleImportCode = (): void => {
    const validation = this.codeValidation;
    if (!validation || validation.status !== 'success' || !validation.parsedConfig) return;
    this.applyImportedConfig(validation.parsedConfig, 'code');
    this.showCodeModal = false;
    this.isCodeEditMode = false;
    this.codeEditorValue = '';
    this.codeValidation = null;
  };

  private validateCodeInput(rawText: string): CodeValidationState {
    try {
      const parsed: unknown = JSON.parse(rawText);
      if (!isFormConfig(parsed)) {
        return {
          status: 'error',
          message: 'JSON parsed but does not match form config shape.',
          warnings: [],
          errors: ['Expected a config object with sections and field definitions.'],
          parsedConfig: null,
        };
      }
      const warnings = collectConfigWarnings(parsed);
      return {
        status: 'success',
        message: warnings.length ? 'Valid config with warnings.' : 'Valid config. Ready to save.',
        warnings,
        errors: [],
        parsedConfig: parsed,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown parsing error';
      const location = this.extractJsonErrorLocation(rawText, message);
      const locatedMessage = location
        ? `${message} (line ${location.line}, column ${location.column})`
        : message;
      return {
        status: 'error',
        message: location
          ? `Invalid JSON at line ${location.line}, column ${location.column}.`
          : 'Invalid JSON.',
        warnings: [],
        errors: [locatedMessage],
        parsedConfig: null,
      };
    }
  }

  private getInputValue(event: Event): string | null {
    const target = event.target;
    if (!isRecord(target)) return null;
    const value = target.value;
    return typeof value === 'string' ? value : null;
  }

  private applyImportedConfig(config: FormConfig, source: 'file' | 'code'): void {
    const warnings = collectConfigWarnings(config);
    this.config = cloneConfig(config);
    this.activeSectionIndex = 0;
    this.selectedField = null;
    this.closeMobileDrawers();
    this.importSummary = {
      status: 'success',
      message: warnings.length
        ? `Config imported from ${source} with warnings.`
        : `Config imported from ${source} successfully.`,
      warnings,
      errors: [],
    };
  }

  private extractJsonErrorLocation(
    rawText: string,
    errorMessage: string,
  ): { line: number; column: number } | null {
    const positionMatch = /position (\d+)/.exec(errorMessage);
    if (!positionMatch) return null;
    const rawPosition = Number(positionMatch[1]);
    if (Number.isNaN(rawPosition) || rawPosition < 0) return null;
    let line = 1;
    let column = 1;
    const max = Math.min(rawPosition, rawText.length);
    for (let index = 0; index < max; index += 1) {
      const char = rawText[index];
      if (char === '\n') {
        line += 1;
        column = 1;
      } else {
        column += 1;
      }
    }
    return { line, column };
  }

  private renderCodeEditor(): TemplateResult {
    const lineCount = Math.max(1, this.codeEditorValue.split('\n').length);
    const lineNumbers = Array.from({ length: lineCount }, (_, index) => index + 1);
    return html`
      <div class="code-editor-shell">
        <div class="code-line-numbers" aria-hidden="true">
          ${lineNumbers.map((lineNumber) => html`<div class="code-line-number">${lineNumber}</div>`)}
        </div>
        <textarea
          class="code-editor-textarea"
          spellcheck="false"
          .value=${this.codeEditorValue}
          @input=${this.handleCodeEditorInput}
        ></textarea>
      </div>
    `;
  }

  private renderJsonCode(jsonText: string): TemplateResult {
    const parts: Array<string | TemplateResult> = [];
    const tokenPattern =
      /("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([[[\]{}:,])/g;
    let lastIndex = 0;
    let match = tokenPattern.exec(jsonText);
    while (match) {
      const index = match.index;
      if (index > lastIndex) {
        parts.push(jsonText.slice(lastIndex, index));
      }
      const token = match[0] ?? '';
      const stringToken = match[1];
      const numberToken = match[2];
      const literalToken = match[3];
      const punctuation = match[4];
      if (stringToken !== undefined) {
        const isKey = this.isJsonKey(jsonText, index + token.length);
        parts.push(html`<span class=${isKey ? 'json-key' : 'json-string'}>${token}</span>`);
      } else if (numberToken !== undefined) {
        parts.push(html`<span class="json-number">${token}</span>`);
      } else if (literalToken !== undefined) {
        parts.push(html`<span class="json-literal">${token}</span>`);
      } else if (punctuation !== undefined) {
        parts.push(html`<span class="json-punctuation">${token}</span>`);
      } else {
        parts.push(token);
      }
      lastIndex = index + token.length;
      match = tokenPattern.exec(jsonText);
    }
    if (lastIndex < jsonText.length) {
      parts.push(jsonText.slice(lastIndex));
    }
    return html`<pre class="code-block">${parts}</pre>`;
  }

  private isJsonKey(jsonText: string, startIndex: number): boolean {
    for (let index = startIndex; index < jsonText.length; index += 1) {
      const char = jsonText[index];
      if (char === ':') return true;
      if (char !== ' ' && char !== '\n' && char !== '\r' && char !== '\t') {
        return false;
      }
    }
    return false;
  }

  private togglePreview = (): void => {
    this.showPreview = !this.showPreview;
    if (this.showPreview) {
      this.closeMobileDrawers();
    }
  };

  private openToolboxDrawer = (): void => {
    this.showSettingsDrawer = false;
    this.showToolboxDrawer = true;
  };

  private openSettingsDrawer = (): void => {
    if (this.activeSettingsTab === 'field-settings' && !this.selectedField) {
      this.activeSettingsTab = this.activeSection ? 'section-settings' : 'form-settings';
    }
    this.showToolboxDrawer = false;
    this.showSettingsDrawer = true;
  };

  private handleToolboxDrawerAfterHide = (): void => {
    this.showToolboxDrawer = false;
  };

  private handleSettingsDrawerAfterHide = (): void => {
    this.showSettingsDrawer = false;
  };

  private closeMobileDrawers(): void {
    this.showToolboxDrawer = false;
    this.showSettingsDrawer = false;
  }

  private syncMobileState(matches: boolean): void {
    this.isMobile = matches;
    if (!matches) {
      this.closeMobileDrawers();
    }
  }

  private handleMobileQueryChange = (event: MediaQueryListEvent): void => {
    this.syncMobileState(event.matches);
  };

  private applyThemeClass(): void {
    const theme = this.config.theme ?? 'dark';
    const accent = this.config.accent ?? 'sky';
    this.setAttribute('data-theme', theme);
    this.setAttribute('accent', accent);
    const body = this.ownerDocument?.body;
    if (body) {
      body.classList.toggle('sl-theme-dark', theme === 'dark');
      body.classList.toggle('sl-theme-light', theme === 'light');
    }
  }

  private async syncActiveTab(): Promise<void> {
    await this.updateComplete;
    const tabGroup = this.renderRoot.querySelector('sl-tab-group.section-tabs');
    if (!isTabGroup(tabGroup)) return;
    const target = this.sectionPanelName(this.activeSectionIndex);
    tabGroup.show(target);
  }

  private async syncSettingsTab(): Promise<void> {
    await this.updateComplete;
    const tabGroup = this.renderRoot.querySelector('sl-tab-group.settings-tabs');
    if (!isTabGroup(tabGroup)) return;
    tabGroup.show(this.activeSettingsTab);
  }

  private clearImportSummary = (): void => {
    this.importSummary = null;
  };
  private persistConfig(): void {
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.config));
    } catch {
      // Ignore storage failures (private mode, quota, etc.)
    }
  }

  private restoreConfig(): void {
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!isFormConfig(parsed)) return;
      this.config = cloneConfig(parsed);
    } catch {
      // Ignore storage failures and keep default config.
    }
  }
}

customElements.define('form-builder', FormBuilder);
