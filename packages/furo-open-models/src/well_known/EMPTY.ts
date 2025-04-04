import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';

export class EMPTY extends FieldNode {
  get value(): Record<string, never> {
    return this._value;
  }

  set value(value: Record<string, never>) {
    this.__isEmpty = true;
  }

  public _value: Record<string, never> = {};

  constructor(
    initData?: Record<string, never>,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = true;
    this.__meta.typeName = 'google.protobuf.Empty';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __updateWithLiteral(_: Record<string, never>) {
    this.__isEmpty = false;
  }

  // eslint-disable-next-line class-methods-use-this
  __mapProtoNameJsonToJson(data: number): number {
    return data;
  }

  __toJson(): Record<string, never> | null {
    return this.__toLiteral();
  }

  valueOf(): number {
    return this._value ? 1 : 0;
  }

  __toLiteral() {
    return this._value;
  }

  toString(): string {
    if (this._value !== null) {
      return this._value.toString();
    }
    return '';
  }

  public __clear() {
    this._value = {};
    this.__isEmpty = true;
    // empty never changes
  }
}

Registry.register('google.protobuf.Empty', EMPTY);
