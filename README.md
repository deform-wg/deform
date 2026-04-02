# deform

An open-source, config-driven dynamic form renderer built with web components.

## Features

- **Config-driven**: Define forms with simple JSON/TypeScript configuration
- **Change tracking**: Built-in dirty state tracking and change management
- **Multiple field types**: Text, email, password, select, radio, checkbox, date, color, and more
- **TypeScript**: Fully typed with exported type definitions

## Quick Start

Import the package once, then render a form:

```ts
import '@deform-wg/deform';

const form = document.querySelector('de-form');

form.fields = {
  theme: 'light',
  accent: 'sky',
  sections: [
    {
      name: 'profile',
      submitLabel: 'Save',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
        },
      ],
    },
  ],
};
```

The `@deform-wg/deform` entrypoint registers the custom element and loads both Shoelace light/dark theme styles automatically, so the form renders correctly with a single import.

## Installation

```bash
npm install @deform-wg/deform@alpha
```

The component also respects top-level form config such as `theme`, `accent`, `orientation`, `requireCommit`, `markModifiedFields`, `showModifiedCount`, and `allowDiscardChanges`.

If consumers want to switch themes later, they can set `theme: 'light' | 'dark'` in the config or update the `de-form` element's `theme` property directly.

## Development

Install dependencies

```bash
npm install
```

Compile and watch for changes:

```bash
npm run dev
```

Type check:

```bash
npm run type-check
```

Run the form builder locally:

```bash
npm run form-builder
```

Then open http://localhost:8000

## License

MIT

