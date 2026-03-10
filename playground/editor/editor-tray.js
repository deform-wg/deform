import { css, html, LitElement, nothing } from 'lit';
import { styles } from './styles.ts';
import '../../src/index.ts';

class EditorTray extends LitElement {
  static styles = styles;
  static properties = {
    target: { type: String },
    visible: { type: Boolean, reflect: true },
    dark_mode: { type: Boolean, reflect: true },
    _fields: { type: Array },
    values: { type: Object },
  };
  constructor(options) {
    super();
    this.classList.add('no-transition');

    this._fields = [
      {
        name: 'accent',
        type: 'select',
        label: 'Meow',
        options: [],
      },
      {
        name: 'allow_discard',
        type: 'toggle',
        label: 'Allow Discard',
      },
      {
        name: 'mark_modified',
        type: 'toggle',
        label: 'Mark modified',
      },
      {
        name: 'count_modified',
        type: 'toggle',
        label: 'Count modified',
      },
    ];
  }

  firstUpdated() {
    requestAnimationFrame(() => {
      this.classList.remove('no-transition');
      this.classList.add('ready');
    });

    const demoDeForm = document.getElementById(this.target);

    const { accents, current } = demoDeForm.getAccents();
    const modifiedAccents = accents.map((a) => {
      return {
        label: a.label,
        value: a.name,
      };
    });

    // Set accent options
    const foundIndex = this._fields.findIndex((f) => f.name === 'accent');
    this._fields[foundIndex].options = modifiedAccents;

    this.values = {
      mark_modified: demoDeForm.markModifiedFields,
      allow_discard: demoDeForm.allowDiscardChanges,
      count_modified: demoDeForm.showModifiedCount,
      accent: demoDeForm.accent,
    };
  }

  reflectAccent(a) {
    const form = this.shadowRoot.querySelector('#editorForm');
    form.setValue('accent', a);
  }

  toggle() {
    this.visible = !this.visible;
  }

  toggleDarkMode() {
    this.dark_mode = !this.dark_mode;
  }

  reactToChange = (change, deForm) => {
    const newVals = deForm.getFormValues();
    const demoDeForm = document.getElementById(this.target);
    if (!demoDeForm) {
      console.warn('No target form detected', { target: this.target });
    }
    Object.assign(demoDeForm, {
      allowDiscardChanges: newVals.allow_discard,
      markModifiedFields: newVals.mark_modified,
      showModifiedCount: newVals.count_modified,
    });

    this.values = newVals;
  };

  render() {
    return html`
      <de-form
        id="editorForm"
        accent="pink"
        theme=${this.dark_mode ? 'dark' : 'light'}
        .fields=${{ sections: [{ name: 'controls', fields: this._fields }] }}
        .values=${this.values}
        .onChange=${this.reactToChange}
      ></de-form>
    `;
  }
}

customElements.define('editor-tray', EditorTray);
