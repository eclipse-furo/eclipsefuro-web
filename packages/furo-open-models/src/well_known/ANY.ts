// scalar and any typeName
import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';

export interface IAny {
  '@type': string;
  [key: string]: unknown;
}

export class ANY extends FieldNode {
  private _value: FieldNode | undefined;

  private _typeName: string = '';

  private _originalTypeName: string = '';

  constructor(
    initData?: IAny,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = `google.protobuf.Any`;
  }

  __clear() {
    this.__isEmpty = true;
    this._value = undefined;
  }

  // used by broadcast
  public get __childNodes(): FieldNode[] {
    if (this._value) {
      return [this._value];
    }
    return [];
  }

  get value() {
    return this._value;
  }

  set value(a: FieldNode | undefined) {
    this._value = a;
  }

  get typeName(): string {
    return this._typeName;
  }

  __toJson(): object | null {
    if (this._value !== undefined) {
      const d = this._value?.__toJson();
      d['@type'] = this._originalTypeName; //  send back the original type name instead of this._value?.__meta.typeName;
      return d;
    }
    return null;
  }

  __toLiteral(): object | null {
    if (this._value !== undefined) {
      const d = this._value?.__toLiteral();
      d['@type'] = this._originalTypeName; //  send back the original type name instead of this._value?.__meta.typeName;
      return d;
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  __mapProtoNameJsonToJson(data: any): any {
    if (data['@type'] === undefined) {
      // eslint-disable-next-line no-console
      console.error(`@type is not defined: ${data['@type']}`, data);
      return undefined;
    }

    const originalTypeName = data['@type'];
    // create a dummy object
    const fn = Registry.createInstanceByTypeName(
      data['@type'].split('/').pop(), // typename
      data,
      this,
      'value',
    );

    const literal = fn.__mapProtoNameJsonToJson(data);
    literal['@type'] = originalTypeName;

    return literal;
  }

  __updateWithLiteral(data: IAny) {
    if (data['@type'] === undefined) {
      // eslint-disable-next-line no-console
      console.error(`@type is not defined: ${data['@type']}`, data);
      return;
    }
    this._originalTypeName = data['@type'];
    const typeName = data['@type'].split('/').pop();
    if (typeName) {
      this._typeName = typeName;
      try {
        this.value = Registry.createInstanceByTypeName(
          this._typeName,
          data,
          this,
          'value',
        );
        this.value.__meta.isAnyNode = true;
        this.__isEmpty = false;
        this.__notifyFieldValueChange(false);
      } catch (err) {
        // eslint-disable-next-line
        console.error(err);
        this.__isEmpty = true;
        this.__notifyFieldValueChange(false);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Could not resolve type from empty type field: ${data['@type']}`,
        data,
      );
    }
  }
}
