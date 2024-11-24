import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';

/**
 * K can only be a 'string' or 'number' because in JSON UseProtoNames you can only set a string or a number.
 *
 * Even https://protobuf.dev/programming-guides/proto3/#maps defines another structure,
 * we use https://protobuf.dev/programming-guides/proto3/#json
 */
export class MAP<
  K extends string | number,
  T extends FieldNode,
  I,
> extends FieldNode {
  // ev. private machen
  public value: Map<K, T> = new Map<K, T>();

  constructor(
    initData?: { [key: string | number]: I },
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);

    if (initData !== undefined) {
      if (initData !== undefined) {
        // eslint-disable-next-line no-console
        console.error('Use the MAP.Builder()');
      }
    }

    this.__isPrimitive = true;
  }

  static Builder<K extends string | number, T extends FieldNode, I>(
    TConstructor: new () => T,
    initData: { [key: string | number]: I },
  ): MAP<K, T, I> {
    const m = new MAP<K, T, I>();
    m.initFromLiteral(TConstructor, initData);
    return m;
  }

  // eslint-disable-next-line class-methods-use-this
  toString(): string {
    // resolve parent
    return `[object MAP<..., ...>]`;
  }

  /**
   *
   * @param Constructor - type constructor for T
   * @param {{ [key: string | number]: I }} initData - initial map interface type
   */
  initFromLiteral(
    Constructor: { new (): T },
    initData: { [key: string | number]: I },
  ) {
    // empty the map but keep the ref.
    this.value.clear();

    Object.keys(initData).forEach(k => {
      const fieldnode = new Constructor();
      fieldnode.__updateWithLiteral(initData[k]);
      fieldnode.__parentNode = this;
      this.value.set(k as K, fieldnode);
    });

    this.__isEmpty = false;
    this.__notifyMapChanges(false);
  }

  __getFieldNodeByPath(deepPath: string = ''): FieldNode | undefined {
    const path = deepPath.split('.');
    if (path.length > 0 && path[0] !== '') {
      // eslint-disable-next-line no-param-reassign
      deepPath = path.slice(1).join('.');
      if (deepPath === '') {
        if (this.value.has(path[0] as K)) {
          return this.value.get(path[0] as K) as FieldNode;
        }
      } else if (this.value.has(path[0] as K)) {
        return (this.value.get(path[0] as K) as FieldNode).__getFieldNodeByPath(
          deepPath,
        );
      }
      return undefined;
    }
    return undefined;
  }

  public get __childNodes(): T[] {
    const children: T[] = [];
    this.value.forEach(v => children.push(v));
    return children;
  }

  private __notifyMapChanges(bubbles?: boolean) {
    this.__dispatchEvent(
      new CustomEvent('this-map-changed', {
        detail: this,
        bubbles: false,
      }),
    );
    this.__dispatchEvent(
      new CustomEvent('this-field-value-changed', {
        detail: this,
        bubbles: false,
      }),
    );
    if (bubbles) {
      this.__dispatchEvent(
        new CustomEvent('map-changed', {
          detail: this,
          bubbles: true,
        }),
      );
      this.__dispatchEvent(
        new CustomEvent('field-value-changed', {
          detail: this,
          bubbles: true,
        }),
      );
    } else {
      this.__dispatchEvent(
        new CustomEvent('map-changed', {
          detail: this,
          bubbles: false,
        }),
      );
      this.__dispatchEvent(
        new CustomEvent('field-value-changed', {
          detail: this,
          bubbles: false,
        }),
      );
    }
  }

  /**
   *
   * @param initData
   */
  __updateWithLiteral(initData: { [key: string | number]: I }) {
    // empty the map but keep the ref.
    this.value.clear();
    this.__meta.initialValue = initData;
    if (this.__parentNode !== undefined) {
      const fieldDescriptor = this.__parentNode!.__meta.nodeFields.find(
        f => f.fieldName === this.__meta.fieldName,
      );
      const Constructor = fieldDescriptor?.ValueConstructor as new () => T;
      this.initFromLiteral(Constructor, initData);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  __mapProtoNameJsonToJson(data: any): any {
    const literal: { [key: string | number]: I } = {};

    if (this.__parentNode !== undefined) {
      const fieldDescriptor = this.__parentNode!.__meta.nodeFields.find(
        f => f.fieldName === this.__meta.fieldName,
      );
      const Constructor = fieldDescriptor?.ValueConstructor as new () => T;
      const dummy = new Constructor();

      // eslint-disable-next-line guard-for-in
      Object.entries(data).forEach(v => {
        literal[v[0]] = dummy.__mapProtoNameJsonToJson(v[1]);
      });
    }

    return literal;
  }

  __toJson(): { [key: string | number]: I } {
    return this.__toLiteral();
  }

  __toLiteral(): { [key: string | number]: I } {
    const d: { [key: string | number]: I } = {};
    this.value.forEach((item: T, k: K) => {
      d[k] = item.__toLiteral();
    });
    return d;
  }

  /**
   * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
   *
   * The set() method adds or updates an entry in a Map object with a specified key and a value.
   *
   * #### Params:
   * - **key:** The key of the element to add to the Map object. The key may be any JavaScript typeName  (any primitive value  or any typeName of JavaScript object ).
   * - **value:**  The value of the element to add to the Map object. The value may be any JavaScript typeName  (any primitive value  or any typeName of JavaScript object ).
   *
   * #### Returns:
   * The Map object.
   */
  public set(key: K, value: T) {
    this.__isEmpty = false;
    const ret = this.value.set(key, value);
    this.__notifyMapChanges(true);
    return ret;
  }

  public clear(): void {
    this.__clear();
  }

  /**
   * The __clear() method of Map instances removes all elements from this map.
   * @public
   */
  __clear(): void {
    this.__isEmpty = true;
    this.value.clear();
    this.__notifyMapChanges(false);
  }

  /**
   * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
   */
  public delete(key: K): boolean {
    const ret = this.value.delete(key);
    this.__notifyMapChanges(true);
    return ret;
  }

  /**
   * Executes a provided function once per each key/value pair in the Map, in insertion order.
   *
   * #### Params:
   * - **callbackFn:** A function to execute for each entry in the map. The function is called with the following arguments:
   *   - **value:** Value of each iteration.
   *   - **key:** Key of each iteration.
   *   - **map:** The map being iterated.
   * - **thisArg:** A value to use as this when executing callbackFn.
   */
  public forEach(
    callbackfn: (value: T, key: K, map: Map<K, T>) => void,
    thisArg?: unknown,
  ): void {
    return this.value.forEach(callbackfn, thisArg);
  }

  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
   * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
   */
  public get(key: K): T | undefined {
    return this.value.get(key);
  }

  /**
   * @returns boolean indicating whether an element with the specified key exists or not.
   */
  public has(key: K): boolean {
    return this.value.has(key);
  }

  /**
   * The keys() method of Map instances returns a new map iterator  object that contains the keys for each element in this map in insertion order.
   * Returns:
   * A new iterable iterator object .
   */
  public keys(): IterableIterator<K> {
    return this.value.keys();
  }

  /**
   * The entries() method of Map instances returns a new map iterator  object that contains the [key, value] pairs for each element in this map in insertion order.
   */
  public entries(): IterableIterator<[K, T]> {
    return this.value.entries();
  }

  /**
   * @returns the number of elements in the Map.
   */
  public get size(): number {
    return this.value.size;
  }
}

Registry.register('map', MAP);
