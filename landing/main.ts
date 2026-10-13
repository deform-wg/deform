import '../src/index.js';
import type { deform } from '../src/deform.js';

const form = document.querySelector<deform>('#example-form');
const feedback = document.querySelector<HTMLElement>('#demo-feedback');
if (form) {
  form.fields = {
    theme: 'light',
    accent: 'sky',
    sections: [
      {
        name: 'profile',
        submitLabel: 'Save details',
        fields: [
          {
            name: 'name',
            type: 'text',
            label: 'Your name',
            placeholder: 'Ada Lovelace',
            required: true,
          },
          {
            name: 'account',
            type: 'select',
            label: 'Account type',
            value: 'personal',
            options: [
              { value: 'personal', label: 'Personal' },
              { value: 'business', label: 'Business' },
            ],
          },
          {
            name: 'company',
            type: 'text',
            label: 'Company name',
            placeholder: 'Your company',
            revealOn: ['account', '=', 'business'],
          },
        ],
      },
    ],
  };
  form.onSubmit = async () => {
    if (feedback)
      feedback.textContent = 'Saved in this browser demo only. Nothing was sent anywhere.';
  };
}

const copyButton = document.querySelector<HTMLButtonElement>('#copy-code');
copyButton?.addEventListener('click', async () => {
  const code = document.querySelector('#code-example')?.textContent;
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    copyButton.textContent = 'Copied';
    window.setTimeout(() => {
      copyButton.textContent = 'Copy code';
    }, 1800);
  } catch {
    copyButton.textContent = 'Select code to copy';
  }
});
