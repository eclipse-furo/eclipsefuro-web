// scalar and recursion typeName
import { FieldNode } from '../FieldNode';

export class RECURSION<T extends FieldNode, I> extends FieldNode {
  private _value: T | undefined;

  constructor(initData?: I, parent?: FieldNode, parentAttributeName?: string) {
    super(undefined, parent, parentAttributeName);
    this.__isPrimitive = true;
    this.__meta.typeName = `primitives.RECURSION`;
  }

  __clear() {
    this.__isEmpty = true;
    this._value = undefined;
  }

  get value(): T | undefined {
    return this._value;
  }

  set value(a: T) {
    this._value = a;
  }

  __toJson(): object | null {
    if (this._value !== undefined) {
      return this._value?.__toJson();
    }
    return null;
  }

  __toLiteral(): object | null {
    if (this._value !== undefined) {
      return this._value?.__toLiteral();
    }
    return null;
  }

  ___pathBuilder(parts: string[]): string[] {
    // pass to parents
    return (this.__parentNode as FieldNode).___pathBuilder(parts);
  }

  __updateWithLiteral(initData: I[]) {
    if (this.__parentNode !== undefined) {
      this._value = new (this.__getConstructor())();
      this._value.__parentNode = this;
      this._value.__meta.fieldName = this.__meta.fieldName;
      this._value.__updateWithLiteral(initData);
      this._value.__meta.isRecursionNode = true;
      this.__isEmpty = false;
      this.__notifyFieldValueChange(false);
    }
  }

  private __getConstructor(): new () => T {
    const fieldDescriptor = this.__parentNode!.__meta.nodeFields.find(
      f => f.fieldName === this.__meta.fieldName,
    );

    return fieldDescriptor?.FieldConstructor as new () => T;
  }
}
