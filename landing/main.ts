import '../src/index.js';
import { deform } from '../src/deform.js';
import type { FieldConfig, FormConfig } from '../src/typedefs/index.js';

type CustomerType = 'person' | 'organisation';
type ExampleTab = 'form' | 'code';

// This is application data: the form is assembled from the selected record type.
const intakeData: {
  common: FieldConfig[];
  byCustomerType: Record<CustomerType, { description: string; fields: FieldConfig[] }>;
} = {
  common: [
    {
      name: 'contact',
      type: 'text',
      label: 'Contact name',
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
  ],
  byCustomerType: {
    person: {
      description: 'A few details for an individual customer.',
      fields: [
        {
          name: 'project',
          type: 'select',
          label: 'What are you planning?',
          required: true,
          options: [
            { value: 'website', label: 'A website' },
            { value: 'application', label: 'An application' },
            { value: 'other', label: 'Something else' },
          ],
        },
        {
          name: 'timeline',
          type: 'select',
          label: 'When would you like to start?',
          options: [
            { value: 'soon', label: 'As soon as possible' },
            { value: 'later', label: 'In a few months' },
            { value: 'exploring', label: 'Just exploring' },
          ],
        },
        {
          name: 'details',
          type: 'textarea',
          label: 'Tell us a little more',
          placeholder: 'What are you working on?',
          rows: 3,
        },
      ],
    },
    organisation: {
      description: 'A different set of questions for an organisation.',
      fields: [
        {
          name: 'company',
          type: 'text',
          label: 'Organisation name',
          required: true,
          placeholder: 'Company or team name',
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
        {
          name: 'details',
          type: 'textarea',
          label: 'What does your team need?',
          placeholder: 'Tell us about the project',
          rows: 3,
        },
      ],
    },
  },
};

const buildConfig = (type: CustomerType): FormConfig => ({
  theme: 'light',
  accent: 'sky',
  sections: [
    {
      name: 'intake',
      submitLabel: 'Save example',
      fields: [...intakeData.common, ...intakeData.byCustomerType[type].fields],
    },
  ],
});

let currentType: CustomerType = 'person';
let currentTab: ExampleTab = 'form';
const code = document.querySelector<HTMLElement>('#code-example');
const description = document.querySelector<HTMLElement>('#form-description');
const codeDescription = document.querySelector<HTMLElement>('#code-description');
const feedback = document.querySelector<HTMLElement>('#demo-feedback');
const copyButton = document.querySelector<HTMLButtonElement>('#copy-code');

function updateExample(type: CustomerType) {
  currentType = type;
  const config = buildConfig(type);
  // A fresh instance keeps the two sample customer records independent.
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
  if (description) description.textContent = intakeData.byCustomerType[type].description;
  if (codeDescription)
    codeDescription.textContent = `Generated for ${type === 'person' ? 'an individual' : 'an organisation'} from the selected application state.`;
  if (code) code.textContent = JSON.stringify(config, null, 2);
  if (feedback) feedback.textContent = 'This is a local example. Nothing is submitted to a server.';
  document.querySelectorAll<HTMLButtonElement>('[data-context]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.context === type));
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
    if (button.dataset.context === 'person' || button.dataset.context === 'organisation') {
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

updateExample(currentType);
