 
import { LitElement, ReactiveElement } from "lit";

import type { ModelEventType } from '@/FieldNode';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

/**
 * Interface for FieldNode-like objects that support event listening.
 */
export interface FieldNodeLike {
  __addEventListener(type: string, listener: (e: CustomEvent) => void): void;
  __removeEventListener(type: string, listener: (e: CustomEvent) => void): void;
  __meta?: { typeName?: string };
  value?: unknown;
}

/**
 * Interface for components that bind to FieldNode models.
 *
 * Components implement `modelReaders` and `modelWriters` maps
 * keyed by `__meta.typeName` (e.g., "primitives.STRING", "furo.fat.String").
 *
 * @example
 * ```typescript
 * export class MyInput extends LitElement implements BindableComponent {
 *   @fieldBindings.model()
 *   model: STRING | XString | undefined;
 *
 *   // Provided by decorator
 *   declare writeToModel: () => void;
 *
 *   modelReaders = new Map<string, () => void>([
 *     ["primitives.STRING", () => { this.value = (this.model as STRING).value ?? ""; }],
 *     ["furo.fat.String", () => { this.value = (this.model as XString).value.value ?? ""; }],
 *   ]);
 *
 *   modelWriters = new Map<string, () => void>([
 *     ["primitives.STRING", () => { (this.model as STRING).value = this.value; }],
 *     ["furo.fat.String", () => { (this.model as XString).value.value = this.value; }],
 *   ]);
 * }
 * ```
 */
export interface BindableComponent extends LitElement {
  model: FieldNodeLike | undefined;

  /** Map of typeName → reader function (model → component) */
  modelReaders: Map<string, () => void>;

  /** Map of typeName → writer function (component → model) */
  modelWriters: Map<string, () => void>;

  /** Helper to write current value to model (provided by decorator) */
  writeToModel: () => void;
}

// ─────────────────────────────────────────────────────────────────
// Metadata Storage
// ─────────────────────────────────────────────────────────────────

interface FieldEventMeta {
  propertyKey: string;
  eventType: ModelEventType;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  method: Function;
}

// Symbol keys for class metadata
const FIELD_EVENTS = Symbol.for("__fieldEvents__");
const FIELD_INIT_METHODS = Symbol.for("__fieldInitMethods__");

// Symbol keys for instance storage
const FIELD_LISTENERS = Symbol.for("__fieldListeners__");
const FIELD_PATCHED = Symbol.for("__fieldPatched__");
const CURRENT_MODEL = Symbol.for("__currentModel__");
const MODEL_WRITE_FN = Symbol.for("__modelWriteFn__");
const MODEL_READ_FN = Symbol.for("__modelReadFn__");

// ─────────────────────────────────────────────────────────────────
// fieldBindings - Decorators for Reusable Bindable Components
// ─────────────────────────────────────────────────────────────────

/**
 * ### fieldBindings
 *
 * Decorators for creating reusable components that bind to FieldNode models.
 *
 * The component provides `modelReaders` and `modelWriters` maps keyed by
 * `__meta.typeName`. The decorator handles:
 * - Binding/unbinding on model change
 * - Calling the correct reader when model value changes
 * - Providing `writeToModel()` method that calls the correct writer
 *
 * @example
 * ```typescript
 * export class MyInput extends LitElement implements BindableComponent {
 *   @fieldBindings.model()
 *   model: STRING | XString | undefined;
 *
 *   declare writeToModel: () => void;
 *
 *   modelReaders = new Map([
 *     ["primitives.STRING", () => { this.value = (this.model as STRING).value ?? ""; }],
 *     ["furo.fat.String", () => { this.value = (this.model as XString).value.value ?? ""; }],
 *   ]);
 *
 *   modelWriters = new Map([
 *     ["primitives.STRING", () => { (this.model as STRING).value = this.value; }],
 *     ["furo.fat.String", () => { (this.model as XString).value.value = this.value; }],
 *   ]);
 *
 *   private _onInput(e: Event) {
 *     this.value = (e.target as HTMLInputElement).value;
 *     this.writeToModel();
 *   }
 * }
 * ```
 */
export const fieldBindings = {
  /**
   * Decorator for the `model` property.
   *
   * Handles:
   * - Binding/unbinding when model changes
   * - Resolving reader/writer functions based on model type
   * - Calling reader on model value changes
   * - Providing `writeToModel()` method
   */
  model() {
    return function modelDecorator<T extends FieldNodeLike>(target: object, propertyKey: string) {
      const ctor = target.constructor as typeof ReactiveElement;

      // Patch lifecycle
      patchLifecycle(ctor);

      // Add writeToModel helper method
      if (!Object.prototype.hasOwnProperty.call(target, "writeToModel")) {
        Object.defineProperty(target, "writeToModel", {
          value: function writeToModel(this: LitElement & Record<symbol, (() => void) | undefined>) {
            const writeFn = this[MODEL_WRITE_FN];
            if (writeFn) {
              try {
                writeFn();
              } catch (e) {
                 
                console.error("Failed to write to model:", e);
              }
            }
          },
          writable: false,
          enumerable: false,
          configurable: true,
        });
      }

      // Create getter/setter for the model property
      Object.defineProperty(target, propertyKey, {
        get(this: LitElement & Record<symbol, T | undefined>): T | undefined {
          return this[CURRENT_MODEL];
        },
        set(this: LitElement & BindableComponent & Record<symbol, T | (() => void) | undefined>, value: T | undefined) {
          const oldModel = this[CURRENT_MODEL] as T | undefined;
          if (value === oldModel) return;

          // Unbind from old model
          if (oldModel) {
            unbindFromModel(this, oldModel);
          }

          // Store new model
          this[CURRENT_MODEL] = value;

          // Resolve reader/writer functions based on type
          if (value) {
            const typeName = value.__meta?.typeName ?? "primitives.STRING";

            // Resolve reader
            const reader = this.modelReaders?.get(typeName);
            if (reader) {
              this[MODEL_READ_FN] = reader.bind(this);
            } else {
               
              console.warn(`No modelReader for type "${typeName}". Available: ${[...(this.modelReaders?.keys() ?? [])].join(", ")}`);
              this[MODEL_READ_FN] = undefined;
            }

            // Resolve writer
            const writer = this.modelWriters?.get(typeName);
            if (writer) {
              this[MODEL_WRITE_FN] = writer.bind(this);
            } else {
               
              console.warn(`No modelWriter for type "${typeName}". Available: ${[...(this.modelWriters?.keys() ?? [])].join(", ")}`);
              this[MODEL_WRITE_FN] = undefined;
            }
          } else {
            this[MODEL_READ_FN] = undefined;
            this[MODEL_WRITE_FN] = undefined;
          }

          // Bind to new model (if connected)
          if (value && this.isConnected) {
            bindToModel(this, value);
          }

          // Trigger Lit update
          this.requestUpdate();
        },
        enumerable: true,
        configurable: true,
      });
    };
  },

  /**
   * Binds a method to an event on the model.
   * When the event fires, the method is called with the event detail.
   *
   * @param eventType - The event type to listen for
   */
  onEvent(eventType: ModelEventType) {
    return function onEventDecorator(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      const ctor = target.constructor as typeof ReactiveElement;

      let events = (ctor as unknown as Record<symbol, FieldEventMeta[]>)[FIELD_EVENTS];
      if (!events) {
        events = [];
        (ctor as unknown as Record<symbol, FieldEventMeta[]>)[FIELD_EVENTS] = events;
      }
      events.push({ propertyKey, eventType, method: originalMethod });

      patchLifecycle(ctor);
    };
  },

  /**
   * Decorator that marks a method to be called once after a new model is assigned and bound.
   *
   * Useful for one-time setup like setting a11y attributes, placeholders, or constraints
   * based on the model's type.
   *
   * @example
   * ```typescript
   * @fieldBindings.onInit()
   * protected init() {
   *   this.accessibleName = this.model?.__label ?? "Toggle";
   * }
   * ```
   */
  onInit() {
    return function onInitDecorator(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const originalMethod = descriptor.value;
      const ctor = target.constructor as typeof ReactiveElement;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      let inits = (ctor as unknown as Record<symbol, { propertyKey: string; method: Function }[]>)[FIELD_INIT_METHODS];
      if (!inits) {
        inits = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        (ctor as unknown as Record<symbol, { propertyKey: string; method: Function }[]>)[FIELD_INIT_METHODS] = inits;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      inits.push({ propertyKey, method: originalMethod });

      patchLifecycle(ctor);
    };
  },
};

// ─────────────────────────────────────────────────────────────────
// Binding Logic
// ─────────────────────────────────────────────────────────────────

interface ListenerEntry {
  eventType: string;
  listener: (e: CustomEvent) => void;
}

type ComponentWithListeners = LitElement & BindableComponent & Record<symbol, Map<string, ListenerEntry> | FieldNodeLike | (() => void) | undefined>;

/**
 * Bind to the model - set up event listeners and call initial read.
 */
function bindToModel(component: ComponentWithListeners, model: FieldNodeLike): void {
  const ctor = component.constructor as typeof ReactiveElement;
  const events = (ctor as unknown as Record<symbol, FieldEventMeta[]>)[FIELD_EVENTS] ?? [];

  const listeners = new Map<string, ListenerEntry>();
  component[FIELD_LISTENERS] = listeners;

  // Get the pre-resolved read function
  const readFn = component[MODEL_READ_FN] as (() => void) | undefined;

  // Set up value change listener - calls the reader
  if (readFn) {
    const valueListener = () => {
      readFn();
    };

    listeners.set("value", { eventType: "update", listener: valueListener });
    model.__addEventListener("update", valueListener);

    // Initial read
    readFn();
  }

  // Call @fieldBindings.onInit() methods
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const inits = (ctor as unknown as Record<symbol, { propertyKey: string; method: Function }[]>)[FIELD_INIT_METHODS] ?? [];
  inits.forEach(({ method }) => {
    method.call(component);
  });

  // Set up event bindings from @fieldBindings.onEvent decorators
  events.forEach(({ propertyKey, eventType, method }) => {
    const listener = (e: CustomEvent) => {
      method.call(component, e.detail);
    };

    listeners.set(`event:${propertyKey}`, { eventType, listener });
    model.__addEventListener(eventType, listener);
  });
}

/**
 * Unbind all listeners from the model.
 */
function unbindFromModel(component: ComponentWithListeners, model: FieldNodeLike): void {
  const listeners = component[FIELD_LISTENERS] as Map<string, ListenerEntry> | undefined;
  if (!listeners) return;

  listeners.forEach(({ eventType, listener }) => {
    model.__removeEventListener(eventType, listener);
  });
  listeners.clear();
}

// ─────────────────────────────────────────────────────────────────
// Lifecycle Patching
// ─────────────────────────────────────────────────────────────────

/**
 * Patch connectedCallback/disconnectedCallback to handle model binding.
 */
function patchLifecycle(ctor: typeof ReactiveElement): void {
  if ((ctor as unknown as Record<symbol, boolean>)[FIELD_PATCHED]) {
    return;
  }
  (ctor as unknown as Record<symbol, boolean>)[FIELD_PATCHED] = true;

  const originalConnected = ctor.prototype.connectedCallback;
  const originalDisconnected = ctor.prototype.disconnectedCallback;

  ctor.prototype.connectedCallback = function connectedCallback(this: ComponentWithListeners) {
    originalConnected?.call(this);

    // Bind to model if already set
    const model = this[CURRENT_MODEL] as FieldNodeLike | undefined;
    if (model) {
      bindToModel(this, model);
    }
  };

  ctor.prototype.disconnectedCallback = function disconnectedCallback(this: ComponentWithListeners) {
    // Unbind from model
    const model = this[CURRENT_MODEL] as FieldNodeLike | undefined;
    if (model) {
      unbindFromModel(this, model);
    }

    originalDisconnected?.call(this);
  };
}
