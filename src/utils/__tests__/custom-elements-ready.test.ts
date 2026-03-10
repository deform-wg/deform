import { describe, expect, it, vi } from 'vitest';
import { customElementsReady } from '../custom-elements-ready.js';

describe('custom-elements-ready', () => {
  it('waits for unique custom elements', async () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <sl-input></sl-input>
      <sl-input></sl-input>
      <x-widget></x-widget>
    `;

    const whenDefined = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('customElements', { whenDefined });

    await customElementsReady(container);

    expect(whenDefined).toHaveBeenCalledTimes(2);
    expect(whenDefined).toHaveBeenCalledWith('sl-input');
    expect(whenDefined).toHaveBeenCalledWith('x-widget');
  });
});
