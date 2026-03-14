# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eclipse Furo Web — a monorepo of enterprise web components for the Eclipse Furo ecosystem. Components are built on Lit v3 with a custom Flow-Based Programming (FBP) system. Published as `@furo/*` scoped npm packages.

## Setup

```bash
yarn run bootstrap    # REQUIRED: installs deps + symlinks local @furo packages
```

Do NOT use bare `npm install`. The bootstrap script (`scripts/bootstrap.sh`) creates symlinks in `node_modules/@furo/` so local packages resolve each other.

Node.js >= 21.7.3 required.

## Monorepo Structure

Managed with Lerna v9 + Yarn workspaces. Key packages:

| Package | Status | Description |
|---|---|---|
| `furo-fbp` | JS (migrating) | Flow-Based Programming core |
| `furo-framework` | JS | Framework utilities (Env, i18n, Iconset, Theme) |
| `furo-layout` | **TS** | Layout web components |
| `furo-channels` | **TS** | Typed pub/sub channel system |
| `furo-data` | JS | Data binding components |
| `furo-route` | **TS** | Client-side routing |
| `furo-util` | JS | Utility components |
| `furo-open-models` | **TS** | Protobuf-based model layer |

**Active JS→TS migration** on branch `feat/switch-to-ts`. Check each package before assuming JS or TS.

### Dependency graph

```
furo-fbp ← furo-framework ← furo-data ← furo-util
  ↑              ↑
furo-layout ─────┘
furo-channels (standalone)
furo-route (standalone, lit only)
furo-open-models (standalone)
```

## Build & Test Commands

### Root level
```bash
yarn test:all              # WTR tests for all JS packages + coverage
yarn test:all:watch        # Watch mode
yarn docs:start            # Hugo docs server
```

### Per-package (run from `packages/<name>/`)
```bash
# TS packages (furo-layout, furo-channels, furo-route)
yarn build          # rimraf dist && tsc && tsc-alias
yarn test           # vitest run --coverage (Playwright/Chromium)
yarn test:watch     # vitest watch
yarn lint           # eslint --ext .ts,.html ./src
yarn format         # prettier './src/**/*.ts' --write

# JS packages (furo-fbp, furo-data, furo-framework, furo-util)
yarn test           # @web/test-runner --coverage
yarn test:watch     # web-test-runner --watch
yarn lint           # eslint + prettier check
yarn format         # eslint --fix + prettier --write
```

## Code Style

### Prettier
- Root (JS packages): 2-space tabs, single quotes, no semicolons, trailing commas (es5)
- TS packages override: double quotes, semicolons, printWidth 160, `arrowParens: "avoid"`

### ESLint
- JS: `@open-wc/eslint-config` + `plugin:lit/recommended`
- TS: `@typescript-eslint` with strict settings, `plugin:lit/all`, `simple-import-sort` (enforced), `no-explicit-any: error`, `unused-imports: error`

### TypeScript config (TS packages)
- `target/module: ES2022`, `moduleResolution: Bundler`, `strict: true`
- `experimentalDecorators: true`, `useDefineForClassFields: false`
- Path alias: `@/*` → `./src/*` (resolved by `tsc-alias` post-build)
- `ts-lit-plugin` for Lit template type checking

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

### Package Output (TS)
Builds to `dist/` with `.js`, `.d.ts`, `.js.map`, `custom-elements.json`, `web-types.json`.

### CEM Analysis (furo-layout)
Three tiers: public API (`analyze`), internal API (`analyze:internal`), deep analysis with web-types (`analyze:deep`).

## Commits

Conventional Commits enforced (Lerna changelog/versioning): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`

Husky + lint-staged pre-commit hooks run ESLint + Prettier on staged files.