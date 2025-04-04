import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';

export class BOOLEAN extends FieldNode {
  get value(): boolean {
    return this._value;
  }

  set value(value: boolean) {
    this._value = value;
    this.__isEmpty = false;
    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  /**
   * Toggle the value of the bool.
   */
  toggle() {
    this.value = !this._value;
  }

  public _value: boolean;

  constructor(
    initData?: boolean,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__isPrimitive = true;
    this._value = initData || false;
    this.__meta.typeName = 'primitives.BOOLEAN';
    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
  }

  __updateWithLiteral(v: boolean) {
    this._value = v;
    if (!this._value) {
      this.__isEmpty = !(
        OPEN_MODELS_OPTIONS.EmitDefaultValues ||
        OPEN_MODELS_OPTIONS.EmitUnpopulated
      );
    } else {
      this.__isEmpty = false;
    }
    this.__notifyFieldValueChange(false);
  }

  protected ___updateNotEmptyPath() {
    if (this._value === false) {
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
  __mapProtoNameJsonToJson(data: boolean): boolean {
    return data;
  }

  __toJson(): boolean {
    return this.__toLiteral();
  }

  __toLiteral() {
    return this._value;
  }

  toString(): string {
    return this._value.toString();
  }

  public __clear(withoutNotification: boolean = false) {
    // only notify when they are changes
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

Registry.register('boolean', BOOLEAN);
