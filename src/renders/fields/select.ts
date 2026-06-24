import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import type { deform, FormValue, SelectFieldConfig, SelectOption } from '../../typedefs/index.js';
import { getDynBoolean, getDynFormValue } from '../../utils/dynamic-props.js';

const ifd = ifDefined;

interface RenderOptions {
  labelEl?: TemplateResult | typeof import('lit').nothing;
}

interface SearchableState {
  filter: string;
}

const searchableSelectStates = new WeakMap<deform, Map<string, SearchableState>>();

/**
 * Renders a select dropdown field.
 */
export function _render_select(
  this: deform,
  field: SelectFieldConfig,
  options: RenderOptions,
): TemplateResult {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  const fieldOptions = Array.isArray(field.options) ? field.options : [];
  const searchable = field.searchable && !field.multiple;

  if (searchable) {
    return renderSearchableSelect(this, field, fieldOptions, {
      currentValue: getDynFormValue(this, currentKey),
      dirty: getDynBoolean(this, isDirtyKey),
      labelEl: options.labelEl,
    });
  }

  return html`
    <sl-select
      name=${field.name}
      .value=${getDynFormValue(this, currentKey)}
      placeholder=${ifd(field.placeholder)}
      ?multiple=${field.multiple}
      size=${ifd(field.size)}
      maxOptionsVisible=${ifd(field.maxOptionsVisible)}
      help-text=${ifd(field.help)}
      ?hoist=${field.hoist}
      ?required=${field.required}
      ?clearable=${field.clearable}
      ?disabled=${field.disabled}
      ?data-dirty-field=${getDynBoolean(this, isDirtyKey)}
      @sl-change=${this._handleChoice}
      @sl-hide=${(e: Event) => e.stopPropagation()}
      >
      ${options.labelEl}
      ${repeat(
        fieldOptions,
        (option: SelectOption) => `${String(option.value)}:${option.label}`,
        (option: SelectOption) => html`
        <sl-option .value=${option.value}>${option.label}</sl-option>
      `,
      )}
    </sl-select>
  `;
}

function renderSearchableSelect(
  host: deform,
  field: SelectFieldConfig,
  fieldOptions: SelectOption[],
  options: {
    currentValue: FormValue;
    dirty: boolean;
    labelEl?: TemplateResult | typeof import('lit').nothing | undefined;
  },
): TemplateResult {
  const state = getSearchableSelectState(host, field.name);
  const selectedOption = fieldOptions.find((option) => option.value === options.currentValue);
  const hasValue = !!selectedOption;
  const showClear = field.clearable && hasValue && !field.disabled;
  const filteredOptions = getFilteredOptions(fieldOptions, state.filter);
  const currentValue = String(options.currentValue ?? '');

  return html`
    <div class="searchable-select-field">
      ${
        options.labelEl
          ? html`
          <label class="searchable-select-label ${field.required ? 'required' : ''}">
            ${options.labelEl}
          </label>
        `
          : nothing
      }

      <select
        class="searchable-select-native-control"
        name=${field.name}
        .value=${currentValue}
        ?required=${field.required}
        ?disabled=${field.disabled}
        ?data-dirty-field=${options.dirty}
        tabindex="-1"
        aria-hidden="true"
      >
        <option value="" ?selected=${currentValue === ''}></option>
        ${fieldOptions.map(
          (option) =>
            html`<option
              value=${String(option.value)}
              ?selected=${String(option.value) === currentValue}
            ></option>`,
        )}
      </select>

      <sl-dropdown
        class="searchable-select-dropdown"
        placement="bottom"
        distance="0"
        sync="width"
        ?hoist=${field.hoist}
        @sl-show=${() => resetSearchableFilter(host, field.name)}
        @sl-hide=${(event: Event) => event.stopPropagation()}
      >
        <button
          slot="trigger"
          type="button"
          class="searchable-select-trigger size-${field.size ?? 'medium'} ${
            hasValue ? 'has-value' : ''
          }"
          ?disabled=${field.disabled}
          aria-haspopup="listbox"
        >
          <span class="searchable-select-trigger-label ${hasValue ? '' : 'placeholder'}">
            ${hasValue ? selectedOption.label : field.placeholder || 'Select an option'}
          </span>
          ${
            showClear
              ? html`
              <sl-icon-button
                class="searchable-select-clear"
                name="x-lg"
                label="Clear"
                @click=${(event: Event) => clearSearchableSelection(host, field.name, event)}
              ></sl-icon-button>
            `
              : nothing
          }
          <sl-icon name="chevron-down" class="searchable-select-chevron"></sl-icon>
        </button>

        <div class="searchable-select-panel" role="dialog">
          <div class="searchable-select-header">
            <sl-icon-button
              name="arrow-left"
              label="Back"
              @click=${hideSearchableDropdown}
            ></sl-icon-button>
            <span class="searchable-select-title">${field.label || 'Select'}</span>
          </div>

          <div class="searchable-select-search-wrap">
            <sl-input
              class="searchable-select-search"
              placeholder="Search..."
              size=${ifd(field.size)}
              clearable
              .value=${state.filter}
              @sl-input=${(event: Event) => updateSearchableFilter(host, field.name, event)}
              @sl-clear=${() => setSearchableFilter(host, field.name, '')}
            >
              <sl-icon slot="prefix" name="search"></sl-icon>
            </sl-input>
          </div>

          <div class="searchable-select-list" role="listbox">
            ${
              filteredOptions.length === 0
                ? html`<p class="searchable-select-empty">No results</p>`
                : repeat(
                    filteredOptions,
                    (option) => `${String(option.value)}:${option.label}`,
                    (option) =>
                      renderSearchableOption(host, field.name, option, options.currentValue),
                  )
            }
          </div>
        </div>
      </sl-dropdown>

      ${field.help ? html`<p class="searchable-select-help-text">${field.help}</p>` : nothing}
    </div>
  `;
}

function renderSearchableOption(
  host: deform,
  fieldName: string,
  option: SelectOption,
  currentValue: FormValue,
): TemplateResult {
  const selected = option.value === currentValue;

  return html`
    <button
      type="button"
      role="option"
      aria-selected=${selected ? 'true' : 'false'}
      class="searchable-select-option ${selected ? 'selected' : ''}"
      ?disabled=${option.disabled}
        @click=${(event: Event) => selectSearchableOption(host, fieldName, option, event)}
    >
      <span class="searchable-select-option-label">${option.label}</span>
      ${selected ? html`<sl-icon name="check2" class="searchable-select-check"></sl-icon>` : nothing}
    </button>
  `;
}

function getFilteredOptions(options: SelectOption[], filter: string): SelectOption[] {
  const query = filter.trim().toLowerCase();
  if (!query) return options;

  return options.filter((option) => {
    const valueText = String(option.value).toLowerCase();
    const searchText = option.searchText?.toLowerCase() ?? '';
    return (
      option.label.toLowerCase().includes(query) ||
      valueText.includes(query) ||
      searchText.includes(query)
    );
  });
}

function getSearchableSelectState(host: deform, fieldName: string): SearchableState {
  let hostState = searchableSelectStates.get(host);
  if (!hostState) {
    hostState = new Map();
    searchableSelectStates.set(host, hostState);
  }

  let fieldState = hostState.get(fieldName);
  if (!fieldState) {
    fieldState = { filter: '' };
    hostState.set(fieldName, fieldState);
  }

  return fieldState;
}

function updateSearchableFilter(host: deform, fieldName: string, event: Event): void {
  const value = (event.target as { value?: unknown }).value;
  setSearchableFilter(host, fieldName, typeof value === 'string' ? value : '');
}

function resetSearchableFilter(host: deform, fieldName: string): void {
  getSearchableSelectState(host, fieldName).filter = '';
  requestHostUpdate(host);
}

function setSearchableFilter(host: deform, fieldName: string, filter: string): void {
  const state = getSearchableSelectState(host, fieldName);
  state.filter = filter;
  requestHostUpdate(host);
}

function clearSearchableSelection(host: deform, fieldName: string, event: Event): void {
  event.stopPropagation();
  dispatchChoice(host, fieldName, '');
}

function selectSearchableOption(
  host: deform,
  fieldName: string,
  option: SelectOption,
  event: Event,
): void {
  if (option.disabled) return;
  dispatchChoice(host, fieldName, option.value);
  hideSearchableDropdown(event);
}

function dispatchChoice(host: deform, fieldName: string, value: string | number): void {
  host._handleChoice({
    target: {
      name: fieldName,
      value,
    },
  } as unknown as Event);
}

function hideSearchableDropdown(event: Event): void {
  const dropdown = (event.currentTarget as Element | null)?.closest('sl-dropdown') as
    | { hide?: () => void }
    | undefined;
  dropdown?.hide?.();
}

function requestHostUpdate(host: deform): void {
  (host as unknown as { requestUpdate: () => void }).requestUpdate();
}
