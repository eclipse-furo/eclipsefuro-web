import type { FieldConstraints } from '../FieldConstraints';
import { FieldNode } from '../FieldNode';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';
import { Registry } from '../Registry';

export class BoolValue extends FieldNode {
  get value(): boolean {
    return this._value!;
  }

  set value(value: boolean | null) {
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

  public _value: boolean | null = false;

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
    this._value = initData ?? false;
    this.__meta.typeName = 'google.protobuf.BoolValue';
  }

  override __updateWithLiteral(v: boolean | null) {
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
  override __mapProtoNameJsonToJson(data: number): number {
    return data;
  }

  override __toJson(): boolean | null {
    return this.__toLiteral();
  }

  override valueOf(): number {
    return this._value ? 1 : 0;
  }

  override __toLiteral() {
    return this._value;
  }

  protected override __checkConstraints(
    fieldConstraints: FieldConstraints,
  ): string[] | undefined {
     
    for (const [constraint] of Object.entries(fieldConstraints)) {
      if (constraint === 'required') {
        if (!this._value) {
          return ['constraint.violation.required'];
        }
      }
    }

    return undefined;
  }

  override toString(): string {
    if (this._value !== null) {
      return this._value.toString();
    }
    return '';
  }

  public override __clear(withoutNotification = false) {
    const shouldNotify = this._value;
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
