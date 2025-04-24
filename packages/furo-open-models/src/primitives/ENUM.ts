import { FieldNode } from '../FieldNode';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';

function isEnumMember<E>(
  value: unknown,
  enumArg: Record<string | number | symbol, E>,
): value is E {
  return (Object.values(enumArg) as unknown[]).includes(value);
}

export class ENUM<T> extends FieldNode {
  // use this to translate the enums
  public msg = OPEN_MODELS_OPTIONS.labelFormatter;

  private _nullValue: T;

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
    if (this._value === this._nullValue) {
      this.__isEmpty = !(
        OPEN_MODELS_OPTIONS.EmitDefaultValues ||
        OPEN_MODELS_OPTIONS.EmitUnpopulated
      );
    } else {
      this.__isEmpty = false;
    }
    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: T;

  private _initialValue: T;

  enumArg: Record<string | number | symbol, T>;

  constructor(
    initData: T | undefined,
    enumArg: Record<string | number | symbol, T>,
    defaultValue: T,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__isPrimitive = true;
    this.__meta.typeName = 'primitives.ENUM';
    this._value = initData !== undefined ? initData : defaultValue;
    this._initialValue = defaultValue;
    this._nullValue = defaultValue;
    this.enumArg = enumArg;
  }

  // use the initial value if a value out of range was set
  __updateWithLiteral(v: T) {
    if (isEnumMember(v, this.enumArg)) {
      this._value = v;
      this._initialValue = v;
      if (this._value === this._nullValue) {
        this.__isEmpty = !(
          OPEN_MODELS_OPTIONS.EmitDefaultValues ||
          OPEN_MODELS_OPTIONS.EmitUnpopulated
        );
      } else {
        this.__isEmpty = false;
      }
    } else {
      this._value = this._initialValue;
    }
    this.__notifyFieldValueChange(false);
  }

  __toJson(): string {
    return this.__toLiteral();
  }

  protected ___updateNotEmptyPath() {
    if (this._value === this._nullValue) {
      this.___isEmpty = !(
        OPEN_MODELS_OPTIONS.EmitDefaultValues ||
        OPEN_MODELS_OPTIONS.EmitUnpopulated
      );
    } else {
      this.___isEmpty = false;
      super.___updateNotEmptyPath();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  __mapProtoNameJsonToJson(data: string): string {
    return data;
  }

  __toLiteral(): string {
    return this._value as string;
  }

  toString(): string {
    return this.msg(this._value as string);
  }

  public __clear(withoutNotification: boolean = false) {
    // only notify when they are changes
    const shouldNotify = this._value !== this._nullValue;
    this._value = this._nullValue;
    if (shouldNotify && !withoutNotification) {
      this.__notifyFieldValueChange(false);
    }
  }
}
