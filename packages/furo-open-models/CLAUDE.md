# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Overview

`@furo/open-models` is a standalone TypeScript package providing a protobuf-based reactive model layer. Models are generated from `.proto` files via `protoc-gen-open-models` and built on `FieldNode`, an abstract base class that provides event-driven reactivity, validation, and serialization.

## Commands

```bash
# From packages/furo-open-models/
yarn build           # tsc + tsc-alias + CEM analyze
yarn build:src       # tsc + tsc-alias only
yarn test            # vitest with coverage (Playwright/Chromium browser)
yarn test:watch      # vitest watch mode
yarn test:ui         # vitest UI
yarn lint            # eslint
yarn lint:fix        # eslint --fix
yarn format          # prettier --write
yarn protoc:gen      # regenerate models from test/proto/*.proto
yarn clean           # remove dist/ and coverage/
```

Run a single test file:

```bash
npx vitest run test/unit_tests/INT32.test.ts
```

Tests run in a real Chromium browser via Playwright. Coverage thresholds: statements 39%, branches 34%, functions 41%, lines 39%.

## Architecture

### FieldNode hierarchy

Everything extends `FieldNode` (`src/FieldNode.ts`, ~2000 lines):

```
FieldNode (abstract base)
  ├── Primitives: BOOLEAN, INT32, INT64, SINT32, SINT64, UINT32, UINT64, FLOAT, DOUBLE, STRING, BYTES, ENUM
  ├── Proxies: ARRAY<T>, MAP<K,V>, RECURSION
  ├── Well-known types: Timestamp, Duration, Any, Struct, FieldMask, *Value wrappers
  └── Generated model classes (e.g. CubeEntity)
```

FieldNode provides: event emission (CustomEvent), validation with constraint climbing, pristine/dirty tracking, readonly propagation, and JSON/literal serialization.

### Event system

All field mutations emit typed `CustomEvent`s: `field-value-changed`, `this-field-value-changed`, `state-changed`, `validity-changed`, `array-changed`, `map-changed`, etc. Parent nodes receive child events for climbing validation.

### Serialization

Two naming conventions coexist:
- **camelCase** (JSON standard): `__fromLiteral()` / `__toLiteral()`
- **snake_case** (proto names): `__fromProtoNameJson()` / `__toJson()`

`Mapper.ts` converts between them. Behavior controlled by `OPEN_MODELS_OPTIONS.UseProtoNames`, `EmitUnpopulated`, `EmitDefaultValues`.

### Decorator bindings for Lit components

Three decorator systems in `src/decorators/`:
- **ModelBindings** (`@model.bind(path, event)`, `@model.onEvent()`) — bind component properties to model fields
- **ServiceBindings** (`@service.bindToEvent()`, `@service.onEvent()`) — bind to service lifecycle (request-started, response-received, etc.)
- **fieldBindings** (`@fieldBindings.model()`, `@fieldBindings.onEvent()`) — reusable component bindings keyed by `typeName`

### Registry and validation

- `Registry.ts` — type registry mapping proto type names to constructors. Generated models self-register.
- `Validator.ts` — custom validators and constraints per type name.
- `FieldConstraints.ts` — constraint interface (minimum, maximum, pattern, min_length, max_length, required, etc.)

### Generated models

Generated from `.proto` files into `test/protoc-gen-open-models/`. Each generated model:
1. Defines interfaces `IModelName` (camelCase) and `TModelName` (snake_case)
2. Declares field descriptors in `__meta.nodeFields` with constructors, constraints, and descriptions
3. Creates typed getters/setters
4. Self-registers with `Registry.register('furo.package.TypeName', ClassName)`

### Key config

`OPEN_MODELS_OPTIONS.ts` — global settings for label formatting, proto name usage, and validation message translation.

### ESLint specifics

Some directories are ignored by lint: `src/generated/**`, `src/wc-type-renderer/**`, `src/models/**`, `src/x/models/**`. The `unused-imports/no-unused-imports` rule is off (unlike other TS packages). `import-x/extensions` enforces no `.ts` extensions on imports.
