import { LitElement, ReactiveElement } from "lit";

import type { ModelEventType } from "@/FieldNode";

/**
 * Event map for FieldNode model events.
 * Most events don't have detail - they just notify that something changed.
 *
 * This may look like a copy of the ModelEventType, but is needed for the implementation.
 */
export interface ModelEventMap {
  update: undefined;
  "field-value-changed": unknown;
  "this-field-value-changed": undefined;
  "field-value-updated": unknown;
  "this-state-changed": undefined;
  "state-changed": unknown;
  "validity-changed": undefined;
  "array-changed": unknown;
  "this-array-changed": undefined;
  "map-changed": unknown;
  "this-map-changed": undefined;
  "parent-readonly-set": undefined;
  "parent-readonly-unset": undefined;
  "model-injected": undefined;
}

/**
 * Interface for FieldNode-like objects that support event listening and path navigation.
 */
interface FieldNodeLike {
  __addEventListener(type: string, listener: (e: CustomEvent) => void): void;
  __removeEventListener(type: string, listener: (e: CustomEvent) => void): void;
  __getFieldNodeByPath?(path: string): FieldNodeLike | undefined;
  value?: unknown;
}

// ─────────────────────────────────────────────────────────────────
// Metadata Storage
// ─────────────────────────────────────────────────────────────────

interface BindingMeta {
  model: FieldNodeLike;
  path: string | undefined;
  eventType: ModelEventType;
}
const bindingsMetadata = new WeakMap<object, Map<string, BindingMeta>>();

interface EventBindingMeta {
  propertyKey: string;
  model: FieldNodeLike;
  path: string | null;
  eventType: ModelEventType;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  method: Function;
}

// Symbol keys for instance storage
const MODEL_BIND_LISTENERS = Symbol.for("__modelBindListeners__");
const MODEL_EVENT_LISTENERS = Symbol.for("__modelEventListeners__");
const MODEL_BIND_PATCHED = Symbol.for("__modelBindPatched__");
const MODEL_EVENT_PATCHED = Symbol.for("__modelEventPatched__");
const MODEL_EVENT_METHODS = Symbol.for("__modelEventMethods__");

// ─────────────────────────────────────────────────────────────────
// ModelBindings Factory
// ─────────────────────────────────────────────────────────────────

/**
 * ### ModelBindings Factory
 *
 * Creates type-safe decorators bound to a specific FieldNode model.
 * Use this to bind component properties and methods to model events.
 *
 * Usage:
 * ```typescript
 * import { ModelBindings } from "@x/furo/open-models/ModelDecorators";
 * import { CubeEntityModel } from "./CubeEntityModel";
 *
 * const cubeModel = ModelBindings(CubeEntityModel.model);
 *
 * class MyComponent extends LitElement {
 *   // Triggers re-render on any model update
 *   @cubeModel.bind()
 *   private _modelUpdated: unknown;
 *
 *   // Triggers re-render when cube.length changes
 *   @cubeModel.bind("cube.length")
 *   private cubeLength: unknown;
 *
 *   // Triggers re-render on model validity changes
 *   @cubeModel.bind("__isValid", "validity-changed")
 *   private isValid: unknown;
 *
 *   // React to any field value change on the model
 *   @cubeModel.onEvent("field-value-changed")
 *   private onAnyFieldChanged() {
 *     console.log("Something changed!");
 *   }
 *
 *   // React to a specific field's changes
 *   @cubeModel.onFieldEvent("cube.length", "this-field-value-changed")
 *   private onLengthChanged() {
 *     console.log("Length changed!");
 *   }
 * }
 * ```
 *
 * @param model - The FieldNode model to bind to
 * @returns Object with `bind`, `onEvent`, and `onFieldEvent` decorator factories
 */
export function ModelBindings<TEventMap extends ModelEventMap = ModelEventMap>(model: FieldNodeLike) {
  return {
    /**
     * Triggers a render update when a model event fires.
     * When called without arguments, listens on the model root for the "update" event.
     *
     * @param path - Optional path to a field (e.g., "cube.length"). When omitted, listens on the model root.
     * @param eventType - Event to listen for (defaults to "update")
     */
    bind(path?: string, eventType: ModelEventType = "update") {
      return function bindDecorator(target: object, propertyKey: string) {
        let metadata = bindingsMetadata.get(target);
        if (!metadata) {
          metadata = new Map();
          bindingsMetadata.set(target, metadata);
        }
        metadata.set(propertyKey, { model, path, eventType });

        patchBindLifecycle(target.constructor as typeof ReactiveElement);
      };
    },

    /**
     * Binds a method to an event on the root model.
     * When the event fires, the method is called.
     *
     * @param eventType - The event type to listen for
     */
    onEvent(eventType: keyof TEventMap & ModelEventType) {
      return function onEventDecorator(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- descriptor.value is untyped by design
        const originalMethod: EventBindingMeta["method"] = descriptor.value;
        const ctor = target.constructor as typeof ReactiveElement;

        let methods: EventBindingMeta[] = (ctor as unknown as Record<symbol, EventBindingMeta[]>)[MODEL_EVENT_METHODS];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
        if (!methods) {
          methods = [];
          (ctor as unknown as Record<symbol, EventBindingMeta[]>)[MODEL_EVENT_METHODS] = methods;
        }
        methods.push({ propertyKey, model, path: null, eventType, method: originalMethod });

        patchEventLifecycle(ctor);
      };
    },

    /**
     * Binds a method to an event on a specific field.
     * When the event fires on that field, the method is called.
     *
     * @param path - Path to the field (e.g., "cube.length")
     * @param eventType - The event type to listen for
     */
    onFieldEvent(path: string, eventType: keyof TEventMap & ModelEventType) {
      return function onFieldEventDecorator(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- descriptor.value is untyped by design
        const originalMethod: EventBindingMeta["method"] = descriptor.value;
        const ctor = target.constructor as typeof ReactiveElement;

        let methods: EventBindingMeta[] = (ctor as unknown as Record<symbol, EventBindingMeta[]>)[MODEL_EVENT_METHODS];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
        if (!methods) {
          methods = [];
          (ctor as unknown as Record<symbol, EventBindingMeta[]>)[MODEL_EVENT_METHODS] = methods;
        }
        methods.push({ propertyKey, model, path, eventType, method: originalMethod });

        patchEventLifecycle(ctor);
      };
    },
  };
}

// ─────────────────────────────────────────────────────────────────
// Lifecycle Patching
// ─────────────────────────────────────────────────────────────────

/**
 * Get the field node for a path, handling both direct properties and nested paths.
 */
function getFieldForPath(model: FieldNodeLike, path: string): FieldNodeLike {
  // Check if it's a direct property (starts with __ or no dots)
  if (path.startsWith("__") || !path.includes(".")) {
    return model;
  }
  // Navigate to nested field (we trust the field exists per user guarantee)
  if (model.__getFieldNodeByPath) {
    return model.__getFieldNodeByPath(path)!;
  }
  return model;
}

/**
 * Patch connectedCallback/disconnectedCallback for bind decorators.
 */
function patchBindLifecycle(ctor: typeof ReactiveElement): void {
  if ((ctor as unknown as Record<symbol, boolean>)[MODEL_BIND_PATCHED]) {
    return;
  }
  (ctor as unknown as Record<symbol, boolean>)[MODEL_BIND_PATCHED] = true;

  // eslint-disable-next-line @typescript-eslint/unbound-method -- method is called with .call()
  const originalConnected = ctor.prototype.connectedCallback;
  // eslint-disable-next-line @typescript-eslint/unbound-method -- method is called with .call()
  const originalDisconnected = ctor.prototype.disconnectedCallback;

  ctor.prototype.connectedCallback = function connectedCallback(
    this: LitElement & Record<symbol, Map<string, { listener: (e: CustomEvent) => void; field: FieldNodeLike; eventType: string }>>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    originalConnected?.call(this);

    const metadata = bindingsMetadata.get(Object.getPrototypeOf(this) as object);
    if (!metadata) return;

    const listeners = new Map<string, { listener: (e: CustomEvent) => void; field: FieldNodeLike; eventType: string }>();
    this[MODEL_BIND_LISTENERS] = listeners;

    metadata.forEach(({ model, path, eventType }, propKey) => {
      const field = path ? getFieldForPath(model, path) : model;

      const listener = () => {
        this.requestUpdate();
      };

      listeners.set(propKey, { listener, field, eventType });
      field.__addEventListener(eventType, listener);
    });
  };

  ctor.prototype.disconnectedCallback = function disconnectedCallback(
    this: LitElement & Record<symbol, Map<string, { listener: (e: CustomEvent) => void; field: FieldNodeLike; eventType: string }>>
  ) {
    const listeners = this[MODEL_BIND_LISTENERS];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    if (listeners) {
      listeners.forEach(({ listener, field, eventType }) => {
        field.__removeEventListener(eventType, listener);
      });
      listeners.clear();
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    originalDisconnected?.call(this);
  };
}

/**
 * Patch connectedCallback/disconnectedCallback for event decorators.
 */
function patchEventLifecycle(ctor: typeof ReactiveElement): void {
  if ((ctor as unknown as Record<symbol, boolean>)[MODEL_EVENT_PATCHED]) {
    return;
  }
  (ctor as unknown as Record<symbol, boolean>)[MODEL_EVENT_PATCHED] = true;

  // eslint-disable-next-line @typescript-eslint/unbound-method -- method is called with .call()
  const originalConnected = ctor.prototype.connectedCallback;
  // eslint-disable-next-line @typescript-eslint/unbound-method -- method is called with .call()
  const originalDisconnected = ctor.prototype.disconnectedCallback;

  ctor.prototype.connectedCallback = function connectedCallback(
    this: LitElement & Record<symbol, Map<string, { listener: (e: CustomEvent) => void; field: FieldNodeLike; eventType: string }>>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    originalConnected?.call(this);

    const methods = (this.constructor as unknown as Record<symbol, EventBindingMeta[]>)[MODEL_EVENT_METHODS];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    if (!methods) return;

    const listeners = new Map<string, { listener: (e: CustomEvent) => void; field: FieldNodeLike; eventType: string }>();
    this[MODEL_EVENT_LISTENERS] = listeners;

    methods.forEach(({ propertyKey, model, path, eventType, method }) => {
      // If path is specified, listen on that field; otherwise listen on root model
      const field = path ? getFieldForPath(model, path) : model;

      const listener = (e: CustomEvent) => {
        method.call(this, e.detail);
      };

      listeners.set(propertyKey, { listener, field, eventType });
      field.__addEventListener(eventType, listener);
    });
  };

  ctor.prototype.disconnectedCallback = function disconnectedCallback(
    this: LitElement & Record<symbol, Map<string, { listener: (e: CustomEvent) => void; field: FieldNodeLike; eventType: string }>>
  ) {
    const listeners = this[MODEL_EVENT_LISTENERS];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    if (listeners) {
      listeners.forEach(({ listener, field, eventType }) => {
        field.__removeEventListener(eventType, listener);
      });
      listeners.clear();
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    originalDisconnected?.call(this);
  };
}
