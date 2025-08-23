import { FieldNode } from '../FieldNode';

export class ARRAY<T extends FieldNode, I> extends FieldNode {
  private _value: T[] = [];

  private ___Constructor: (new () => T) | undefined = undefined;

  constructor(initData?: I[], parent?: FieldNode, parentATributeName?: string) {
    super(undefined, parent, parentATributeName);
    this.__isPrimitive = true;
    if (initData !== undefined) {
      // eslint-disable-next-line no-console
      console.error('Use the ARRAY.Builder()');
    }
    this.__meta.typeName = `primitives.ARRAY<>`;
  }

  /**
   * Creates an element of type T and adds it to the beginning or end (default) of the ARRAY
   * @param initData
   * @param before
   */
  public add(initData?: I, before?: boolean): T {
    const Constructor: new () => T = this.__getConstructor();

    const fn = new Constructor();
    if (initData) {
      fn.__updateWithLiteral(initData);
    }
    const n = before ? 0 : this.length;
    fn.__parentNode = this;
    fn.__meta.fieldName = `[${n}]`;
    fn.__meta.index = n;
    fn.__meta.deleteArrayNode = ()=>{this.delete(n)}
    fn.__meta.isArrayNode = true;
    fn.__meta.isPristine = true;
    fn.__rootNode = this.__rootNode;
    if (before) {
      this._value.unshift(fn);
    } else {
      this._value.push(fn);
    }

    this.__isEmpty = false;
    this.__notifyArrayChanges(true);
    return fn;
  }

  /**
   *
   * @param initData
   */
  initFromLiteral(Constructor: { new (): T }, initData: I[]) {
    this.__clear();
    this.__meta.initialValue = initData;
    this.__pushWithoutNotifications(initData);
    this.__notifyArrayChanges(false);
  }

  /**
   * creates a literal type from a json type
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  __mapProtoNameJsonToJson(data: any): any {
    const literal: I[] = [];
    // create a dummy object
    const Constructor = this.__getConstructor();
    const fn = new Constructor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((row: any) => {
      literal.push(fn.__mapProtoNameJsonToJson(row));
    });
    return literal;
  }

  __updateWithLiteral(initData: I[]) {
    if (this.__parentNode !== undefined) {
      this.initFromLiteral(this.__getConstructor(), initData);
    }
  }

  __getFieldNodeByPath(deepPath: string = ''): FieldNode | undefined {
    const path = deepPath
      .replaceAll(/[[\]]/g, '.')
      .split('.')
      .filter(p => p !== '');

    if (path.length > 0 && path[0] !== '') {
      // eslint-disable-next-line no-param-reassign
      deepPath = path.slice(1).join('.');
      if (deepPath === '') {
        if (this.value[parseInt(path[0], 10)]) {
          return this.value[parseInt(path[0], 10)] as FieldNode;
        }
      } else if (this.value[parseInt(path[0], 10)]) {
        return (
          this.value[parseInt(path[0], 10)] as FieldNode
        ).__getFieldNodeByPath(deepPath);
      }
      return undefined;
    }
    return undefined;
  }

  private __notifyArrayChanges(bubbles?: boolean) {
    this.__dispatchEvent(
      new CustomEvent('this-array-changed', {
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
      this.__rootNode.__meta.isPristine = false;
      // todo check if nodes in between this and root should be set to false too
      this.__meta.isPristine = false;

      this.__dispatchEvent(
        new CustomEvent('array-changed', {
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
        new CustomEvent('array-changed', {
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

  // used by broadcast
  public get __childNodes(): T[] {
    return this._value;
  }

  private __getConstructor(): new () => T {
    if (this.___Constructor !== undefined) {
      return this.___Constructor;
    }
    // the __parentNode defines the type of the ARRAY<T,I>
    const fieldDescriptor = this.__parentNode!.__meta.nodeFields.find(
      f => f.fieldName === this.__meta.fieldName,
    );
    return fieldDescriptor?.FieldConstructor as new () => T;
  }

  /**
   * @function
   * @template T FieldNode
   * @template I Json like interface type
   * @param {T} Constructor - Const
   * @param {I[]} initData - Initial open-models
   * @returns {ARRAY<T, I>}
   */
  static Builder<T extends FieldNode, I>(
    Constructor: new () => T,
    initData: I[],
  ): ARRAY<T, I> {
    const a: ARRAY<T, I> = new ARRAY<T, I>();
    a.___Constructor = Constructor;
    a.initFromLiteral(Constructor, initData);
    return a;
  }

  toString(): string {
    // resolve parent
    const innerType = this.__parentNode?.__meta.nodeFields.find(
      f => f.fieldName === this.__meta.fieldName,
    );
    return `[object ARRAY<${innerType?.FieldConstructor.name}>]`;
  }

  // only used by direct invocation of the type
  __stringify(): string {
    return JSON.stringify(this.__toJson());
  }

  // only used by direct invocation of the type
  __toJson(): T[] {
    return this.value.map((v: FieldNode) => v.__toJson());
  }

  // only used by direct invocation of the type
  __toLiteral(): I[] {
    return this.value.map((v: FieldNode) => v.__toLiteral());
  }

  __clear() {
    this._value.length = 0;
    this.__isEmpty = true;
    this.__notifyArrayChanges(false);
  }

  delete(index: number): I {
    const removed = this._value.splice(index, 1);
    this._rebuildIndexAndFieldName();
    this.__notifyArrayChanges(true);
    return removed[0].__toLiteral();
  }

  deleteT(index: number): T {
    const removed = this._value.splice(index, 1);
    this._rebuildIndexAndFieldName();
    this.__notifyArrayChanges(true);
    return removed[0];
  }

  get value(): T[] {
    return this._value;
  }

  /**
   * NOT needed any more, because we use the __TypeSetter instead of the __PrimitivesSetter
   set value(arr: T[]) {
   // assigning the new array will destroy any reference to it
   // __clear the array
   this.__clear();
   // (this as any)[`_${fieldName}`].length = 0;
   // refill the array
   arr.forEach((e, i) => {
   e.__parentNode = this;
   e.__meta.fieldName = `${i}`;
   e.__meta.index = i;
   e.__meta.isArrayNode = true;
   this._value.push(e);
   });
   this.__notifyArrayChanges(true);
   }
   */

  get length(): number {
    return this._value.length;
  }

  /**
   * The at() method of Array instances takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative integers count back from the last item in the array.
   *
   * This method returns the Interface type.
   *
   * @param {I} index - Zero-based index of the array element to be returned, converted to an integer . Negative index counts back from the end of the array — if index < 0, index + array. length is accessed.
   */
  at(index: number): T | undefined {
    return this._value.at(index);
  }

  /**
   * The at() method of Array instances takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative integers count back from the last item in the array.
   *
   * This method returns the FieldNode type.
   *
   * @param {T} index - Zero-based index of the array element to be returned, converted to an integer . Negative index counts back from the end of the array — if index < 0, index + array. length is accessed.
   */
  atT(index: number): T | undefined {
    return this._value.at(index);
  }

  /**
   * The entries() method of Array instances returns a new array iterator  object that contains the key/ value pairs for each index in the array.
   */
  entries(): IterableIterator<[number, I]> {
    return this._value.map(t => t.__toLiteral()).entries();
  }

  /**
   * The entries() method of Array instances returns a new array iterator  object that contains the key/ value pairs for each index in the array.
   */
  entriesT(): IterableIterator<[number, T]> {
    return this._value.entries();
  }

  /**
   * Map with interface type as value.
   *
   * The map() method of Array instances creates a new array populated with the results of calling a provided function on every element in the calling array.
   */
  mapI<U>(
    callbackfn: (value: I, index: number, array: I[]) => U,
    thisArg?: unknown,
  ): U[] {
    return this._value.map(t => t.__toLiteral()).map(callbackfn, thisArg);
  }

  /**
   * The map() method of Array instances creates a new array populated with the results of calling a provided function on every element in the calling array.
   */
  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: unknown,
  ): U[] {
    return this._value.map(callbackfn, thisArg);
  }

  /**
   * The filter() method of Array   instances creates a shallow copy   of a portion of a given array, filtered down to just the elements from the given array that pass the test implemented by the provided function.
   * @param callbackfn
   * @param thisArg
   */
  filter(
    callbackfn: (value: T, index: number, array: T[]) => boolean,
    thisArg?: unknown,
  ): T[] {
    return this._value.filter(callbackfn, thisArg);
  }

  find(
    callbackfn: (value: T, index: number, array: T[]) => boolean,
    thisArg?: unknown,
  ): T | undefined {
    return this._value.find(callbackfn, thisArg);
  }

  forEach(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: unknown,
  ): void {
    return this._value.forEach(callbackfn, thisArg);
  }

  /**
   * ...
   * This method requires a FieldNode, not the interface type
   * @param searchElement
   * @param fromIndex
   */
  includes(searchElement: T, fromIndex?: number): boolean {
    return this._value.includes(searchElement, fromIndex);
  }

  /**
   * ...
   * Alternatively you can use the T.__meta.index to get the index of an element.
   * This method requires a FieldNode, not the interface type.
   * @param searchElement
   * @param fromIndex
   */
  indexOf(searchElement: T, fromIndex?: number): number {
    // if searchElement is a FieldNode return __meta.index
    return this._value.indexOf(searchElement, fromIndex);
  }

  keys(): IterableIterator<number> {
    return this._value.keys();
  }

  lastIndexOf(searchElement: T, fromIndex?: number): number {
    return this._value.lastIndexOf(searchElement, fromIndex);
  }

  pop(): T | undefined {
    const ret = this._value.pop();
    this.__notifyArrayChanges(true);
    return ret;
  }

  /**
   * The push() method of Array instances adds the specified elements to the end of an array and returns the new length of the array.
   * Params:
   * element1 … elementN – The element(s) to add to the end of the array.
   * Returns:
   * The new length property of the object upon which the method was called
   * @param items
   */
  push(...items: I[]): number {
    const n = this.__pushWithoutNotifications(items);
    this.__notifyArrayChanges(true);
    return n;
  }

  /**
   * Moves an item in the array
   * @param fromIndex
   * @param toIndex
   */
  moveItem(fromIndex: number, toIndex: number) {
    const e = this._value[fromIndex];
    this._value.splice(fromIndex, 1);
    this._value.splice(toIndex, 0, e);
    this._rebuildIndexAndFieldName();
    this.__notifyArrayChanges(true);
  }

  private __pushWithoutNotifications(items: I[]) {
    let n: number = 0;
    const Constructor: new () => T = this.__getConstructor();
    items.forEach((literal: I,i) => {
      const fn = new Constructor();
      fn.__updateWithLiteral(literal);
      n = this._value.push(fn);
      fn.__rootNode = this.__rootNode;
      fn.__parentNode = this;
      fn.__meta.fieldName = `[${n - 1}]`;
      fn.__meta.index = n - 1;
      fn.__meta.deleteArrayNode = ()=>{this.delete(i)}
      fn.__meta.isArrayNode = true;
      fn.__meta.isPristine = true;
    });

    this.__isEmpty = false;
    return n;
  }

  reverse(): T[] {
    const ret = this._value.reverse();
    this.__notifyArrayChanges(true);
    return ret;
  }

  /**
   * The shift() method of Array instances removes the first element from an array and returns that removed element.
   *
   * This method changes the length of the array.
   */
  shift(): I | undefined {
    const t = this._value.shift();
    this.__notifyArrayChanges(true);
    return t?.__toLiteral();
  }

  /**
   * The slice() method of Array instances returns a shallow copy  of a portion of an array into a new array object selected from start to end (end not included) where start and end represent the index of items in that array. The original array will not be modified.
   * #### Params:
   * start – Zero-based index at which to start extraction, converted to an integer .
   * Negative index counts back from the end of the array — if start < 0, start + array. length is used.
   * If start < -array. length or start is omitted, 0 is used.
   * If start >= array. length, nothing is extracted.
   *
   * end – Zero-based index at which to end extraction, converted to an integer . slice() extracts up to but not including end.
   * Negative index counts back from the end of the array — if end < 0, end + array. length is used.
   * If end < -array. length, 0 is used.
   * If end >= array. length or end is omitted, array. length is used, causing all elements until the end to be extracted.
   * If end is positioned before or at start after normalization, nothing is extracted.
   *
   */
  slice(start?: number, end?: number): I[] {
    const tar = this._value.slice(start, end);
    const ret = tar.map(t => t.__toLiteral());
    this.__notifyArrayChanges(true);
    return ret;
  }

  splice(start: number, deleteCount?: number): I[];

  splice(start: number, deleteCount: number, ...items: I[]): I[];

  splice(start: number, deleteCount?: number, ...items: I[]): I[] {
    if (deleteCount !== undefined) {
      const Constructor: new () => T = this.__getConstructor();
      const i: I[] = this._value
        .splice(
          start,
          deleteCount,
          ...items.map((literal: I) => {
            const fn = new Constructor();
            fn.__updateWithLiteral(literal);
            fn.__rootNode = this.__rootNode;
            fn.__parentNode = this;
            fn.__meta.isArrayNode = true;
            return fn;
          }),
        )
        .map(item => item.__toLiteral());
      this._rebuildIndexAndFieldName();
      this.__notifyArrayChanges(true);
      return i;
    }
    const ret = this._value.splice(start).map(item => item.__toLiteral());
    this.__notifyArrayChanges(true);
    return ret;
  }

  spliceT(start: number, deleteCount?: number): T[];

  spliceT(start: number, deleteCount: number, ...items: T[]): T[];

  spliceT(start: number, deleteCount?: number, ...items: T[]): T[] {
    let ret: T[] = [];
    if (deleteCount !== undefined) {
      ret = this.value.splice(start, deleteCount, ...items);
    } else {
      ret = this.value.splice(start);
    }

    this._rebuildIndexAndFieldName();
    this.__notifyArrayChanges(true);

    return ret;
  }

  /**
   * The unshift() method of Array instances adds the specified elements to the beginning of an array and returns the new length of the array.
   * #### Params:
   * - **element1 … elementN** The elements to add to the front of the arr.
   *
   * #### Returns:
   * The new length property of the object upon which the method was called.
   *
   */
  unshift(...items: T[]): number {
    const ret = this._value.unshift(...items);
    this.__notifyArrayChanges(true);
    return ret;
  }

  values(): IterableIterator<T> {
    return this._value.values();
  }

  private _rebuildIndexAndFieldName() {
    this._value.forEach((fn: T, i) => {
      // eslint-disable-next-line no-param-reassign
      fn.__meta.fieldName = `[${i}]`;
      // eslint-disable-next-line no-param-reassign
      fn.__meta.index = i;
      // eslint-disable-next-line no-param-reassign
      fn.__meta.deleteArrayNode = ()=>{this.delete(i)}
    });
  }
}
