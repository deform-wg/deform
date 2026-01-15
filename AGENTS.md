# Agent / AI editing guidelines

This repository is TypeScript-first and aims to keep types *sound* without relying on escape hatches.

## Before writing code

Before implementing any changes, ensure you understand:

1. **The overall concept** — What problem is being solved? How does this fit into the broader system? Read relevant source files and existing patterns before proposing solutions.

2. **Related workflows** — What other parts of the codebase does this touch? Trace through how data flows and how components interact. Check for existing utilities or patterns that should be reused.

3. **Acceptance criteria** — What defines "done"? If criteria aren't explicit, clarify them before starting. Consider edge cases, error states, and how the change will be tested.

Do not start writing code until these three points are clear. Ask clarifying questions if needed—it's better to understand the goal upfront than to build the wrong thing.

## Architecture patterns

This codebase uses specific patterns that must be followed:

- **`bindToClass` for methods** — Core methods are defined in separate files (e.g., `core/handlers.ts`) and bound to the `DeForm` instance via `bindToClass()` in the constructor. New methods follow this pattern rather than being defined directly on the class.

- **Dynamic property keys** — Form field state uses computed property names:
  - `_fieldName` — current value
  - `__fieldName` — original value (for dirty checking)
  - `__fieldName_is_dirty` — dirty flag
  - `_fieldName_variant` — toggle-field variant index
  - `_fieldName_reveal_condition_met` — visibility flag
  - Use `propKeys(fieldName)` to generate these consistently.

- **`this: DeForm` typed functions** — Many exported functions use TypeScript's `this` parameter typing. These must be called with `.call(deFormInstance, ...)` or bound before use.

- **Lit reactive properties** — Field values are stored as Lit reactive properties created dynamically via `createProperty()`. Use the `getDynFormValue`/`setDynFormValue` helpers to access them type-safely.

## File organization

- **`core/`** — Form logic, state management, event handling, submission
- **`renders/`** — Lit templates for the form and individual field types
- **`renders/fields/`** — One file per field type (text, select, checkbox, etc.)
- **`utils/`** — Reusable helpers not specific to form logic
- **`typedefs/`** — Shared TypeScript types and interfaces
- **`theme/`** — Styling and theming (CSS-in-JS)

New code should go in the appropriate directory. If adding a new field type, create a new file in `renders/fields/` following existing patterns.

## TypeScript rules (project conventions)

- **No `any`**
  - Prefer generics, `unknown` + narrowing, discriminated unions, or precise interfaces/types.
  - If you truly don't know a value's shape at runtime, model it as `unknown` and validate.

- **Avoid type assertions (`as ...`, `<T>value`)**
  - Existing code may contain assertions; do not introduce new ones unless there is no practical alternative.
  - Prefer:
    - user-defined type guards (`function isX(value: unknown): value is X { ... }`)
    - runtime validation (narrowing via `typeof`, `in`, `Array.isArray`, etc.)
    - `satisfies` for object literals instead of asserting
    - explicit types (or refactors) that let TypeScript infer the right thing without assertions

- **Avoid non-null assertions (`!`)**
  - Prefer explicit null-handling and early returns.

- **Prefer type-only imports**
  - Use `import type { ... } from ...` where possible.

- **Exports should be stable and explicit**
  - Prefer named exports.
  - Consider explicit return types for exported functions to prevent accidental public API drift.

## Error handling

- Throw descriptive errors for invalid states (e.g., `"dynamic-form checkValidity called without providing form Node"`).
- Use early returns with `console.warn()` for recoverable issues (e.g., field not found when focusing).
- Wrap user-provided callbacks in try/catch to prevent external errors from breaking form functionality.

## Dependencies

- **Lit** — Web component framework. All rendering uses Lit's `html` template literals.
- **Shoelace** — UI component library. Use existing Shoelace components (`sl-input`, `sl-select`, `sl-button`, etc.) rather than custom HTML elements.
- When adding new dependencies, prefer the package manager (`npm install`) with the latest version. Do not invent version numbers.

## Linting / formatting

- **Biome is the primary linter/formatter**
  - Run `npm run lint` before committing changes.
  - Use `npm run lint:fix` to auto-fix formatting and many lint issues.
  - Keep formatting/lint compatible with TypeScript `strict` settings in `tsconfig.json`.

- **ESLint is retained for a small set of TypeScript-only rules**
  - In particular: banning type assertions and other TS-specific guardrails Biome can't currently express.

## Testing

Tests use Vitest with happy-dom. Test files live in `__tests__/` directories adjacent to the code they test.

### When to write tests

**Always test:**
- Business logic and state management (e.g., `diff.ts`, `props.ts`, `submit.ts`)
- Event handling and dispatching (e.g., `events.ts`, `handlers.ts`)
- Utility functions with meaningful behavior (e.g., `debounce.ts`, `timeout.ts`, `dom-guards.ts`)
- Component rendering logic and field renderers
- Public API methods on the main component
- Error handling paths and edge cases

**Skip tests for:**
- Pure CSS/styling modules (e.g., `theme/styles.ts`, `theme/accents.ts`)
- Simple re-export index files that just aggregate exports
- Trivial one-line wrappers with no logic

### Test style

- One `describe` block per module or logical group
- Test names should describe the behavior: `"marks field as dirty when current value differs"`
- Use `vi.fn()` and `vi.spyOn()` for mocking
- Use `vi.useFakeTimers()` for time-dependent tests
- For functions with `this: DeForm` typing, use `.call(deFormInstance, ...)` to invoke them

## Verification after changes

After making any code changes, run all three checks before considering the work complete:

1. **TypeScript type checking**: `npm run type-check`
2. **Linting**: `npm run lint`
3. **Tests**: `npx vitest run`

All three must pass. Do not rely on just one check—TypeScript errors, lint violations, and test failures can each catch different issues.
