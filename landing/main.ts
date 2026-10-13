import '../src/index.js';
import { deform } from '../src/deform.js';
import type { FieldConfig, FormConfig, FormSection } from '../src/typedefs/index.js';

type ExampleId = 'simple' | 'complicated' | 'split' | 'all';
type ExampleTab = 'form' | 'code';
type Example = { label: string; description: string } & (
  | { fields: FieldConfig[] }
  | { sections: FormSection[] }
);

const examples: Record<ExampleId, Example> = {
  simple: {
    label: 'Simple',
    description: 'A profile form. Choose phone to reveal a number field.',
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Full name',
        required: true,
        placeholder: 'Your full name',
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email address',
        required: true,
        placeholder: 'you@example.com',
      },
      {
        name: 'contactMethod',
        type: 'select',
        label: 'Preferred contact method',
        value: 'email',
        options: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
        ],
      },
      {
        name: 'phone',
        type: 'text',
        label: 'Phone number',
        placeholder: '+61 400 000 000',
        revealOn: ['contactMethod', '=', 'phone'],
      },
    ],
  },
  complicated: {
    label: 'Complicated',
    description: 'Account and project details. Invoice reveals a purchase order field.',
    fields: [
      { name: 'contact', type: 'text', label: 'Contact name', required: true },
      { name: 'email', type: 'email', label: 'Email address', required: true },
      { name: 'company', type: 'text', label: 'Organisation name', required: true },
      {
        name: 'password',
        type: 'password',
        label: 'Account password (demo only)',
        help: '8–32 letters or numbers. This example never sends the password.',
        required: true,
        minlength: 8,
        maxlength: 32,
        pattern: '[A-Za-z0-9]{8,32}',
        passwordToggle: true,
        requireConfirmation: true,
      },
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
        name: 'expectedUsers',
        type: 'number',
        label: 'Expected users',
        min: 1,
        max: 10000,
        step: 1,
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
  split: {
    label: 'Split sections',
    description: 'One configuration, three sections you can move between.',
    sections: [
      {
        name: 'Contact',
        submitLabel: 'Save contact',
        fields: [
          { name: 'fullName', type: 'text', label: 'Full name', required: true },
          { name: 'contactEmail', type: 'email', label: 'Email address', required: true },
        ],
      },
      {
        name: 'Project',
        submitLabel: 'Save project',
        fields: [
          { name: 'projectName', type: 'text', label: 'Project name', required: true },
          { name: 'projectSummary', type: 'textarea', label: 'What are you making?', rows: 3 },
        ],
      },
      {
        name: 'Preferences',
        submitLabel: 'Save preferences',
        fields: [
          { name: 'updates', type: 'checkbox', label: 'Send me project updates' },
          {
            name: 'contactMethod',
            type: 'select',
            label: 'Preferred contact method',
            options: [
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
            ],
          },
        ],
      },
    ],
  },
  all: {
    label: 'All fields',
    description: 'All 15 field types, grouped into sections with side tabs.',
    sections: [
      {
        name: 'Inputs',
        submitLabel: 'Save inputs',
        fields: [
          { name: 'text', type: 'text', label: 'Text', placeholder: 'A short answer' },
          { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com' },
          {
            name: 'password',
            type: 'password',
            label: 'Password (demo only)',
            passwordToggle: true,
          },
          { name: 'number', type: 'number', label: 'Number', min: 0, max: 100 },
          { name: 'textarea', type: 'textarea', label: 'Long text', rows: 2 },
          { name: 'date', type: 'date', label: 'Date' },
          { name: 'color', type: 'color', label: 'Color', defaultTo: '#d3ff5a' },
        ],
      },
      {
        name: 'Choices',
        submitLabel: 'Save choices',
        fields: [
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
        ],
      },
      {
        name: 'Other',
        submitLabel: 'Save other fields',
        fields: [
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
    ],
  },
};

const buildConfig = (choice: ExampleId): FormConfig => {
  const example = examples[choice];
  return {
    theme: 'dark',
    accent: 'lime',
    ...(choice === 'split'
      ? { orientation: 'portrait' as const }
      : choice === 'all'
        ? { orientation: 'landscape' as const }
        : {}),
    sections:
      'sections' in example
        ? example.sections
        : [
            {
              name: choice === 'all' ? 'field types' : 'example',
              submitLabel: 'Save example',
              fields: example.fields,
            },
          ],
  };
};

let currentChoice: ExampleId = 'simple';
let currentTab: ExampleTab = 'form';
const code = document.querySelector<HTMLElement>('#code-example');
const description = document.querySelector<HTMLElement>('#form-description');
const formLabel = document.querySelector<HTMLElement>('#form-label');
const codeDescription = document.querySelector<HTMLElement>('#code-description');
const feedback = document.querySelector<HTMLElement>('#demo-feedback');
const copyButton = document.querySelector<HTMLButtonElement>('#copy-code');

function updateExample(choice: ExampleId) {
  currentChoice = choice;
  const config = buildConfig(choice);
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
    if (config.sections.length > 1) {
      void form.updateComplete.then(async () => {
        await customElements.whenDefined('sl-tab-group');
        const tabs = form.shadowRoot?.querySelector('sl-tab-group');
        if (form.isConnected && tabs && !tabs.querySelector('sl-tab[active]')) {
          await tabs.updateComplete;
          tabs.show(config.sections[0].name);
        }
      });
    }
  }
  if (formLabel) formLabel.textContent = examples[choice].label;
  if (description) description.textContent = examples[choice].description;
  if (codeDescription)
    codeDescription.textContent = `Configuration for ${examples[choice].label.toLowerCase()} only.`;
  if (code)
    code.textContent = `const config = ${JSON.stringify(config, null, 2)};

// Usage (Lit template; currentStateFromDB is your saved values)
html\`
  <de-form
    .fields=\${config}
    .values=\${currentStateFromDB}
  ></de-form>
\`;`;
  if (copyButton) copyButton.textContent = 'Copy configuration';
  if (feedback) feedback.textContent = 'This is a local example. Nothing is submitted to a server.';
  document.querySelectorAll<HTMLButtonElement>('[data-context]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.context === choice));
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
      button.dataset.context === 'simple' ||
      button.dataset.context === 'complicated' ||
      button.dataset.context === 'split' ||
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

updateExample(currentChoice);
