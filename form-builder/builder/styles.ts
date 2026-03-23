import { css } from 'lit';

export const builderStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    font-family: var(--sl-font-sans);
    --sidebar-width: 260px;
    --properties-width: 320px;
    --header-height: 64px;
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
    flex-wrap: wrap;
  }

  .header-actions sl-button::part(base) {
    box-shadow: none;
  }

  .header-actions sl-button:focus-visible::part(base),
  .header-actions sl-button:focus::part(base),
  .header-actions sl-button:active::part(base) {
    box-shadow: none;
    outline: none;
  }

  sl-dialog::part(panel) {
    max-width: 720px;
    max-height: 82vh;
  }

  .code-box {
    border: 1px solid var(--sl-color-neutral-200);
    background: var(--sl-color-neutral-50);
    border-radius: var(--sl-border-radius-medium);
    padding: var(--sl-spacing-medium);
    max-height: 420px;
    overflow: auto;
    user-select: text;
  }

  .code-editor-wrap {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-small);
    max-height: 68vh;
    overflow-y: auto;
  }

  .code-validation {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--sl-color-neutral-0);
  }

  .code-editor-shell {
    display: grid;
    grid-template-columns: auto 1fr;
    border: 1px solid var(--sl-color-neutral-300);
    border-radius: var(--sl-border-radius-medium);
    overflow: hidden;
    background: var(--sl-color-neutral-0);
    height: min(46vh, 420px);
    max-height: 46vh;
    align-items: stretch;
  }

  .code-line-numbers {
    margin: 0;
    padding: var(--sl-spacing-small) var(--sl-spacing-x-small);
    min-width: 3.5rem;
    text-align: right;
    font-family: var(--sl-font-mono);
    font-size: var(--sl-font-size-small);
    line-height: 1.5;
    color: var(--sl-color-neutral-500);
    background: var(--sl-color-neutral-100);
    border-right: 1px solid var(--sl-color-neutral-200);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    user-select: none;
  }

  .code-line-numbers::-webkit-scrollbar {
    display: none;
  }

  .code-line-number {
    height: calc(1em * 1.5);
  }

  .code-editor-textarea {
    box-sizing: border-box;
    width: 100%;
    border: 0;
    outline: none;
    resize: none;
    margin: 0;
    padding: var(--sl-spacing-small);
    min-height: 100%;
    max-height: 100%;
    white-space: pre;
    tab-size: 2;
    overflow: auto;
    font-family: var(--sl-font-mono);
    font-size: var(--sl-font-size-small);
    line-height: 1.5;
    background: transparent;
    color: var(--sl-color-neutral-800);
  }

  .code-editor-textarea:focus {
    box-shadow: inset 0 0 0 2px var(--sl-color-primary-200);
  }

  .code-block {
    margin: 0;
    white-space: pre;
    font-family: var(--sl-font-mono);
    font-size: var(--sl-font-size-small);
    color: var(--sl-color-neutral-800);
  }

  .json-key {
    color: var(--sl-color-primary-700);
  }

  .json-string {
    color: var(--sl-color-emerald-700);
  }

  .json-number {
    color: var(--sl-color-amber-700);
  }

  .json-literal {
    color: var(--sl-color-rose-700);
  }

  .json-punctuation {
    color: var(--sl-color-neutral-500);
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
    min-width: 0;
    background: var(--sl-color-neutral-100);
    padding: var(--sl-spacing-large);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-medium);
  }

  .canvas-list {
    min-height: 100%;
    padding-bottom: calc(var(--sl-spacing-large) * 2);
  }

  .canvas-list::after {
    content: '';
    display: block;
    height: var(--sl-spacing-large);
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

  .section-actions {
    display: flex;
    gap: var(--sl-spacing-small);
  }

  .builder-section-header {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .builder-section-header > div:first-child {
    min-width: 0;
  }

  .builder-section-actions {
    min-width: 0;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .toolbox-grid {
    display: grid;
    gap: var(--sl-spacing-small);
    grid-template-columns: minmax(0, 1fr);
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
    min-height: 44px;
    box-sizing: border-box;
    user-select: none;
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
    position: relative;
    min-height: 44px;
  }

  .canvas-item.selected {
    border-color: var(--sl-color-primary-500);
    box-shadow: 0 0 0 2px var(--sl-color-primary-100);
  }

  .canvas-item.drag-over {
    border-top: 3px solid var(--sl-color-primary-500);
  }

  .canvas-drop-zone {
    height: 0;
    position: relative;
    pointer-events: none;
  }

  .canvas-drop-zone.active::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: calc(-1 * var(--sl-spacing-x-small));
    height: 4px;
    border-radius: var(--sl-border-radius-pill);
    background: var(--sl-color-primary-400);
    box-shadow: 0 0 0 1px var(--sl-color-primary-200);
  }

  .canvas-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--sl-spacing-small);
  }

  .canvas-item-meta {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-x-small);
  }

  .canvas-item-drag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--sl-color-neutral-500);
    cursor: grab;
  }

  .canvas-item-drag:hover {
    color: var(--sl-color-primary-600);
  }

  .canvas-item:active .canvas-item-drag {
    cursor: grabbing;
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

  .mobile-header-button::part(base) {
    box-shadow: none;
  }

  .mobile-fab {
    position: fixed;
    right: max(var(--sl-spacing-medium), env(safe-area-inset-right, 0px));
    bottom: max(var(--sl-spacing-medium), env(safe-area-inset-bottom, 0px));
    z-index: 15;
  }

  .mobile-fab::part(base) {
    width: 3.5rem;
    height: 3.5rem;
    box-shadow: var(--sl-shadow-large);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .mobile-fab::part(label) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    line-height: 1;
  }

  .mobile-drawer {
    --size: min(78vh, 40rem);
  }

  .mobile-drawer::part(panel) {
    border-top-left-radius: var(--sl-border-radius-large);
    border-top-right-radius: var(--sl-border-radius-large);
  }

  .mobile-drawer::part(body) {
    padding-bottom: calc(var(--sl-spacing-large) + env(safe-area-inset-bottom, 0px));
  }

  @media (max-width: 960px) {
    .header {
      padding: 0 var(--sl-spacing-small);
    }

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }

    .main {
      height: calc(100% - var(--header-height));
    }

    .canvas {
      padding: var(--sl-spacing-medium);
      padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px));
    }

    .preview-card {
      padding: var(--sl-spacing-medium);
      border-radius: var(--sl-border-radius-medium);
    }

    .section-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      align-items: flex-start;
      justify-content: stretch;
    }

    .section-header > div:first-child {
      width: 100%;
    }

    .section-actions {
      width: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--sl-spacing-medium);
      margin-top: var(--sl-spacing-small);
    }

    .section-actions sl-button {
      display: block;
      width: 100%;
    }

    .toolbox-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .field-item {
      cursor: pointer;
    }

    .canvas-item-drag {
      opacity: 0.55;
    }

    .import-summary {
      top: var(--sl-spacing-small);
      right: var(--sl-spacing-small);
      width: min(420px, calc(100% - 1rem));
    }
  }
`;
