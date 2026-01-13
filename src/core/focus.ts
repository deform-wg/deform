import type { DeForm } from '../typedefs/index.js';

/**
 * Focuses a form field by name.
 * Safely handles cases where the field doesn't exist or doesn't support focus.
 */
export function focus(this: DeForm, fieldName: string): void {
  if (!fieldName) return;
  const node = (this as any).shadowRoot.querySelector(`[name=${fieldName}]`) as HTMLElement | null;

  if (!node) {
    console.warn(`field focus issue: ${fieldName} not found`);
    return;
  }

  if (!node.focus || typeof node.focus !== 'function') {
    console.warn(`field focus issue: focus method does not exist for ${fieldName}`);
    return;
  }

  node.focus();
}
