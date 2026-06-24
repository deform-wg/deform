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
  activeIndex: number;
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
  const currentValue = getDynFormValue(this, currentKey);
  const fieldOptions = Array.isArray(field.options) ? field.options : [];
  const searchable = field.searchable;

  if (searchable) {
    return renderSearchableSelect(this, field, fieldOptions, {
      currentValue,
      dirty: getDynBoolean(this, isDirtyKey),
      labelEl: options.labelEl,
    });
  }

  const selectValue = field.multiple ? currentValue : String(currentValue ?? '');
  const isEmptySingleSelect = !field.multiple && selectValue === '';

  return html`
    <sl-select
      class=${isEmptySingleSelect ? 'select-empty' : ''}
      name=${field.name}
      .value=${selectValue}
      placeholder=${ifd(field.placeholder ?? (isEmptySingleSelect ? 'Select an option' : undefined))}
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
  const selectedOptions = getSelectedOptions(fieldOptions, options.currentValue, field.multiple);
  const hasValue = selectedOptions.length > 0;
  const showClear = field.clearable && hasValue && !field.disabled;
  const filteredOptions = getFilteredOptions(fieldOptions, state.filter);
  const activeIndex = getSearchableActiveIndex(state, filteredOptions);
  const currentValue = field.multiple
    ? selectedOptions.map((option) => String(option.value))
    : String(options.currentValue ?? '');
  const triggerLabel = getSearchableTriggerLabel(field, selectedOptions);
  const maxVisibleOptions = getMaxVisibleOptions(field.maxOptionsVisible);

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
        .value=${field.multiple ? '' : currentValue}
        ?multiple=${field.multiple}
        ?required=${field.required}
        ?disabled=${field.disabled}
        ?data-dirty-field=${options.dirty}
        tabindex="-1"
        aria-hidden="true"
      >
        ${
          field.multiple
            ? nothing
            : html`<option value="" ?selected=${currentValue === ''}></option>`
        }
        ${fieldOptions.map(
          (option) =>
            html`<option
              value=${String(option.value)}
              ?selected=${isOptionSelected(option, options.currentValue, field.multiple)}
            ></option>`,
        )}
      </select>

      <sl-dropdown
        class="searchable-select-dropdown"
        placement="bottom"
        distance="0"
        sync="width"
        ?hoist=${field.hoist}
        @sl-show=${() => resetSearchableFilter(host, field.name, filteredOptions)}
        @sl-after-show=${focusSearchableInput}
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
            ${triggerLabel}
          </span>
          ${
            showClear
              ? html`
              <sl-icon-button
                class="searchable-select-clear"
                name="x-lg"
                label="Clear"
                @click=${(event: Event) => clearSearchableSelection(host, field, event)}
              ></sl-icon-button>
            `
              : nothing
          }
          <sl-icon name="chevron-down" class="searchable-select-chevron"></sl-icon>
        </button>

        <div
          class="searchable-select-panel"
          role="dialog"
          style=${`--searchable-select-visible-options: ${maxVisibleOptions};`}
        >
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
              @keydown=${(event: KeyboardEvent) =>
                handleSearchableKeyDown(host, field, filteredOptions, event)}
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
                    (option, index) =>
                      renderSearchableOption(
                        host,
                        field,
                        option,
                        options.currentValue,
                        index === activeIndex,
                      ),
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
  field: SelectFieldConfig,
  option: SelectOption,
  currentValue: FormValue,
  active: boolean,
): TemplateResult {
  const selected = isOptionSelected(option, currentValue, field.multiple);

  return html`
    <button
      type="button"
      role="option"
      aria-selected=${selected ? 'true' : 'false'}
      class="searchable-select-option ${selected ? 'selected' : ''} ${active ? 'active' : ''}"
      ?disabled=${option.disabled}
      tabindex=${active ? '0' : '-1'}
      @click=${(event: Event) => selectSearchableOption(host, field, option, event)}
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

function getSelectedOptions(
  options: SelectOption[],
  value: FormValue,
  multiple: boolean | undefined,
): SelectOption[] {
  if (multiple) {
    const values = Array.isArray(value) ? value.map(String) : [];
    return options.filter((option) => values.includes(String(option.value)));
  }

  return options.filter((option) => option.value === value);
}

function isOptionSelected(
  option: SelectOption,
  value: FormValue,
  multiple: boolean | undefined,
): boolean {
  if (multiple) {
    return Array.isArray(value) && value.map(String).includes(String(option.value));
  }

  return option.value === value;
}

function getSearchableTriggerLabel(
  field: SelectFieldConfig,
  selectedOptions: SelectOption[],
): string {
  if (selectedOptions.length === 0) return field.placeholder || 'Select an option';
  if (!field.multiple) return selectedOptions[0]?.label ?? field.placeholder ?? 'Select an option';
  return `${selectedOptions.length} option${selectedOptions.length === 1 ? '' : 's'} selected`;
}

function getMaxVisibleOptions(maxOptionsVisible: number | undefined): number {
  if (typeof maxOptionsVisible !== 'number' || maxOptionsVisible <= 0) return 3;
  return maxOptionsVisible;
}

function getSearchableActiveIndex(state: SearchableState, options: SelectOption[]): number {
  const enabledIndexes = getEnabledOptionIndexes(options);
  if (enabledIndexes.length === 0) return -1;
  return enabledIndexes.includes(state.activeIndex) ? state.activeIndex : (enabledIndexes[0] ?? -1);
}

function getEnabledOptionIndexes(options: SelectOption[]): number[] {
  return options.flatMap((option, index) => (option.disabled ? [] : [index]));
}

function getSearchableSelectState(host: deform, fieldName: string): SearchableState {
  let hostState = searchableSelectStates.get(host);
  if (!hostState) {
    hostState = new Map();
    searchableSelectStates.set(host, hostState);
  }

  let fieldState = hostState.get(fieldName);
  if (!fieldState) {
    fieldState = { filter: '', activeIndex: 0 };
    hostState.set(fieldName, fieldState);
  }

  return fieldState;
}

function updateSearchableFilter(host: deform, fieldName: string, event: Event): void {
  const value = (event.target as { value?: unknown }).value;
  setSearchableFilter(host, fieldName, typeof value === 'string' ? value : '');
}

function resetSearchableFilter(host: deform, fieldName: string, options: SelectOption[]): void {
  const state = getSearchableSelectState(host, fieldName);
  state.filter = '';
  state.activeIndex = getEnabledOptionIndexes(options)[0] ?? -1;
  requestHostUpdate(host);
}

function setSearchableFilter(host: deform, fieldName: string, filter: string): void {
  const state = getSearchableSelectState(host, fieldName);
  state.filter = filter;
  state.activeIndex = 0;
  requestHostUpdate(host);
}

function clearSearchableSelection(host: deform, field: SelectFieldConfig, event: Event): void {
  event.stopPropagation();
  dispatchChoice(host, field.name, field.multiple ? [] : '');
}

function selectSearchableOption(
  host: deform,
  field: SelectFieldConfig,
  option: SelectOption,
  event: Event,
): void {
  if (option.disabled) return;
  dispatchChoice(host, field.name, getNextSearchableValue(host, field, option));
  if (!field.multiple) {
    hideSearchableDropdown(event);
  }
}

function getNextSearchableValue(
  host: deform,
  field: SelectFieldConfig,
  option: SelectOption,
): string | number | Array<string | number> {
  if (!field.multiple) return option.value;

  const { currentKey } = host.propKeys(field.name);
  const currentValue = getDynFormValue(host, currentKey);
  const values = Array.isArray(currentValue) ? currentValue : [];
  const optionValue = option.value;
  const optionValueText = String(optionValue);
  const exists = values.some((value) => String(value) === optionValueText);
  return exists
    ? values.filter((value) => String(value) !== optionValueText)
    : [...values, optionValue];
}

function handleSearchableKeyDown(
  host: deform,
  field: SelectFieldConfig,
  filteredOptions: SelectOption[],
  event: KeyboardEvent,
): void {
  if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) return;

  event.preventDefault();
  event.stopPropagation();

  if (event.key === 'Escape') {
    hideSearchableDropdown(event);
    return;
  }

  const state = getSearchableSelectState(host, field.name);
  const enabledIndexes = getEnabledOptionIndexes(filteredOptions);
  if (enabledIndexes.length === 0) return;

  const currentEnabledIndex = enabledIndexes.indexOf(
    getSearchableActiveIndex(state, filteredOptions),
  );

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    const movement = event.key === 'ArrowDown' ? 1 : -1;
    const nextEnabledIndex =
      (currentEnabledIndex + movement + enabledIndexes.length) % enabledIndexes.length;
    state.activeIndex = enabledIndexes[nextEnabledIndex] ?? enabledIndexes[0] ?? -1;
    requestHostUpdate(host);
    return;
  }

  const activeOption = filteredOptions[getSearchableActiveIndex(state, filteredOptions)];
  if (event.key === 'Enter' && activeOption) {
    selectSearchableOption(host, field, activeOption, event);
  }
}

function dispatchChoice(
  host: deform,
  fieldName: string,
  value: string | number | Array<string | number>,
): void {
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

function focusSearchableInput(event: Event): void {
  const input = (event.currentTarget as Element | null)?.querySelector(
    '.searchable-select-search',
  ) as { focus?: () => void } | null;
  input?.focus?.();
}

function requestHostUpdate(host: deform): void {
  (host as unknown as { requestUpdate: () => void }).requestUpdate();
}
