# Type-Safety Hardening Plan

## Decision

This is a small, single-contributor project, so the upgrade is deliberately a big bang: all selected
checks become errors and the codebase is made clean in the same change. Vite remains the only
build/emission tool; TypeScript is used solely with `--noEmit` for verification.

## Target toolchain

- Replace the non-working ESLint 9 setup with Oxlint plus its type-aware companion,
  `oxlint-tsgolint`.
- Use Oxlint's native TypeScript, React, accessibility, import, promise, Vitest, and Oxc rules.
  Enable type-aware rules and fail on every warning.
- Keep `tsc` as the compiler authority. Oxlint complements it; it does not replace TypeScript's
  checks.
- Type-check application code, Vite/Vitest/plugin configuration, and executable scripts as three
  no-emit projects.

## Compiler policy

Enable and satisfy these checks across every project:

- `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitReturns`,
  `noImplicitOverride`, and `noPropertyAccessFromIndexSignature`.
- `noUncheckedSideEffectImports`, `allowUnreachableCode: false`, `allowUnusedLabels: false`,
  `verbatimModuleSyntax`, `forceConsistentCasingInFileNames`, and `erasableSyntaxOnly`.
- Retain `skipLibCheck` initially: it avoids taking ownership of third-party declaration defects
  while preserving strict checks on this codebase.

Use a shared base config and separate application, Node-tooling, and script projects. Each has
`noEmit: true`; no TypeScript build mode, references, or `.tsbuildinfo` output is needed.

## Code changes required

1. Make asset/config loading an explicitly checked boundary: type `import.meta.glob` results,
   validate required artwork and audio, and eliminate `any` and assertion-based construction.
2. Change lookup helpers to return `undefined` when absence is valid, or use a named throwing helper
   where absence violates a game invariant. Remove casts that claim a missing card, item, or
   character class exists.
3. Model optional state by omission rather than assigning `undefined`; update the XState machine,
   battle transitions, React props, and motion callbacks accordingly.
4. Narrow form data and external/dynamic values from `unknown` before use. Remove the existing
   `@ts-expect-error` and broad casts in `app.tsx`.
5. Fix unsafe array/index access, CSS-module key access, and tests/mocks under the new compiler
   settings. No explicit `any`, non-null assertion, or TypeScript suppression remains without a
   narrowly justified boundary.

## Quality commands

```text
format:check     prettier --check .
lint             oxlint
lint:types:app   tsc -p tsconfig.json --noEmit
lint:types:node  tsc -p tsconfig.node.json --noEmit
lint:types:scripts tsc -p tsconfig.scripts.json --noEmit
lint:types       all three type-check projects
test             vitest run
qa               format check, type checks, Oxlint, then tests
```

`qa` is read-only: formatting writes remain an explicit developer action, never a validation side
effect.

## Acceptance criteria

- Every command above passes with zero diagnostics and no generated TypeScript artifacts.
- All executable TypeScript outside `src` is included in a strict no-emit project.
- ESLint configuration and dependencies are removed; Oxlint is the lint command.
- The type system accurately represents missing dynamic assets, lookups, and state rather than
  concealing them with casts.
