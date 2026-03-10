import '../src/index.ts';
import { ALL_FIELDS_SECTION } from './demo-all-fields.js';
import { DEMO_FIELDS } from './demo-some-fields.js';

// Wait for the custom element to be registered
function waitForCustomElement() {
  return new Promise((resolve) => {
    if (customElements.get('de-form')) {
      resolve();
    } else {
      // Wait for the next tick to check again
      setTimeout(() => waitForCustomElement().then(resolve), 10);
    }
  });
}

// Initialize the form once the custom element is ready
async function initializeForm() {
  console.log('Initializing form...');
  await waitForCustomElement();
  console.log('Custom element ready');
  const form = document.getElementById('myForm');
  console.log('Form element found', form);
  if (!form) {
    console.error('Form element not found');
    return;
  }

  // Set your default values like so.
  console.log('Setting form values...');
  form.values = {
    first: 'Bob',
    pizza: 'supreme',
    email_address: 'pat@potato.run',
    music: 'rock',
    country_single: 'uk',
    country_multiple: 'us',
    username: 'nugg3t',
    fave_color: '#43a4ff',
  };

  // A small set of fields asking for common user and contact details.
  const formFields = DEMO_FIELDS;
  console.log('Form fields set', formFields);
  // A full set of fields to demo the possibilities
  formFields.sections.push(ALL_FIELDS_SECTION);

  form.fields = formFields;

  // Set some behavioural options
  form.markModifiedFields = true;
  form.allowDiscardChanges = true;
  form.showModifiedCount = true;
  form.requireCommit = true;
  form.orientation = window.innerWidth > 680 ? 'landscape' : 'portrait';
  form.theme = 'dark';
  console.log('Form options set', { form });
  // Have the layout adjust to browser width
  window.addEventListener('resize', () => {
    form.orientation = window.innerWidth > 680 ? 'landscape' : 'portrait';
  });

  // (Optionally, but common) Supply onSubmit handler
  form.onSubmit = (changes, activeForm, deForm) => {
    // There's THREE ways to access the form data at the point of submission

    // 1. The changes argument contains only values that have changed on the active form.
    const activeFormChanges = changes;
    console.log('changes', activeFormChanges);

    // 2. Need the values for all values, not just the active form?
    // deForm.getFormValues() returns all values for all forms, changed or not.
    const allFormValues = deForm.getFormValues();
    console.log('all form values', allFormValues);

    // 3. getState is similar to getFormValues, except that it returns objects for
    // fields that have options (such as select, radio, etc..)
    // Useful if you need to review other properties of the selected
    // object at the time of submission.
    const allFormState = deForm.getState();
    console.log('all form state', allFormState);

    setTimeout(() => {
      // If your stuff was successful, commit the changes.
      // This resets the change tracking of the form, ensuring that
      // any changes from this point on are tracked.
      // Change counts return to 0. Discard changes button disapears.
      deForm.commitChanges(activeForm);

      // if your stuff was unsuccessful, retain the changes.
      // This keeps the form and its change tracking as is.
      // Change counts remain the same. Discard changes remains.
      deForm.retainChanges();
    }, 3000);
  };

  // (Optionally) Supply an onChange handler
  form.onChange = (change, deForm) => {
    console.log('onChange callback executed and was provided:', change);
    // do things..

    // again at this point you can interogate all the values of the form
    // via deForm.getState() and deForm.getFormValues()
    // console.log(deForm.getFormValues());
  };
}

// Start initialization
console.log('Starting initialization...');
initializeForm().catch(console.error);
