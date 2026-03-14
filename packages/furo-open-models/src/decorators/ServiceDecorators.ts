/* eslint-disable no-param-reassign */
import { LitElement, ReactiveElement } from "lit";

import { EntityServiceEventMap } from "./EntityServiceTypes";

/**
 * Metadata storage for property bindings
 * Maps: class prototype -> Map<propertyKey, { service, eventType, detailKey }>
 */
interface PropertyBindingMeta {
  service: EventTarget;
  eventType: string;
  detailKey: string;
}
const propertyBindingsMetadata = new WeakMap<object, Map<string, PropertyBindingMeta>>();

/**
 * Metadata storage for event method bindings
 * Maps: class constructor -> Array<{ propertyKey, service, eventType, method }>
 */
interface EventBindingMeta {
  propertyKey: string;
  service: EventTarget;
  eventType: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  method: Function;
}

// Symbol keys for instance storage
const PROPERTY_LISTENERS = Symbol.for("__servicePropertyListeners__");
const EVENT_LISTENERS = Symbol.for("__serviceEventListeners__");
const PROPERTY_PATCHED = Symbol.for("__servicePropertyPatched__");
const EVENT_PATCHED = Symbol.for("__serviceEventPatched__");
const EVENT_METHODS = Symbol.for("__serviceEventMethods__");

/**
 * ### ServiceBindings Factory
 *
 * Creates type-safe decorators bound to a specific service instance.
 * Use this to bind component properties and methods to service events.
 *
 * The factory is generic and works with any `EventTarget`.
 * Event types and their detail payloads are type-checked at compile time
 * via the `TEventMap` type parameter.
 *
 * Usage:
 * ```typescript
 * import { cubeEntityService } from "./CubeEntityService";
 * import { ServiceBindings } from "./ServiceDecorators";
 *
 * const cube = ServiceBindings(cubeEntityService);
 *
 * class MyComponent extends LitElement {
 *   // Property binding - type-safe event name, auto-extracts from detail
 *   @cube.bindToEvent("busy-changed")
 *   @state()
 *   private busy: boolean = false;
 *
 *   // Event binding - type-safe event name and detail type
 *   @cube.onEvent("response-received")
 *   private onResponseReceived() {
 *     console.log("Data received!");
 *   }
 *
 *   @cube.onEvent("error-5xx")
 *   private onError(detail: { serverResponse: Response }) {
 *     console.error("Server error:", detail.serverResponse);
 *   }
 *
 *   // Compile error! "typo-event" is not a valid event type
 *   // @cube.onEvent("typo-event")
 * }
 * ```
 *
 * ### Custom Event Maps
 *
 * To add custom events, extend the `EntityServiceEventMap`:
 * ```typescript
 * interface MyServiceEventMap extends EntityServiceEventMap {
 *   "custom-event": { data: string };
 * }
 *
 * const myBindings = ServiceBindings<MyServiceEventMap>(myService);
 * ```
 *
 * @typeParam TEventMap - The event map type (defaults to EntityServiceEventMap)
 * @param service - The EventTarget service to bind to
 * @returns Object with `bindToEvent` and `onEvent` decorator factories
 */
export function ServiceBindings<TEventMap extends EntityServiceEventMap = EntityServiceEventMap>(service: EventTarget) {
  return {
    /**
     * Binds a property to a service event.
     * When the event fires, the property is automatically updated from event.detail.
     *
     * @typeParam K - The event type (constrained to valid event names)
     * @param eventType - The event name to listen for
     * @param detailKey - Optional key to extract from event.detail (defaults to inferring from event type)
     */
    bindToEvent<K extends keyof TEventMap & string>(eventType: K, detailKey?: string) {
      return function bindToEventDecorator(target: object, propertyKey: string) {
        // Infer detailKey from event type if not provided
        // e.g., "busy-changed" -> "busy"
        const key = detailKey ?? inferDetailKey(eventType, propertyKey);

        // Get or create metadata map for this class
        let metadata = propertyBindingsMetadata.get(target);
        if (!metadata) {
          metadata = new Map();
          propertyBindingsMetadata.set(target, metadata);
        }
        metadata.set(propertyKey, { service, eventType, detailKey: key });

        // Patch lifecycle methods (only once per class)
        patchPropertyLifecycle(target.constructor as typeof ReactiveElement);
      };
    },

    /**
     * Binds a method to a service event.
     * When the event fires, the method is called with event.detail as argument.
     *
     * The detail type is inferred from the event map:
     * - `@cube.onEvent("busy-changed")` → method receives `{ busy: boolean }`
     * - `@cube.onEvent("error-5xx")` → method receives `{ serverResponse: Response }`
     * - `@cube.onEvent("response-received")` → method receives `{ response, serverResponse }`
     *
     * @typeParam K - The event type (constrained to valid event names)
     * @param eventType - The event name to listen for
     */
    onEvent<K extends keyof TEventMap & string>(eventType: K) {
      return function onEventDecorator(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const ctor = target.constructor as typeof ReactiveElement;

        // Store method metadata on the constructor
        let methods = (ctor as unknown as Record<symbol, EventBindingMeta[]>)[EVENT_METHODS];
        if (!methods) {
          methods = [];
          (ctor as unknown as Record<symbol, EventBindingMeta[]>)[EVENT_METHODS] = methods;
        }
        methods.push({ propertyKey, service, eventType, method: originalMethod });

        // Patch lifecycle methods (only once per class)
        patchEventLifecycle(ctor);
      };
    },
  };
}

/**
 * Infer the detail key from the event type or property name
 */
function inferDetailKey(eventType: string, propertyKey: string): string {
  // Common patterns: "busy-changed" -> "busy", "validity-changed" -> check property
  const match = eventType.match(/^(.+)-changed$/);
  if (match) {
    return match[1];
  }
  // Fall back to property name
  return propertyKey;
}

/**
 * Patch connectedCallback/disconnectedCallback for property bindings
 */
function patchPropertyLifecycle(ctor: typeof ReactiveElement): void {
  if ((ctor as unknown as Record<symbol, boolean>)[PROPERTY_PATCHED]) {
    return;
  }
  (ctor as unknown as Record<symbol, boolean>)[PROPERTY_PATCHED] = true;

  const originalConnected = ctor.prototype.connectedCallback;
  const originalDisconnected = ctor.prototype.disconnectedCallback;

  ctor.prototype.connectedCallback = function connectedCallback(
    this: LitElement & Record<symbol, Map<string, { listener: EventListener; service: EventTarget; eventType: string }>>
  ) {
    originalConnected?.call(this);

    const metadata = propertyBindingsMetadata.get(Object.getPrototypeOf(this));
    if (!metadata) return;

    const listeners = new Map<string, { listener: EventListener; service: EventTarget; eventType: string }>();
    this[PROPERTY_LISTENERS] = listeners;

    metadata.forEach(({ service, eventType, detailKey }, propKey) => {
      const listener = ((e: CustomEvent) => {
        if (e.detail && detailKey in e.detail) {
          (this as unknown as Record<string, unknown>)[propKey] = e.detail[detailKey];
        }
      }) as EventListener;

      listeners.set(propKey, { listener, service, eventType });
      service.addEventListener(eventType, listener);
    });
  };

  ctor.prototype.disconnectedCallback = function disconnectedCallback(
    this: LitElement & Record<symbol, Map<string, { listener: EventListener; service: EventTarget; eventType: string }>>
  ) {
    const listeners = this[PROPERTY_LISTENERS];
    if (listeners) {
      listeners.forEach(({ listener, service, eventType }) => {
        service.removeEventListener(eventType, listener);
      });
      listeners.clear();
    }

    originalDisconnected?.call(this);
  };
}

/**
 * Patch connectedCallback/disconnectedCallback for event method bindings
 */
function patchEventLifecycle(ctor: typeof ReactiveElement): void {
  if ((ctor as unknown as Record<symbol, boolean>)[EVENT_PATCHED]) {
    return;
  }
  (ctor as unknown as Record<symbol, boolean>)[EVENT_PATCHED] = true;

  const originalConnected = ctor.prototype.connectedCallback;
  const originalDisconnected = ctor.prototype.disconnectedCallback;

  ctor.prototype.connectedCallback = function connectedCallback(
    this: LitElement & Record<symbol, Map<string, { listener: EventListener; service: EventTarget; eventType: string }>>
  ) {
    originalConnected?.call(this);

    const methods = (this.constructor as unknown as Record<symbol, EventBindingMeta[]>)[EVENT_METHODS];
    if (!methods) return;

    const listeners = new Map<string, { listener: EventListener; service: EventTarget; eventType: string }>();
    this[EVENT_LISTENERS] = listeners;

    methods.forEach(({ propertyKey, service, eventType, method }) => {
      const listener = ((e: CustomEvent) => {
        method.call(this, e.detail);
      }) as EventListener;

      listeners.set(propertyKey, { listener, service, eventType });
      service.addEventListener(eventType, listener);
    });
  };

  ctor.prototype.disconnectedCallback = function disconnectedCallback(
    this: LitElement & Record<symbol, Map<string, { listener: EventListener; service: EventTarget; eventType: string }>>
  ) {
    const listeners = this[EVENT_LISTENERS];
    if (listeners) {
      listeners.forEach(({ listener, service, eventType }) => {
        service.removeEventListener(eventType, listener);
      });
      listeners.clear();
    }

    originalDisconnected?.call(this);
  };
}
