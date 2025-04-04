import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';
import { FieldConstraints } from '../FieldConstraints';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';

export class BoolValue extends FieldNode {
  get value(): boolean {
    return this._value;
  }

  set value(value: boolean) {
    this._value = value;
    if (
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    ) {
      this.__isEmpty = false;
    } else {
      this.__isEmpty = value === null;
    }

    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: boolean = false;

  constructor(
    initData?: boolean,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
    this._value = initData || false;
    this.__meta.typeName = 'google.protobuf.BoolValue';
  }

  __updateWithLiteral(v: boolean) {
    this._value = v;
    if (
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    ) {
      this.__isEmpty = false;
    } else {
      this.__isEmpty = v === null;
    }
    this.__notifyFieldValueChange(false);
  }

  // eslint-disable-next-line class-methods-use-this
  __mapProtoNameJsonToJson(data: number): number {
    return data;
  }

  __toJson(): boolean | null {
    return this.__toLiteral();
  }

  valueOf(): number {
    return this._value ? 1 : 0;
  }

  __toLiteral() {
    return this._value;
  }

  protected __checkConstraints(
    fieldConstraints: FieldConstraints,
  ): string[] | undefined {
    // eslint-disable-next-line guard-for-in
    for (const [constraint] of Object.entries(fieldConstraints)) {
      if (constraint === 'required') {
        if (this._value === false) {
          return ['constraint.violation.required'];
        }
      }
    }

    return undefined;
  }

  toString(): string {
    if (this._value !== null) {
      return this._value.toString();
    }
    return '';
  }

  public __clear(withoutNotification: boolean = false) {
    const shouldNotify = this._value === true;
    this._value = false;
    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
    if (shouldNotify && !withoutNotification) {
      this.__notifyFieldValueChange(false);
    }
  }

}

Registry.register('BoolValue', BoolValue);
