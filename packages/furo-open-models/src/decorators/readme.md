# Open Models

This module provides decorators and utilities for binding Lit components to service events and model data.

## Table of Contents

- [Service Bindings](#service-bindings)
  - [bindToEvent](#bindtoevent)
  - [onEvent](#onevent)
- [Model Bindings](#model-bindings)
  - [bind](#bind)
  - [onEvent (Model)](#onevent-model)
  - [onFieldEvent](#onfieldevent)
- [Initial Render](#initial-render)
- [Event Reference](#event-reference)

---

## Service Bindings

Service bindings connect your component to events from an entity service (e.g., API loading states, errors, responses).

### Setup

First, create service bindings for your entity service:

```typescript
// ServiceDecorators.ts
import { serviceBindings } from "@x/furo/open-models/ServiceDecorators";
import { cubeEntityService, CubeServiceEventMap } from "./CubeEntityService";

export const cubeService = serviceBindings<CubeServiceEventMap>(cubeEntityService);
```

### bindToEvent

Binds a `@state()` property to a service event. When the event fires, the property is automatically updated from `event.detail`.

```typescript
import { cubeService } from "./DataStores/Decorators";

class MyComponent extends LitElement {
  // Automatically updates when the service's busy state changes
  @cubeService.bindToEvent("busy-changed")
  @state()
  private busy: boolean = false;

  render() {
    return html`
      <lgt-busy-indicator-block ?busy="${this.busy}">
        <!-- content -->
      </lgt-busy-indicator-block>
    `;
  }
}
```

**How it works:**
- Listens to the specified event on the service
- Extracts the value from `event.detail` (key is inferred from event name, e.g., `"busy-changed"` → `detail.busy`)
- Updates the property, triggering a Lit re-render

### onEvent

Binds a method to a service event. When the event fires, the method is called with `event.detail`, which contains the FieldNode of the triggering field,  as argument.

```typescript
import { cubeService } from "./DataStores/Decorators";

class MyComponent extends LitElement {
  @cubeService.onEvent("data-loaded")
  private onDataLoaded() {
    console.log("Cube data loaded!");
    this.showSuccessToast();
  }

  @cubeService.onEvent("error-5xx")
  private onServerError(detail: { serverResponse: Response }) {
    console.error("Server error:", detail.serverResponse.status);
    this.showErrorDialog();
  }

  @cubeService.onEvent("request-aborted")
  private onAborted(detail: { reason: string }) {
    console.log("Request aborted:", detail.reason);
  }
}
```

---

## Model Bindings

Model bindings connect your component to a FieldNode model's data and events.

### Setup

Create model bindings for your entity model:

```typescript
// ServiceDecorators.ts
import { modelBindings } from "@x/furo/open-models/ModelDecorators";
import { CubeEntityModel } from "./CubeEntityModel";

export const cubeModel = modelBindings(CubeEntityModel.model);
```

### bind

Binds a `@state()` property to a model field value. Handles both initial synchronization and subsequent updates.

```typescript
import { cubeModel } from "./DataStores/Decorators";

class MyComponent extends LitElement {
  // Bind to a nested field value
  @cubeModel.bind("cube.length")
  @state()
  private cubeLength: number = 0;

  // Bind to model validity state
  @cubeModel.bind("__isValid", "validity-changed")
  @state()
  private isValid: boolean = true;

  // Bind to display name
  @cubeModel.bind("displayName", "this-field-value-changed")
  @state()
  private displayName: string = "";

  render() {
    return html`
      <span>Length: ${this.cubeLength}</span>
      <span>Name: ${this.displayName}</span>
      <button ?disabled="${!this.isValid}">Save</button>
    `;
  }
}
```

**Parameters:**
- `path` - Path to the field (e.g., `"cube.length"`, `"__isValid"`, `"displayName"`)
- `eventType` - Event to listen for (defaults to `"this-field-value-changed"`)

### onEvent (Model)

Binds a method to an event on the root model.

```typescript
import { cubeModel } from "./DataStores/Decorators";

class MyComponent extends LitElement {
  // React to any field value change
  @cubeModel.onEvent("field-value-changed")
  private onAnyFieldChanged() {
    console.log("Something changed in the model!");
  }

  // React to validity changes
  @cubeModel.onEvent("validity-changed")
  private onValidityChanged() {
    console.log("Model validity changed!");
  }
}
```

### onFieldEvent

Binds a method to an event on a specific field.

```typescript
import { cubeModel } from "./DataStores/Decorators";

class MyComponent extends LitElement {
  // React when cube.length specifically changes
  @cubeModel.onFieldEvent("cube.length", "this-field-value-changed")
  private onLengthChanged() {
    console.log("Length changed!");
    this.recalculateVolume();
  }

  // React when cube.material changes
  @cubeModel.onFieldEvent("cube.material", "this-field-value-changed")
  private onMaterialChanged() {
    console.log("Material changed!");
  }
}
```

---

## Initial Render

When using **singleton models** (like `CubeEntityModel.model`), the model instance already exists before your component is created. This means the initial values won't automatically trigger a Lit re-render, because Lit only re-renders when `@state()` properties *change*.

### The Problem

```typescript
// The model already has data when the component is created
private cubeEntity = CubeEntityModel.model;

render() {
  // This won't show the initial value - only updates after changes
  return html`<span>${this.cubeEntity.displayName}</span>`;
}
```

### Solution 1: Use `@cubeModel.bind()` (Recommended)

Bind a `@state()` property directly to the model field. The decorator handles both initial synchronization and subsequent updates:

```typescript
import { cubeModel } from "./DataStores/Decorators";

class MyComponent extends LitElement {
  @cubeModel.bind("displayName", "this-field-value-changed")
  @state()
  private displayName: string = "";

  render() {
    // This works for both initial render and updates
    return html`<span>${this.displayName}</span>`;
  }
}
```

**How it works:**
- On `connectedCallback`, the decorator reads the current value from the model and sets the property
- It also listens for the specified event to keep the property in sync with future changes
- Since the property is decorated with `@state()`, any change triggers a Lit re-render

### Solution 2: Use `@cubeService.onEvent("data-loaded")`

If you need to react when data is loaded (e.g., for multiple properties or side effects), use the service event decorator to call `requestUpdate()`:

```typescript
import { cubeService } from "./DataStores/Decorators";

class MyComponent extends LitElement {
  private cubeEntity = CubeEntityModel.model;

  @cubeService.onEvent("data-loaded")
  private onDataLoaded() {
    // Force re-render with current model values
    this.requestUpdate();
  }

  render() {
    return html`<span>${this.cubeEntity.displayName}</span>`;
  }
}
```

**When to use this approach:**
- When you need to access multiple fields from the model without binding each one
- When you have additional logic to run when data loads
- When you want to keep the model reference pattern but still get initial rendering

### Which Solution to Choose?

| Scenario                                    | Recommended Solution                                          |
|---------------------------------------------|---------------------------------------------------------------|
| Single field binding                        | `@cubeModel.bind()`                                           |
| Multiple fields, want reactivity per field  | `@cubeModel.bind()` for each                                  |
| Multiple fields, simpler setup              | `@cubeService.onEvent("data-loaded")` with `requestUpdate()`  |
| Need side effects on data load              | `@cubeService.onEvent("data-loaded")`                         |
| Components expecting FieldNode via `.model` | Direct reference (see below)                                  |

---

## Direct FieldNode References for Component Bindings

Many LGT webcomponents (like `<lgt-om-number-input-form-row>`, `<lgt-om-slider-form-row>`, `<form-enum>`) expect a **FieldNode** object via their `.model` property, not a scalar value. These components handle their own reactivity internally by listening to FieldNode events.

### The Pattern

Instead of using `@cubeModel.bind()` decorators for each field, you can directly reference a parent FieldNode from the singleton model:

```typescript
import { CubeEntityModel, cubeModel } from "@/pages/page-cube-object/data";

class CubeEditorTab extends LitElement {
  /**
   * Reference to the cube definition from the singleton model.
   * This is a FieldNode, not a scalar value.
   */
  cube = CubeEntityModel.model.cube;

  render() {
    return html`
      <!-- These components expect FieldNode objects, not scalar values -->
      <form-enum .model="${this.cube.material}"></form-enum>

      <lgt-om-number-input-form-row .model="${this.cube.length}"></lgt-om-number-input-form-row>
      <lgt-om-number-input-form-row .model="${this.cube.breadth}"></lgt-om-number-input-form-row>
      <lgt-om-number-input-form-row .model="${this.cube.height}"></lgt-om-number-input-form-row>

      <lgt-om-slider-form-row .model="${this.cube.length}"></lgt-om-slider-form-row>
    `;
  }
}
```

### Why This Works

1. **FieldNode objects are reactive**: The model fields (`cube.length`, `cube.breadth`, etc.) are FieldNode instances that emit their own events (`this-field-value-changed`, `update`, etc.)

2. **Components manage their own subscriptions**: LGT form components bind to the FieldNode's events internally and update themselves when the model changes

3. **No decorator overhead**: Since the components handle reactivity, you don't need `@cubeModel.bind()` decorators for each field

4. **Simpler code**: One class property (`cube = CubeEntityModel.model.cube`) gives access to all nested fields

### When to Use Direct References vs Decorators

| Scenario | Approach |
|----------|----------|
| Components with `.model` property expecting FieldNode | Direct reference: `this.cube.length` |
| Display scalar values in templates (e.g., `<span>${value}</span>`) | `@cubeModel.bind()` decorator |
| Need to trigger side effects on field changes | `@cubeModel.onFieldEvent()` decorator |
| Need reactive `@state()` property for conditional rendering | `@cubeModel.bind()` decorator |

### Combining Approaches

You can combine direct references with decorators when needed:

```typescript
class CubeEditorTab extends LitElement {
  // Direct reference for form components
  cube = CubeEntityModel.model.cube;

  // Decorator for color picker (non-FieldNode-aware component)
  @state()
  private color: string = "rgba(254,162,72,1)";

  // React to colour changes for the color picker
  @cubeModel.onFieldEvent("cube.colour", "update")
  private _onColourUpdate() {
    const newColor = this.cube.colour.toString();
    if (this.color !== newColor) {
      this.color = newColor;
    }
  }

  render() {
    return html`
      <!-- FieldNode-aware components use direct reference -->
      <lgt-om-number-input-form-row .model="${this.cube.length}"></lgt-om-number-input-form-row>

      <!-- Non-FieldNode-aware component uses @state property -->
      <lgt-color-picker color="${this.color}" @change="${this.onColorPicked}"></lgt-color-picker>
    `;
  }
}
```

---

## Event Reference

### Service Events

#### Request Lifecycle

| Event              | Detail Type                | Description                          |
|--------------------|----------------------------|--------------------------------------|
| `busy-changed`     | `{ busy: boolean }`        | Loading/saving state changed         |
| `request-started`  | `{ request: unknown }`     | Request has been initiated           |
| `request-finished` | `{ request: unknown }`     | Request completed                    |
| `request-aborted`  | `{ reason: string }`       | Request was aborted                  |

#### Success Events

| Event              | Detail Type                                       | Description                    |
|--------------------|---------------------------------------------------|--------------------------------|
| `response-received`| `{ response: unknown, serverResponse: Response }` | Successful response with data  |
| `raw-response`     | `{ serverResponse: Response }`                    | Raw response before parsing    |

#### Error Events

| Event              | Detail Type                                            | Description                    |
|--------------------|--------------------------------------------------------|--------------------------------|
| `response-error`   | `{ parsedResponse: unknown, serverResponse: Response }`| Error response with parsed body|
| `raw-error`        | `{ serverResponse: Response }`                         | Raw error response             |
| `error-404`        | `{ serverResponse: Response }`                         | Resource not found             |
| `error-5xx`        | `{ serverResponse: Response }`                         | Server error occurred          |
| `fatal-error`      | `{ error: unknown }`                                   | Unhandled error                |

### Model Events

| Event                      | Description                                    |
|----------------------------|------------------------------------------------|
| `update`                   | Model was updated                              |
| `field-value-changed`      | Any field in the model changed                 |
| `this-field-value-changed` | The specific field changed (for field binding) |
| `validity-changed`         | Model validity state changed                   |
| `this-state-changed`       | State changed on this field                    |
| `state-changed`            | State changed on any field                     |
| `array-changed`            | Array field was modified                       |
| `this-array-changed`       | This array field was modified                  |
| `map-changed`              | Map field was modified                         |
| `this-map-changed`         | This map field was modified                    |
| `model-injected`           | Model data was injected                        |
