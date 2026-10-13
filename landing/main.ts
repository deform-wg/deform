import '../src/index.js';
import { deform } from '../src/deform.js';
import type { FieldConfig, FormConfig } from '../src/typedefs/index.js';

type ExampleSize = 'small' | 'big' | 'all';
type ExampleTab = 'form' | 'code';

const examples: Record<ExampleSize, { label: string; description: string; fields: FieldConfig[] }> =
  {
    small: {
      label: 'Small form',
      description: 'Three questions, one concise configuration.',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Your name',
          required: true,
          placeholder: 'Your name',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email address',
          required: true,
          placeholder: 'you@example.com',
        },
        { name: 'message', type: 'textarea', label: 'Message', rows: 3, placeholder: 'Say hello' },
      ],
    },
    big: {
      label: 'Big form',
      description: 'A fuller intake form that changes when you select Invoice.',
      fields: [
        { name: 'contact', type: 'text', label: 'Contact name', required: true },
        { name: 'email', type: 'email', label: 'Email address', required: true },
        { name: 'company', type: 'text', label: 'Organisation name', required: true },
        {
          name: 'team',
          type: 'select',
          label: 'Team size',
          options: [
            { value: 'small', label: '1–10 people' },
            { value: 'medium', label: '11–50 people' },
            { value: 'large', label: 'More than 50' },
          ],
        },
        {
          name: 'project',
          type: 'radio',
          label: 'What are you building?',
          options: [
            { value: 'website', label: 'A website' },
            { value: 'app', label: 'An application' },
          ],
        },
        {
          name: 'billing',
          type: 'select',
          label: 'Preferred billing method',
          value: 'card',
          options: [
            { value: 'card', label: 'Card' },
            { value: 'invoice', label: 'Invoice' },
          ],
        },
        {
          name: 'purchaseOrder',
          type: 'text',
          label: 'Purchase order number',
          placeholder: 'Optional reference',
          revealOn: ['billing', '=', 'invoice'],
        },
        { name: 'details', type: 'textarea', label: 'Tell us about the project', rows: 3 },
      ],
    },
    all: {
      label: 'All fields',
      description: 'Every supported field type, rendered by the same component.',
      fields: [
        { name: 'text', type: 'text', label: 'Text', placeholder: 'A short answer' },
        { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com' },
        { name: 'password', type: 'password', label: 'Password (demo only)', passwordToggle: true },
        { name: 'number', type: 'number', label: 'Number', min: 0, max: 100 },
        { name: 'textarea', type: 'textarea', label: 'Long text', rows: 2 },
        { name: 'date', type: 'date', label: 'Date' },
        { name: 'color', type: 'color', label: 'Color', defaultTo: '#d3ff5a' },
        {
          name: 'seedphrase',
          type: 'seedphrase',
          label: 'Seed phrase (disabled in demo)',
          help: 'Never enter real recovery words into a demo.',
          disabled: true,
          rows: 2,
        },
        {
          name: 'select',
          type: 'select',
          label: 'Select',
          options: [
            { value: 'one', label: 'First option' },
            { value: 'two', label: 'Second option' },
          ],
        },
        {
          name: 'radio',
          type: 'radio',
          label: 'Radio group',
          options: [
            { value: 'one', label: 'First choice' },
            { value: 'two', label: 'Second choice' },
          ],
        },
        {
          name: 'radioButton',
          type: 'radioButton',
          label: 'Radio buttons',
          options: [
            { value: 'one', label: 'First' },
            { value: 'two', label: 'Second' },
          ],
        },
        { name: 'checkbox', type: 'checkbox', label: 'Checkbox' },
        { name: 'toggle', type: 'toggle', label: 'Toggle' },
        {
          name: 'toggleField',
          type: 'toggleField',
          label: 'Switchable field',
          labels: ['Use email instead', 'Use text instead'],
          fields: [
            { name: 'alternateText', type: 'text', label: 'Text variant' },
            { name: 'alternateEmail', type: 'email', label: 'Email variant' },
          ],
        },
        { name: 'range', type: 'range', label: 'Range', min: 0, max: 100, step: 5 },
        { name: 'rating', type: 'rating', label: 'Rating', max: 5 },
      ],
    },
  };

const buildConfig = (size: ExampleSize): FormConfig => ({
  theme: 'dark',
  accent: 'lime',
  sections: [
    {
      name: size === 'all' ? 'field types' : 'example',
      submitLabel: 'Save example',
      fields: examples[size].fields,
    },
  ],
});

let currentSize: ExampleSize = 'small';
let currentTab: ExampleTab = 'form';
const code = document.querySelector<HTMLElement>('#code-example');
const description = document.querySelector<HTMLElement>('#form-description');
const formLabel = document.querySelector<HTMLElement>('#form-label');
const codeDescription = document.querySelector<HTMLElement>('#code-description');
const feedback = document.querySelector<HTMLElement>('#demo-feedback');
const copyButton = document.querySelector<HTMLButtonElement>('#copy-code');

function updateExample(size: ExampleSize) {
  currentSize = size;
  const config = buildConfig(size);
  // Each selection has its own config and a fresh component instance.
  const oldForm = document.querySelector('#example-form');
  if (oldForm) {
    const form = new deform();
    form.id = 'example-form';
    form.fields = config;
    form.onSubmit = async () => {
      if (feedback)
        feedback.textContent = 'Saved in this browser example only. Nothing was sent anywhere.';
    };
    oldForm.replaceWith(form);
  }
  if (formLabel) formLabel.textContent = examples[size].label;
  if (description) description.textContent = examples[size].description;
  if (codeDescription)
    codeDescription.textContent = `Configuration for ${examples[size].label.toLowerCase()} only.`;
  if (code) code.textContent = JSON.stringify(config, null, 2);
  if (copyButton) copyButton.textContent = 'Copy configuration';
  if (feedback) feedback.textContent = 'This is a local example. Nothing is submitted to a server.';
  document.querySelectorAll<HTMLButtonElement>('[data-context]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.context === size));
  });
}

function showTab(tab: ExampleTab, moveFocus = false) {
  currentTab = tab;
  for (const name of ['form', 'code'] as const) {
    const button = document.querySelector<HTMLButtonElement>(`#tab-${name}`);
    const panel = document.querySelector<HTMLElement>(`#panel-${name}`);
    const selected = name === tab;
    button?.setAttribute('aria-selected', String(selected));
    button?.setAttribute('tabindex', selected ? '0' : '-1');
    if (panel) panel.hidden = !selected;
  }
  if (moveFocus) document.querySelector<HTMLButtonElement>(`#tab-${tab}`)?.focus();
}

for (const tab of ['form', 'code'] as const) {
  document.querySelector(`#tab-${tab}`)?.addEventListener('click', () => showTab(tab));
}
document.querySelector('.demo-tabs')?.addEventListener('keydown', (event) => {
  if (!(event instanceof KeyboardEvent)) return;
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  showTab(
    event.key === 'Home'
      ? 'form'
      : event.key === 'End'
        ? 'code'
        : currentTab === 'form'
          ? 'code'
          : 'form',
    true,
  );
});
document.querySelectorAll<HTMLButtonElement>('[data-context]').forEach((button) => {
  button.addEventListener('click', () => {
    if (
      button.dataset.context === 'small' ||
      button.dataset.context === 'big' ||
      button.dataset.context === 'all'
    ) {
      updateExample(button.dataset.context);
    }
  });
});
copyButton?.addEventListener('click', async () => {
  if (!code?.textContent) return;
  try {
    await navigator.clipboard.writeText(code.textContent);
    copyButton.textContent = 'Copied';
    window.setTimeout(() => {
      copyButton.textContent = 'Copy configuration';
    }, 1800);
  } catch {
    copyButton.textContent = 'Select the text to copy';
  }
});

updateExample(currentSize);
