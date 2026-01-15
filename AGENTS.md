# Agent / AI editing guidelines

This repository is TypeScript-first and aims to keep types *sound* without relying on escape hatches.

## TypeScript rules (project conventions)

- **No `any`**
  - Prefer generics, `unknown` + narrowing, discriminated unions, or precise interfaces/types.
  - If you truly don’t know a value’s shape at runtime, model it as `unknown` and validate.

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

## Linting / formatting

- **Biome is the primary linter/formatter**
  - Run `npm run lint` before committing changes.
  - Use `npm run lint:fix` to auto-fix formatting and many lint issues.
  - Keep formatting/lint compatible with TypeScript `strict` settings in `tsconfig.json`.

- **ESLint is retained for a small set of TypeScript-only rules**
  - In particular: banning type assertions and other TS-specific guardrails Biome can’t currently express.

