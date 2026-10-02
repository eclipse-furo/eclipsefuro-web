import type { ModelEventType } from "@/FieldNode";
import type { LitElement, ReactiveElement } from "lit";

/** Types TypeScript calls objects but that are leaves in a model. */
type LeafValue = Date | Uint8Array | ((...args: never[]) => unknown);

/** Drops index signatures, so one map field cannot widen the whole union to plain `string`. */
type KnownKeys<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};

/**
 * Every dot path into a literal interface, five levels deep.
 *
 * Generated fields are all optional, hence `NonNullable` - `ICube | undefined extends object` is
 * false, which would silently drop every nested message. Repeated fields stop at the field itself:
 * `__getFieldNodeByPath` resolves named children only, so an indexed path would not resolve anyway.
 * `Depth` is a countdown tuple, since a self-referencing message would otherwise recurse forever.
 */
export type NestedKeyOf<T, Depth extends readonly unknown[] = [1, 1, 1, 1, 1]> = Depth extends readonly [unknown, ...infer Rest]
  ? {
      [K in keyof KnownKeys<T> & string]-?: NonNullable<T[K]> extends LeafValue
        ? K
        : NonNullable<T[K]> extends readonly unknown[]
          ? K
          : NonNullable<T[K]> extends object
            ? K | `${K}.${NestedKeyOf<NonNullable<T[K]>, Rest>}`
            : K;
    }[keyof KnownKeys<T> & string]
  : never;

/**
 * Escape hatch for the model's own meta properties, e.g. `__isValid`. A template literal rather than
 * `string`, so it does not swallow the literal suggestions next to it.
 */
type MetaPath = `__${string}`;

/** What `bind` and `onFieldEvent` accept. An ARRAY model is bound by `length`, not by field. */
export type ModelPath<IPath extends object> = MetaPath | (IPath extends readonly unknown[] ? "length" : NestedKeyOf<IPath>);

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

/** The model shape the decorators bind to. Exported for `ModelContainer`. */
export type BindableModel = FieldNodeLike;

/**
 * The decorator factories {@link ModelBindings} hands out, named so that `IPath` survives being
 * stored on a container - `ReturnType<typeof ModelBindings>` would erase it.
 */
export interface ModelBindingDecorators<IPath extends object, TEventMap extends ModelEventMap = ModelEventMap> {
  bind(path?: ModelPath<IPath>, eventType?: ModelEventType): (target: object, propertyKey: string) => void;
  onEvent(eventType: keyof TEventMap & ModelEventType): (target: object, propertyKey: string, descriptor: PropertyDescriptor) => void;
  onFieldEvent(
    path: ModelPath<IPath>,
    eventType: keyof TEventMap & ModelEventType
  ): (target: object, propertyKey: string, descriptor: PropertyDescriptor) => void;
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
 * import { ModelBindings } from "@furo/open-models";
 * import { CubeEntityModel } from "./CubeEntityModel";
 *
 * // The type argument is the literal interface of the model, and is what the paths complete from.
 * const cubeModel = ModelBindings<ICubeEntity>(CubeEntityModel.model);
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
 * @typeParam IPath - The literal interface of the model, e.g. `ICubeFilter`. Paths complete from it.
 * @returns Object with `bind`, `onEvent`, and `onFieldEvent` decorator factories
 */
export function ModelBindings<IPath extends object, TEventMap extends ModelEventMap = ModelEventMap>(
  model: BindableModel
): ModelBindingDecorators<IPath, TEventMap> {
  return {
    /**
     * Triggers a render update when a model event fires.
     * When called without arguments, listens on the model root for the "update" event.
     *
     * @param path - Optional path to a field (e.g., "cube.length"). When omitted, listens on the model root.
     * @param eventType - Event to listen for (defaults to "update")
     */
    bind(path?: ModelPath<IPath>, eventType: ModelEventType = "update") {
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

        ownEventMethods(ctor).push({ propertyKey, model, path: null, eventType, method: originalMethod });

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
    onFieldEvent(path: ModelPath<IPath>, eventType: keyof TEventMap & ModelEventType) {
      return function onFieldEventDecorator(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- descriptor.value is untyped by design
        const originalMethod: EventBindingMeta["method"] = descriptor.value;
        const ctor = target.constructor as typeof ReactiveElement;

        ownEventMethods(ctor).push({ propertyKey, model, path, eventType, method: originalMethod });

        patchEventLifecycle(ctor);
      };
    },
  };
}

// ─────────────────────────────────────────────────────────────────
// Lifecycle Patching
// ─────────────────────────────────────────────────────────────────

/**
 * The registrations of one class, never a base class's.
 *
 * `ctor[MODEL_EVENT_METHODS]` is found through the prototype chain, so reading it and pushing would
 * append a subclass's methods to its base's array - and every base instance would then call them.
 * This creates an own array the first time a class registers anything.
 */
function ownEventMethods(ctor: object): EventBindingMeta[] {
  const record = ctor as Record<symbol, EventBindingMeta[] | undefined>;
  const own = Object.prototype.hasOwnProperty.call(ctor, MODEL_EVENT_METHODS) ? record[MODEL_EVENT_METHODS] : undefined;
  if (own) {
    return own;
  }
  const created: EventBindingMeta[] = [];
  record[MODEL_EVENT_METHODS] = created;
  return created;
}

/**
 * Every `@onEvent` / `@onFieldEvent` registration that applies to this instance, its base classes
 * included. A subclass that redeclares a method wins, and the base's version is not bound twice.
 */
function collectEventMethods(instance: object): EventBindingMeta[] {
  const collected: EventBindingMeta[] = [];
  const seen = new Set<string>();

  // walked subclass first, so the nearest declaration of a method is the one that binds
  for (let ctor: unknown = instance.constructor; typeof ctor === "function"; ctor = Object.getPrototypeOf(ctor)) {
    if (!Object.prototype.hasOwnProperty.call(ctor, MODEL_EVENT_METHODS)) {
      continue;
    }
    const methods = (ctor as unknown as Record<symbol, EventBindingMeta[] | undefined>)[MODEL_EVENT_METHODS];
    methods?.forEach(meta => {
      if (seen.has(meta.propertyKey)) {
        return;
      }
      seen.add(meta.propertyKey);
      collected.push(meta);
    });
  }

  return collected;
}

/**
 * Every `@bind` registration that applies to this instance.
 *
 * `bindingsMetadata` is keyed by the exact prototype a decorator ran on, so a lookup on the
 * instance's own prototype alone would silently drop everything a base class declared.
 */
function collectBindings(instance: object): Map<string, BindingMeta> {
  const chain: object[] = [];
  for (let proto: unknown = Object.getPrototypeOf(instance); proto !== null && proto !== undefined; proto = Object.getPrototypeOf(proto)) {
    chain.push(proto);
  }

  // base first, so a subclass redeclaring the same property overwrites it
  const merged = new Map<string, BindingMeta>();
  chain.reverse().forEach(proto => {
    bindingsMetadata.get(proto)?.forEach((meta, propKey) => {
      merged.set(propKey, meta);
    });
  });

  return merged;
}

/** Whether a resolved path landed on something that can be subscribed to. */
function isFieldNode(candidate: unknown): candidate is FieldNodeLike {
  return typeof (candidate as FieldNodeLike | undefined)?.__addEventListener === "function";
}

/**
 * What a path resolves to, and therefore where a listener belongs.
 *
 * Three kinds of path end up here, and only the first is a child node:
 * - a field path, `"search"` or `"cube.length"` - the node itself, so `this-…` events reach it.
 *   A single segment is resolved too; treating it as a root property is what used to make
 *   `onFieldEvent("search", "this-field-value-changed")` listen on the root and never fire.
 * - a meta property, `"__isValid"` - lives on the model, not below it.
 * - a plain own property, `"length"` on a parentless ARRAY - readable, but not a node, so the
 *   listener goes on the model, which is where an ARRAY announces itself anyway.
 */
function resolvePath(model: FieldNodeLike, path: string | undefined): { field: FieldNodeLike; read: () => unknown } {
  if (path === undefined) {
    return { field: model, read: () => undefined };
  }

  const own = model as unknown as Record<string, unknown>;

  if (path.startsWith("__")) {
    return { field: model, read: () => own[path] };
  }

  const resolved = model.__getFieldNodeByPath?.(path);
  if (isFieldNode(resolved)) {
    return { field: resolved, read: () => ("value" in resolved ? resolved.value : undefined) };
  }

  return { field: model, read: () => own[path] };
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

    const metadata = collectBindings(this);
    if (metadata.size === 0) return;

    const listeners = new Map<string, { listener: (e: CustomEvent) => void; field: FieldNodeLike; eventType: string }>();
    this[MODEL_BIND_LISTENERS] = listeners;

    metadata.forEach(({ model, path, eventType }, propKey) => {
      const { field, read } = resolvePath(model, path);

      const listener = () => {
        if (path !== undefined) {
          (this as unknown as Record<string, unknown>)[propKey] = read();
        }
        this.requestUpdate();
      };

      listeners.set(propKey, { listener, field, eventType });
      field.__addEventListener(eventType, listener);
      listener(); // sync initial value
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

    const methods = collectEventMethods(this);
    if (methods.length === 0) return;

    const listeners = new Map<string, { listener: (e: CustomEvent) => void; field: FieldNodeLike; eventType: string }>();
    this[MODEL_EVENT_LISTENERS] = listeners;

    methods.forEach(({ propertyKey, model, path, eventType, method }) => {
      // If a path is given, listen on that field; otherwise on the root model
      const { field } = resolvePath(model, path ?? undefined);

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
