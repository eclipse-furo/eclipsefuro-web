# CLAUDE.md

## Project Overview

Eclipse Furo Web — a monorepo of enterprise web components for the Eclipse Furo ecosystem. Components are built on Lit v3 with a custom Flow-Based Programming (FBP) system. Published as `@furo/*` scoped npm packages.

## Setup

```bash
yarn run bootstrap    # REQUIRED: installs deps + symlinks local @furo packages
```

Do NOT use bare `npm install`. The bootstrap script (`scripts/bootstrap.sh`) creates symlinks in `node_modules/@furo/` so local packages resolve each other.

Node.js >= 21.7.3 required.

## Monorepo Structure

**Active JS→TS migration** on branch `feat/switch-to-ts`. Check each package before assuming JS or TS.

## Architecture & Conventions

### Flow-Based Programming (FBP)
Core design pattern. Components connect via named **wires** in HTML templates using `fn-*` attributes. The `@furo/fbp` package provides:
- `FBP(BaseClass)` mixin: `class MyComp extends FBP(LitElement) {}`
- `flow-bind` element: test harness for wiring in tests

### Web Components
- Custom elements use `furo-*` naming convention
- One component per file (e.g., `FuroHorizontalFlex.ts`)
- Package exports from `src/index.ts`
- JSDoc: `@customElement`, `@attribute`, `@slot`, `@summary`

## Commits

Conventional Commits enforced (Lerna changelog/versioning): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`

Husky + lint-staged pre-commit hooks run ESLint + Prettier on staged files.