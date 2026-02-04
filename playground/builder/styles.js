import { css } from 'lit';

export const builderStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
    font-family: var(--sl-font-sans);
    --sidebar-width: 260px;
    --properties-width: 320px;
    --header-height: 64px;
    --sl-input-border-color-focus: var(--sl-color-primary-500);
    --sl-input-border-color-hover: var(--sl-color-primary-400);
    --sl-input-focus-ring-color: var(--sl-color-primary-100);
    --sl-input-focus-ring: 0 0 0 3px var(--sl-input-focus-ring-color);
    --sl-select-border-color-focus: var(--sl-color-primary-500);
    --sl-select-border-color-hover: var(--sl-color-primary-400);
    --sl-select-focus-ring-color: var(--sl-color-primary-100);
    --sl-select-focus-ring: 0 0 0 3px var(--sl-select-focus-ring-color);
  }

  .header {
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 var(--sl-spacing-medium);
    background: var(--sl-color-neutral-0);
    border-bottom: 1px solid var(--sl-color-neutral-200);
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-small);
    font-weight: var(--sl-font-weight-semibold);
  }

  .header-actions {
    display: flex;
    gap: var(--sl-spacing-small);
    align-items: center;
    margin-left: auto;
  }

  .import-summary {
    position: fixed;
    top: var(--sl-spacing-large);
    right: var(--sl-spacing-large);
    width: min(420px, calc(100% - 2rem));
    z-index: 20;
    --import-summary-pad: var(--sl-spacing-medium);
  }

  .import-summary sl-alert {
    position: relative;
  }

  .import-summary sl-alert::part(message) {
    padding-right: calc(var(--import-summary-pad) * 2);
  }

  .import-summary sl-alert::part(close-button) {
    position: absolute;
    top: var(--import-summary-pad);
    right: var(--import-summary-pad);
  }

  .import-summary-list {
    max-height: 180px;
    overflow: auto;
    padding-right: var(--sl-spacing-x-small);
  }

  .main {
    display: flex;
    flex: 1;
    height: calc(100% - var(--header-height));
    overflow: hidden;
  }

  .sidebar {
    width: var(--sidebar-width);
    background: var(--sl-color-neutral-50);
    border-right: 1px solid var(--sl-color-neutral-200);
    padding: var(--sl-spacing-medium);
    overflow-y: auto;
  }

  .canvas {
    flex: 1;
    background: var(--sl-color-neutral-100);
    padding: var(--sl-spacing-large);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-medium);
  }

  .properties {
    width: var(--properties-width);
    background: var(--sl-color-neutral-0);
    border-left: 1px solid var(--sl-color-neutral-200);
    padding: var(--sl-spacing-medium);
    overflow-y: auto;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sl-spacing-small);
    margin-bottom: var(--sl-spacing-medium);
  }

  .field-item {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-small);
    background: var(--sl-color-neutral-0);
    border: 1px solid var(--sl-color-neutral-200);
    padding: var(--sl-spacing-small) var(--sl-spacing-medium);
    border-radius: var(--sl-border-radius-medium);
    cursor: grab;
    transition: border-color 0.2s ease, color 0.2s ease;
  }

  .field-item:hover {
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-primary-600);
  }

  .canvas-item {
    background: var(--sl-color-neutral-0);
    border: 1px solid var(--sl-color-neutral-200);
    padding: var(--sl-spacing-small) var(--sl-spacing-medium);
    border-radius: var(--sl-border-radius-medium);
    cursor: pointer;
  }

  .canvas-item.selected {
    border-color: var(--sl-color-primary-500);
    box-shadow: 0 0 0 2px var(--sl-color-primary-100);
  }

  .canvas-item.drag-over {
    border-top: 3px solid var(--sl-color-primary-500);
  }

  .canvas-drop-zone {
    height: var(--sl-spacing-small);
    border-radius: var(--sl-border-radius-small);
  }

  .canvas-drop-zone.active {
    background: var(--sl-color-primary-100);
  }

  .canvas-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--sl-spacing-small);
  }

  .canvas-item-type {
    font-size: var(--sl-font-size-x-small);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--sl-color-neutral-500);
  }

  .canvas-item-label {
    font-weight: var(--sl-font-weight-semibold);
  }

  .canvas-preview {
    pointer-events: none;
  }

  .canvas-preview de-form {
    display: block;
  }

  .canvas-preview .footer-controls {
    display: none;
  }

  .canvas-preview .form-control {
    margin-bottom: 0;
  }

  .empty-state {
    text-align: center;
    color: var(--sl-color-neutral-500);
    margin-top: var(--sl-spacing-x-large);
  }

  .preview-card {
    max-width: 900px;
    margin: 0 auto;
    background: var(--sl-color-neutral-0);
    padding: var(--sl-spacing-large);
    border-radius: var(--sl-border-radius-large);
    box-shadow: var(--sl-shadow-medium);
  }

  .properties-group {
    margin-bottom: var(--sl-spacing-large);
    padding: var(--sl-spacing-medium);
    border: 1px solid var(--sl-color-neutral-200);
    border-radius: var(--sl-border-radius-medium);
    background: var(--sl-color-neutral-50);
    box-shadow: var(--sl-shadow-x-small);
  }

  .properties-group h3 {
    margin: 0 0 var(--sl-spacing-small);
    font-size: var(--sl-font-size-small);
    color: var(--sl-color-neutral-600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;
