import { css } from 'lit';

export const styles = css`
  :host {
    color: var(--sl-color-neutral-700);
  }

  .loader-overlay {
    min-height: 240px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  form {
    padding: 0em;
  }

  form[data-mark-modified] {
    padding: 0em;
    padding-left: 1rem;
  }

  /* Form tabs */
  sl-tab.capitalize::part(base) {
    text-transform: capitalize;
  }

  /* Form element spacing */
  .form-control {
    padding-bottom: 1.5em;
  }

  .form-control.no-margin {
    padding-bottom: 0em;
  }

  .form-control.breakline {
    border-bottom: 1px dashed var(--sl-input-border-color);
    margin-bottom: 1em;
  }

  /* Highlighting edits */
  form[data-mark-modified] [data-dirty-field] {
    position: relative;
  }
  form[data-mark-modified] [data-dirty-field]::part(form-control-label)::before,
  form[data-mark-modified] [data-dirty-field]::part(label)::before {
    content: "~";
    color: var(--sl-color-neutral-500);
    display: inline-block;
    position: absolute;
    left: -1em;
  }

  .tag-change-indicator {
    margin-left: 0.5em;
    display: none;
  }
  .tag-change-indicator[data-active] {
    display: inline-block;
  }

  @media (min-width: 680px) {
    .tag-change-indicator {
      display: inline-block;
      visibility: hidden;
    }
    .tag-change-indicator[data-active] {
      display: inline-block;
      visibility: visible;
    }
  }

  /* Footer buttons (submit, discard etc) */
  .footer-controls {
    display: flex;
    align-items: center;
    justify-content: var(--submit-btn-anchor, flex-end);
    gap: 0.75rem;
  }

  .footer-actions-end {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-left: auto;
  }

  .submit-success-state {
    display: inline-grid;
    place-items: center;
  }

  .submit-success-icon,
  .submit-success-placeholder {
    grid-area: 1 / 1;
  }

  .submit-success-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .submit-success-placeholder {
    visibility: hidden;
  }

  .footer-controls sl-button.discard-button::part(base) {
    color: var(--sl-color-neutral-700);
    text-decoration: underline;
  }
  .footer-controls sl-button.discard-button::part(base):hover {
    color: var(--sl-color-neutral-900);
  }

  /* Wider buttons on small screens unless overriden */
  sl-button:not([variant="text"]) {
    width: var(--submit-btn-width, 100%);
  }
  @media (min-width: 480px) {
    sl-button:not([variant="text"]) {
      width: var(--submit-btn-width, auto);
    }
  }

  /* Form Actions */
  sl-input,
  sl-select {
    position: relative;
  }

  sl-select.select-empty sl-option[tabindex='0'][aria-selected='false']::part(base) {
    background-color: transparent;
    color: var(--sl-color-neutral-700);
  }

  .searchable-select-field {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .searchable-select-label {
    color: var(--sl-input-label-color);
    font-family: var(--sl-input-font-family);
    font-size: var(--sl-input-label-font-size-medium);
    font-weight: var(--sl-font-weight-semibold);
    margin-bottom: var(--sl-spacing-3x-small);
    user-select: none;
  }

  .searchable-select-label.required::after {
    color: var(--sl-input-required-content-color);
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }

  .searchable-select-native-control {
    height: 1px;
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 1px;
  }

  .searchable-select-dropdown {
    display: block;
    width: 100%;
  }

  .searchable-select-dropdown::part(panel) {
    width: 100%;
  }

  .searchable-select-trigger {
    align-items: center;
    background-color: var(--sl-input-background-color);
    border: var(--sl-input-border-width) solid var(--sl-input-border-color);
    border-radius: var(--sl-input-border-radius-medium);
    color: var(--sl-input-color);
    cursor: pointer;
    display: flex;
    font-family: var(--sl-input-font-family);
    font-size: var(--sl-input-font-size-medium);
    gap: 0.5rem;
    min-height: var(--sl-input-height-medium);
    padding: 0 var(--sl-input-spacing-medium);
    text-align: left;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
    width: 100%;
  }

  .searchable-select-trigger.size-small {
    font-size: var(--sl-input-font-size-small);
    min-height: var(--sl-input-height-small);
    padding: 0 var(--sl-input-spacing-small);
  }

  .searchable-select-trigger.size-large {
    font-size: var(--sl-input-font-size-large);
    min-height: var(--sl-input-height-large);
    padding: 0 var(--sl-input-spacing-large);
  }

  .searchable-select-trigger:hover:not(:disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
    color: var(--sl-input-color-hover);
  }

  .searchable-select-trigger:focus-visible {
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
    outline: none;
  }

  .searchable-select-trigger:disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    color: var(--sl-input-color-disabled);
    cursor: not-allowed;
    opacity: 0.5;
  }

  .searchable-select-trigger-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .searchable-select-trigger-label.placeholder {
    color: var(--sl-input-placeholder-color);
  }

  .searchable-select-clear {
    flex: 0 0 auto;
    font-size: 0.85rem;
  }

  .searchable-select-chevron {
    color: var(--sl-color-neutral-500);
    flex: 0 0 auto;
    font-size: 0.9rem;
  }

  .searchable-select-help-text {
    color: var(--sl-input-help-text-color);
    font-family: var(--sl-input-font-family);
    font-size: var(--sl-input-help-text-font-size-medium);
    margin: var(--sl-spacing-3x-small) 0 0;
  }

  .searchable-select-dropdown::part(popup) {
    z-index: 1000;
  }

  .searchable-select-panel {
    background: var(--sl-panel-background-color);
    border: 1px solid var(--sl-input-border-color);
    border-radius: var(--sl-input-border-radius-medium);
    box-shadow: var(--sl-shadow-large);
    display: flex;
    flex-direction: column;
    max-height: min(19rem, var(--auto-size-available-height, 19rem));
    overflow: hidden;
  }

  .searchable-select-header {
    display: none;
  }

  .searchable-select-search-wrap {
    flex: 0 0 auto;
    padding: 0.5rem;
  }

  .searchable-select-search {
    width: 100%;
  }

  .searchable-select-list {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.25rem 0;
  }

  .searchable-select-option {
    align-items: center;
    background: transparent;
    border: 0;
    color: var(--sl-color-neutral-700);
    cursor: pointer;
    display: flex;
    font-family: var(--sl-input-font-family);
    font-size: var(--sl-input-font-size-medium);
    justify-content: space-between;
    padding: 0.65rem 1rem;
    text-align: left;
    width: 100%;
  }

  .searchable-select-option:hover:not(:disabled) {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-900);
  }

  .searchable-select-option:disabled {
    color: var(--sl-color-neutral-400);
    cursor: not-allowed;
  }

  .searchable-select-option.selected {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    font-weight: var(--sl-font-weight-semibold);
  }

  .searchable-select-option.selected:hover:not(:disabled) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .searchable-select-option-label {
    flex: 1;
  }

  .searchable-select-check {
    color: currentColor;
    flex: 0 0 auto;
    font-size: 1.1rem;
  }

  .searchable-select-empty {
    color: var(--sl-color-neutral-500);
    font-family: var(--sl-input-font-family);
    margin: 0;
    padding: 2rem 1rem;
    text-align: center;
  }

  @media (max-width: 920px) {
    .searchable-select-dropdown::part(popup) {
      background: rgb(0 0 0 / 45%);
      bottom: 0;
      display: flex;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
    }

    .searchable-select-panel {
      border: 0;
      border-radius: 0;
      box-shadow: none;
      height: 100%;
      max-height: none;
      width: 100%;
    }

    .searchable-select-header {
      align-items: center;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      display: flex;
      flex: 0 0 auto;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
    }

    .searchable-select-title {
      color: var(--sl-color-neutral-900);
      font-family: var(--sl-input-font-family);
      font-size: 1rem;
      font-weight: var(--sl-font-weight-semibold);
    }
  }

  .label-action {
    position: absolute;
    right: 0;
    top: 0;
    color: #8c8cff;
    text-align: right;
  }

  .label-action::part(label) {
    padding: 0;
    margin: 0;
  }

  .label-action::part(spinner) {
    left: auto;
    right: 3px;
    --indicator-color: #bbb;
  }
`;
