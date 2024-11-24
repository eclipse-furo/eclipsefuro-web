/* eslint-disable max-classes-per-file, no-use-before-define */

/**
 * notes: i18n is not part of the api anymore
 */
import { ValueState } from './ValueState';
import { ToString, ValueOf } from './CustomPrototypes';
import { CustomConstraints, Validators } from './Validator';
import { OPEN_MODELS_OPTIONS } from './OPEN_MODELS_OPTIONS';
import { FieldConstraints } from './FieldConstraints';

type EventType =
  | 'field-value-changed'
  | 'this-field-value-changed'
  | 'this-state-changed'
  | 'state-changed'
  | 'validity-changed'
  | 'array-changed'
  | 'this-array-changed'
  | 'map-changed'
  | 'this-map-changed'
  | 'model-injected'; // fired before field-value-changed and this-field-value-changed

type Meta = {
  businessVaueState: ValueState;
  index?: number;
  oldValue?: unknown;
  initialValue: unknown; // Initial value from  __updateWithLiteral
  typeName: string; // i.e "furo.fat.Bool"
  fieldName?: string; // field name of this node used by its parent node
  valueState: ValueState;
  stateMessage: string;
  nodeFields: FieldDescriptor[];
  readonly: boolean;
  required: boolean;
  isArrayNode: boolean; // set by array and used by baseName resolver to omit the index in the names
  isRecursionNode: boolean;
  isAnyNode: boolean;
  isValid: boolean;
  isPristine: boolean;
  eventListener: Map<
    string,
    {
      callbackfn: CustomEventListener;
      options?: AddEventListenerOptions | boolean;
    }[]
  >;
};

/**
 * Primitives have always a value field
 */
interface IPrimitive extends FieldNode {
  _value: unknown; // contains the value of the FieldNode
}

interface CustomEventListener {
  (evt: CustomEvent): void;
}

type FieldDescriptor = {
  // camel case name of the field
  fieldName: string;
  // API name of the field, defined by contract.
  protoName: string;
  // class of the type, must start with cap
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FieldConstructor: any; // (new(_initData: any, parent?: FieldNode, parentAttributeName?: string) => FieldNode);
  ValueConstructor?: new () => FieldNode; // used by MAP
  constraints?: FieldConstraints;
};

export interface ValueStateSummary {
  /**
   * path of the field
   *
   * `fullName` for a violation in the `fullName` value
   * `emailAddresses[1].email` for a violation in the `email` field of the first `emailAddresses` message
   * `emailAddresses[3].type[2]` for a violation in the second `type` value in the third `emailAddresses` message.
   */
  field: string;
  state: ValueState;
  message: string;
}

export abstract class FieldNode {
  protected ___isEmpty: boolean = true;

  /**
   * Marker for primitive types
   */
  public __isPrimitive: boolean = false;

  /**
   * Parent node of a node. This is undefined on root nodes.
   */
  public __parentNode: FieldNode | undefined;

  /**
   * Meta data of a field node.
   */
  public __meta: Meta = {
    businessVaueState: ValueState.None,
    readonly: false,
    required: false,
    initialValue: undefined,
    isPristine: true,
    isValid: true,
    valueState: ValueState.None,
    stateMessage: '',
    typeName: '',
    nodeFields: [],
    isArrayNode: false,
    isRecursionNode: false,
    isAnyNode: false,
    eventListener: new Map<string, []>(),
  };

  private ___rootNode: FieldNode;

  private ___readonlyState: Map<FieldNode, boolean> = new Map<
    FieldNode,
    boolean
  >();

  /**
   * Root node of a node
   */
  get __rootNode(): FieldNode {
    return this.___rootNode;
  }

  /**
   * Root node of a node. Do not set this value by yourself.
   * @param value
   */
  set __rootNode(value: FieldNode) {
    this.___rootNode = value;
  }

  /**
   * Empty state of the node
   */
  get __isEmpty() {
    return this.___isEmpty;
  }

  /**
   * Empty state of the node
   * @param empty
   */
  set __isEmpty(empty: boolean) {
    if (empty) {
      this.___isEmpty = true;
    } else {
      this.___updateNotEmptyPath();
      this.__rootNode.__meta.isPristine = false;
    }
  }

  constructor(
    _initData: undefined,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    this.__parentNode = parent;

    if (parent) {
      this.___rootNode = parent.__rootNode;
    } else {
      this.___rootNode = this;
    }

    this.__meta.fieldName = parentAttributeName;
  }

  /**
   * Get a FieldNode by giving a field path using the proto names for the fields.
   *
   *
   *
   * - `email_addresses[3].type[2]` for the second `type` value in the third `email_addresses` message.
   * - `user.location.street` for the street in location in user.
   *
   * @param {string} deepPath - Path of the field.
   */
  __getFieldNodeByPath(deepPath: string = ''): FieldNode | undefined {
    // replace array paths
    const path = deepPath.replaceAll(/[[\]]/g, '.').split('.');
    if (path.length > 0 && path[0] !== '') {
      // rest wieder in error reinwerfen
      // eslint-disable-next-line no-param-reassign
      deepPath = path.slice(1).join('.');
      // convert to camel
      const fieldName = this.__toLowerCamelCase(path[0]) as keyof FieldNode;

      if (deepPath === '') {
        if (this[fieldName]) {
          return this[fieldName] as FieldNode;
        }
      } else if (this[fieldName]) {
        return (this[fieldName] as FieldNode).__getFieldNodeByPath(deepPath);
      }
      return undefined;
    }
    return undefined;
  }

  set __readonly(v: boolean) {
    this.__meta.readonly = v;
    // dispatch to children
    this.__childNodes.forEach(child => {
      if (child instanceof FieldNode) {
        // store readonly state if
        const cro = this.___readonlyState.get(child);
        if (cro === undefined) {
          this.___readonlyState.set(child, child.__readonly);
        }

        if (!child.__readonly && v) {
          // eslint-disable-next-line no-param-reassign
          child.__readonly = v;
        }
      }
    });
  }

  get __readonly(): boolean {
    return this.__meta.readonly;
  }

  /**
   * Build up the model with the literal type. The literal type matches the interface from ITypeName.
   * @param {} literal - The literal type matches the interface from ITypeName.
   */
  __fromLiteral(literal: unknown) {
    this.__updateWithLiteral(literal);
    // clear the state of the validity and value state
    this.__setModelValidStateTrue();

    this.__dispatchEvent(
      new CustomEvent('model-injected', {
        composed: true,
        bubbles: false,
        detail: this,
      }),
    );
    // this.__notifyFieldValueChange(true);
  }

  private __setModelValidStateTrue() {
    this.__meta.isValid = true;
    this.__setValueState(ValueState.None, ['']);
    this.__childNodes.forEach(child => {
      if (child instanceof FieldNode) {
        child.__setModelValidStateTrue();
      }
    });
  }

  /**
   * Updates the model from literal data, without changing the validity and value state.
   *
   * @param literal
   */
  __updateWithLiteral(literal: unknown) {
    this.__clear(true);
    // store injected literal for reset()
    this.__meta.initialValue = literal;
    // a field which is set is not empty
    this.___isEmpty = false;
    const data = structuredClone(literal);

    // go through available fields
    this.__meta.nodeFields.forEach(field => {
      // __clear fields which are not available in literal
      // if the field does not exist on the incoming literal, reset or __clear the value on the fieldNode
      // make an undefined on complex types
      if (
        (data as FieldNode)[field.fieldName as keyof FieldNode] === undefined
      ) {
        if (this[`_${field.fieldName}` as keyof FieldNode] !== undefined) {
          // primitives go to their default values
          (
            this[`_${field.fieldName}` as keyof FieldNode] as FieldNode
          ).__clear();
        }
        return;
      }

      (
        this[`_${field.fieldName}` as keyof FieldNode] as FieldNode
      ).__updateWithLiteral(
        (data as FieldNode)[field.fieldName as keyof FieldNode],
      );

      (
        this[`_${field.fieldName}` as keyof FieldNode] as FieldNode
      ).__meta.isPristine = true;
    });

    this.__notifyFieldValueChange(false);
  }

  __stringify(): string {
    return JSON.stringify(this.__toJson());
  }

  /**
   * Converts the model to a JSON struct wich matches the protobuf spec.
   * If the `UseProtoNames` option is set to false, lowerCamelCase is produced.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  __toJson(): any {
    const d: Record<string, unknown> = {};
    this.__meta.nodeFields.forEach(f => {
      // use jsonName if UseProtoNames is set, otherwise convert to lowerCamel without X prefix
      const jsonName = OPEN_MODELS_OPTIONS.UseProtoNames
        ? f.protoName
        : this.__toLowerCamelCaseWithoutXPrefix(f.protoName);

      if (OPEN_MODELS_OPTIONS.EmitUnpopulated) {
        if (
          (this[`_${f.fieldName}` as keyof FieldNode] as FieldNode).__isEmpty &&
          !(this[`_${f.fieldName}` as keyof FieldNode] as FieldNode)
            .__isPrimitive
        ) {
          d[jsonName] = null;
        } else {
          d[jsonName] = (
            this[`_${f.fieldName}` as keyof FieldNode] as FieldNode
          ).__toJson();
        }
      } else if (
        ((this as FieldNode)[`_${f.fieldName}` as keyof FieldNode] &&
          (!(this[`_${f.fieldName}` as keyof FieldNode] as FieldNode)
            .__isEmpty ||
            (this[`_${f.fieldName}` as keyof FieldNode] as FieldNode).__meta
              .required)) ||
        ((this[`_${f.fieldName}` as keyof FieldNode] as FieldNode)
          .__isPrimitive &&
          OPEN_MODELS_OPTIONS.EmitDefaultValues)
      ) {
        d[jsonName] = (
          this[`_${f.fieldName}` as keyof FieldNode] as FieldNode
        ).__toJson();
      }

      return null;
    });
    return d;
  }

  /**
   * Build up the model, using the transport Json. If UseProtoNames is set to false, lowerCamelCase is expected.
   *
   * @param {JSON} data - Transport Json
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public __fromProtoNameJson(data: any) {
    const l = this.__mapProtoNameJsonToJson(data);
    this.__fromLiteral(l);
  }

  /**
   * Helper function to create a literal type from a json type
   * @param {JSON} data - Transport Json
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  __mapProtoNameJsonToJson(data: any): any {
    const literal: Record<string, unknown> = {};
    // map json to literal
    this.__meta.nodeFields.forEach(f => {
      const jsonName = OPEN_MODELS_OPTIONS.UseProtoNames
        ? f.protoName
        : this.__toLowerCamelCaseWithoutXPrefix(f.protoName);

      if (data[jsonName] !== undefined) {
        literal[f.fieldName] = (
          this[`_${f.fieldName}` as keyof FieldNode] as FieldNode
        ).__mapProtoNameJsonToJson(data[jsonName]);
      }
    });
    return literal;
  }

  /**
   * Converts the model to a literal type. The literal type matches the interface from ITypeName.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public __toLiteral(): any {
    const d: Record<string, unknown> = {};
    this.__meta.nodeFields.forEach(f => {
      if (
        this[`_${f.fieldName}` as keyof FieldNode] &&
        (!(this[`_${f.fieldName}` as keyof FieldNode] as FieldNode).__isEmpty ||
          (this[`_${f.fieldName}` as keyof FieldNode] as FieldNode).__meta
            .required)
      ) {
        d[f.fieldName] = (
          this[`_${f.fieldName}` as keyof FieldNode] as FieldNode
        ).__toLiteral();
      }
      return null;
    });
    return d;
  }

  get __fieldPath(): string {
    const parts: string[] = [];
    this.___pathBuilder(parts);
    return parts.join('.').replaceAll('.[', '['); // replace for array paths
  }

  ___pathBuilder(parts: string[]): string[] {
    // the root node does not have a fieldName
    if (this.__meta.fieldName !== undefined) {
      parts.unshift(
        OPEN_MODELS_OPTIONS.UseProtoNames
          ? this.__toSnakeCase(this.__meta.fieldName)
          : this.__meta.fieldName,
      );
      this.__parentNode?.___pathBuilder(parts);
    }
    return parts;
  }

  /**
   * Returns the formated label using the `OPEN_MODELS_OPTIONS.labelFormatter`
   */
  get __label(): string {
    return OPEN_MODELS_OPTIONS.labelFormatter(this.__getBaseName());
  }

  /**
   * Returns the raw label without any translations, formatters applied.
   *
   *
   */
  get __labelRaw(): string {
    return this.__getBaseName();
  }

  /**
   * Returns the placeholder label using the `OPEN_MODELS_OPTIONS.labelFormatter`
   */
  get __placeholder(): string {
    return OPEN_MODELS_OPTIONS.labelFormatter(
      `${this.__getBaseName()}.placeholder`,
    );
  }

  /**
   * Returns the formated aria description using the `OPEN_MODELS_OPTIONS.labelFormatter`
   */
  get __ariaDescription(): string {
    return OPEN_MODELS_OPTIONS.labelFormatter(
      `${this.__getBaseName()}.description`,
    );
  }

  /**
   * Returns a list of all states of a node and its children.
   *
   * ```json
   * [
   *   {
   *      "field": "id",
   *      "state": "Error",
   *      "message": "This field is invalid"
   *   },
   *     {
   *      "field": "display_name",
   *      "state": "Error",
   *      "message": "This field is invalid"
   *   }
   * ]
   * ```
   */
  // eslint-disable-next-line class-methods-use-this
  public __getAllStates(): ValueStateSummary[] {
    return this.___getAllStates([]);
  }

  private ___getAllStates(carrier: ValueStateSummary[]): ValueStateSummary[] {
    if (this.__meta.valueState !== ValueState.None) {
      carrier.push({
        field: this.__fieldPath,
        state: this.__meta.valueState,
        message: this.__meta.stateMessage,
      });
    }
    this.__childNodes.forEach(child => {
      if (child instanceof FieldNode) {
        child.___getAllStates(carrier);
      }
    });
    return carrier;
  }

  /**
   * Clears all value states recursively
   */
  public __clearAllValueStates() {
    this.__meta.valueState = ValueState.None;
    this.__meta.stateMessage = '';
    this.__childNodes.forEach(child => {
      if (child instanceof FieldNode) {
        child.__clearAllValueStates();
      }
    });

    this.__dispatchEvent(
      new CustomEvent('state-changed', {
        detail: this,
        bubbles: false,
      }),
    );
  }

  /**
   * Applies a list of  states to a node and its children.
   *
   * Keep in mind, that the message must be already translated.
   *
   * ```json
   * {
   *    "field": "id",
   *    "state": "Error",
   *    "message": "This field is invalid"
   *}
   *
   * ```
   *
   */
  public __applyValueStates(...states: ValueStateSummary[]) {
    states.forEach(state => {
      const fn = this.__getFieldNodeByPath(state.field);
      if (fn !== undefined) {
        const validStateBefore = fn.__meta.isValid;
        fn.__meta.valueState = state.state;
        fn.__meta.stateMessage = state.message;
        fn.__meta.isValid = state.state !== ValueState.Error;
        fn.__meta.businessVaueState = state.state;
        if (fn.__meta.isValid !== validStateBefore) {
          fn.__dispatchEvent(
            new CustomEvent('validity-changed', {
              detail: fn,
              bubbles: true,
            }),
          );
        }

        fn.__dispatchEvent(
          new CustomEvent('state-changed', {
            detail: fn,
            bubbles: false,
          }),
        );
      }
    });
  }

  /**
   * Returns the valid state of a node.
   * - A node is valid when all children are valid.
   * - A node is valid when freshly initialized, even when some children have invalid values.
   *
   * use `validate()` to be sure to have the correct validity state.
   *
   * Use __meta.StateMessage to receive the state of a node. The `__meta.StateMessage` is only available on an explicit field, where the validity state is populated upwards.
   */
  public get __isValid(): boolean {
    return this.__meta.isValid;
  }

  /**
   * set the validity of the node. This will trigger no events, just set the __meta.isValid value.
   *
   * Use this in your customValidators.
   * @param valid
   */
  public __setValidState(valid: boolean): void {
    this.__meta.isValid = valid;
  }

  /**
   * Initialized fields are pristine as long nothing changes inside the model.
   *
   * Use this on rootNodes only.
   */
  public get __isPristine(): boolean {
    return this.__meta.isPristine;
  }

  /**
   * The toString() method of Object instances returns a string representing this object. This method is meant to be overridden by `CustomPrototypes.ToString`.
   * If no `CustomPrototypes` is set, it will try to find a display_name attribute on the node and uses that for the output.
   *
   * If there is no display_name `[object TypeName]` is returned.
   */
  public toString(): string {
    const ts = ToString.get(this.__meta.typeName || '');
    if (ts) {
      return ts(this);
    }
    const found = this.__meta.nodeFields.find(
      fieldDescriptor => fieldDescriptor.fieldName === 'displayName',
    );
    if (
      found &&
      (this['displayName' as keyof FieldNode] as FieldNode).__meta.typeName ===
        'primitives.STRING'
    ) {
      return (this['displayName' as keyof FieldNode] as FieldNode).toString();
    }
    return `[object ${this.__meta.typeName}]`;
  }

  /**
   * The valueOf() method of Object instances converts the this value to an object.
   * This method is meant to be overridden by derived objects for custom type conversion logic.
   */
  public valueOf(): number {
    const ts = ValueOf.get(this.__meta.typeName || '');
    if (ts) {
      return ts(this);
    }
    return NaN;
  }

  /**
   * Helper method to build up labels, placeholders,...
   * @protected
   */
  protected __getBaseName(): string {
    const parts: string[] = [];
    this.___fieldNameBuilder(parts);
    return parts.join('.');
  }

  /**
   * Helper method to construct the __fieldPath
   * @param parts
   * @protected
   */
  protected ___fieldNameBuilder(parts: string[]): string[] {
    // stop if parent node has same typeName, we are on a recursion.
    if (this.__meta.isRecursionNode || this.__meta.isAnyNode) {
      parts.unshift(this.__meta.typeName as string);
    } else {
      // do not add the index to the baseName on Array fields
      if (!this.__meta.isArrayNode) {
        // the root node does not have a fieldName, so we use the typeName
        parts.unshift(
          // eslint-disable-next-line no-nested-ternary
          this.__meta.fieldName
            ? OPEN_MODELS_OPTIONS.UseProtoNames
              ? this.__toSnakeCase(this.__meta.fieldName)
              : this.__meta.fieldName
            : this.__meta.typeName || '',
        );
      }
      this.__parentNode?.___fieldNameBuilder(parts);
    }
    return parts;
  }

  /**
   * Validate the node and all child nodes of it.
   */
  public __validate() {
    const validStateBefore = this.__meta.isValid;
    // trigger the local listeners
    this.__validationExecuter(this);

    let allChildrenValid = true;
    // do not go deeper if node is invalid, because business validators can set sub fields

    // dispatch to children
    this.__childNodes.forEach(child => {
      if (child instanceof FieldNode) {
        if (child.__meta.businessVaueState === ValueState.None) {
          // this only check constraints, but business errors are higher order
          child.__validate();
        }

        if (!child.__isValid) {
          allChildrenValid = false;
        }
      }
    });

    this.__meta.isValid = allChildrenValid && this.__isValid;
    if (this.__meta.isValid !== validStateBefore) {
      this.__dispatchEvent(
        new CustomEvent('validity-changed', {
          detail: this,
          bubbles: false,
        }),
      );
    }
  }

  /**
   * Validates all parents of an element. This is done when you set a value on any child/attribute of a node directly
   * @param {FieldNode} node - Any FieldNode
   */
  protected __validateBottomUp(node: FieldNode) {
    // "this" is usually the parent node of "node"
    this.__validationExecuter(node);
    // climb up and check children state to define the own state of "this"
    node.__climbUpValidation();
  }

  /**
   * Validates all parent nodes if a sub-field was changed.
   * @protected
   */
  protected __climbUpValidation() {
    const validStateBefore = this.__meta.isValid;
    this.__validationExecuter(this);

    let allChildrenValid = true;
    this.__childNodes.forEach(child => {
      if (child instanceof FieldNode) {
        if (!child.__isValid) {
          allChildrenValid = false;
        }
      }
    });
    // if any child is not valid, this is also not valid
    this.__meta.isValid = allChildrenValid && this.__isValid;
    if (this.__meta.isValid !== validStateBefore) {
      this.__dispatchEvent(
        new CustomEvent('validity-changed', {
          detail: this,
          bubbles: false,
        }),
      );
    }

    if (this.__parentNode) {
      this.__parentNode.__climbUpValidation();
    }
  }

  /**
   * Additional "constraint" checker for primitive types, i.e. INT32 can only range from -2147483648 to 2147483647, but js uses always a float64 to handle numbers
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  protected __checkTypeBoundaries(): string[] | undefined {
    return undefined;
  }

  /**
   * Executes the validation process.
   * @param node
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  protected __validationExecuter(node: FieldNode) {
    const validatorFunc = Validators.get(node.__meta.typeName);
    const customConstraintsFunc = CustomConstraints.get(node.__meta.typeName);
    const fieldConstraints = node.__getConstraints();
    let constraintMessage: undefined | string[];

    constraintMessage = this.__checkTypeBoundaries();

    if (
      validatorFunc ||
      fieldConstraints ||
      customConstraintsFunc ||
      constraintMessage
    ) {
      if (fieldConstraints && !customConstraintsFunc) {
        constraintMessage = node.__checkConstraints(fieldConstraints);
      }
      if (customConstraintsFunc) {
        constraintMessage = customConstraintsFunc(node);
      }
      if (validatorFunc) {
        validatorFunc(node);
      } else if (constraintMessage === undefined) {
        node.__setValueState(ValueState.None, ['']);
      }
      if (constraintMessage !== undefined) {
        node.__setValueState(ValueState.Error, constraintMessage);
      }
    } else {
      node.__setValueState(ValueState.None, ['']);
    }
  }

  /**
   * Receives all constraints of a node. Use this in your custom validators or components.
   */
  public __getConstraints(): FieldConstraints | undefined {
    if (this.__meta.isArrayNode && this.__parentNode?.__parentNode) {
      const fieldDescriptor =
        this.__parentNode.__parentNode.__meta.nodeFields.find(
          f => f.fieldName === this.__parentNode!.__meta.fieldName,
        );
      return fieldDescriptor?.constraints;
    }

    if (this.__parentNode) {
      const fieldDescriptor = this.__parentNode.__meta.nodeFields.find(
        f => f.fieldName === this.__meta.fieldName,
      );
      return fieldDescriptor?.constraints;
    }
    return undefined;
  }

  /**
   * Set the value state
   * @param {ValueState} state - The state of the node.
   * @param {string[]} message - Description for the formatter.
   */
  __setValueState(state: ValueState, message: string[]) {
    this.__meta.valueState = state;
    this.__meta.stateMessage = OPEN_MODELS_OPTIONS.valueStateMessageFormatter(
      message[0],
      ...message.slice(1),
    );
    // set invalid on error state
    // the event is sent from ...
    this.__meta.isValid = state !== ValueState.Error;

    this.__dispatchEvent(
      new CustomEvent('state-changed', {
        detail: this,
        bubbles: false,
      }),
    );
  }

  /**
   * Resets the node to the last inserted literal or to the initial state.
   * // todo: reset to default values not just the empty state
   */
  public __reset() {
    if (this.__meta.initialValue !== undefined) {
      this.__updateWithLiteral(this.__meta.initialValue);
      return;
    }
    // else re init every field downwards
    this.__clear();
  }

  /**
   * Clear clears the element downwards and set __isEmpty to true on all sub nodes.
   *
   * A cleared field is not populated on `__toLiteral` or `__toJson` when the option `EmitUnpopulated` or `EmitDefaultValues` is set to false.
   */
  public __clear(withoutNotification: boolean = false) {
    this.__isEmpty = true;

    // __clear every childNode too
    this.__meta.nodeFields.forEach(descriptor => {
      (
        this[`_${descriptor.fieldName}` as keyof FieldNode] as FieldNode
      ).__clear();
    });
    if (!withoutNotification) {
      this.__notifyFieldValueChange(false);
    }
    // todo: set to values to default value or initial
    // todo: set state to None
    // todo: set valid to true
  }

  /**
   * Helper method to update a skalar / primitive field of a type. Used by the generated models.
   * Triggers also the validation and clearance, if needed.
   *
   * @param {FieldNode} targetNode - The field of a FieldNode
   * @param {string | boolean | number} value - The value you want to set
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  protected __PrimitivesSetter(targetNode: IPrimitive, value: unknown) {
    // do not do anything if current value equals val
    if (targetNode._value !== value) {
      targetNode._value = value; // eslint-disable-line no-param-reassign

      targetNode.__isEmpty = false; // eslint-disable-line no-param-reassign
      this.__validateBottomUp(targetNode);
      targetNode.__notifyFieldValueChange(true);
    }
  }

  /**
   * Helper method to update a field of a type. Used by the generated models.
   * Triggers also the validation and clearance, if needed.
   *
   * @param {FieldNode} targetNode - The field of a FieldNode
   * @param {} literalData - The literal type matches the interface from ITypeName.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  protected __TypeSetter(
    targetNode: FieldNode,
    literalData: unknown | undefined | null,
  ) {
    if (literalData === undefined || literalData === null) {
      targetNode.__clear();
      this.__validateBottomUp(targetNode);
      targetNode.__notifyFieldValueChange(true);
      return;
    }

    targetNode.__updateWithLiteral(literalData); // keep the references by getting the values
    // this is the parent of the target_node
    targetNode.___updateNotEmptyPath();
    this.__validateBottomUp(targetNode);
    targetNode.__notifyFieldValueChange(true);
  }

  /**
   * Notifies field changes
   * @param bubbles
   * @protected
   */
  protected __notifyFieldValueChange(bubbles?: boolean) {
    this.__dispatchEvent(
      new CustomEvent('this-field-value-changed', {
        detail: this,
        bubbles: false,
      }),
    );

    if (bubbles) {
      //    console.log('bubble', this.__meta.typeName)
      this.__dispatchEvent(
        new CustomEvent('field-value-changed', {
          detail: this,
          bubbles: true,
        }),
      );
    } else {
      //   console.log('non', this.__meta.typeName)
      this.__dispatchEvent(
        new CustomEvent('field-value-changed', {
          detail: this,
          bubbles: false,
        }),
      );
    }
  }

  /**
   * Returns the child nodes of a node.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get __childNodes(): any[] {
    return this.__meta.nodeFields.map(
      field => this[field.fieldName as keyof FieldNode],
    );
  }

  /**
   * Broadcast an event to all child nodes of a field node.
   * @param event
   */
  __broadcastEvent(event: CustomEvent) {
    // trigger the local listeners
    this.__triggerNodeEvents(event);

    // dispatch to children
    this.__childNodes.forEach(child => {
      if (child instanceof FieldNode) {
        child.__broadcastEvent(event);
      }
    });
  }

  /**
   * Dispatches a custom event on a FieldNode
   * @param {CustomEvent} event - A generic custom event.
   */
  __dispatchEvent(event: CustomEvent): CustomEvent {
    // trigger the events on current node
    this.__triggerNodeEvents(event);

    // go to parent
    if (event.bubbles && this.__parentNode !== undefined) {
      return this.__parentNode.__dispatchEvent(event);
    }
    return event;
  }

  /**
   * Helper method to invoke/execute the event on the current node
   * @param event
   * @protected
   */
  protected __triggerNodeEvents(event: CustomEvent<FieldNode>) {
    if (
      this.__meta.eventListener.has(event.type) &&
      this.__meta.eventListener.get(event.type)!.length > 0
    ) {
      this.__meta.eventListener
        .get(event.type)!
        .forEach((t, i, listenerArray) => {
          t.callbackfn(event);
          if (
            t.options !== undefined &&
            typeof t.options !== 'boolean' &&
            t.options.once
          ) {
            // eslint-disable-next-line no-param-reassign
            delete listenerArray[i];
          }
        });
    }
  }

  /**
   * Add a handler to a node
   * @param {string} type - A case-sensitive string representing the event type to listen for.
   * @param {function} listener - The object that receives a notification (an object that implements the Event interface) when an event of the specified type occurs. This must be null, an object with a handleEvent() method, or a JavaScript function. See The event listener callback for details on the callback itself.
   * @param {} options - An object that specifies characteristics about the event listener. \n\nThe available option is `once:boolean`
   */
  public __addEventListener(
    type: EventType,
    listener: CustomEventListener,
    options?: boolean | AddEventListenerOptions,
  ): void {
    if (!this.__meta.eventListener.has(type)) {
      this.__meta.eventListener.set(type, []);
    }
    this.__meta.eventListener
      .get(type)!
      .push({ callbackfn: listener, options });
  }

  // add a listener for a custom event, defined and triggered by yourself
  // this could be something like 'focus-requested'
  public __addCustomEventListener(
    type: string,
    handler: CustomEventListener,
    options?: boolean | AddEventListenerOptions,
  ): void {
    if (!this.__meta.eventListener.has(type)) {
      this.__meta.eventListener.set(type, []);
    }
    this.__meta.eventListener.get(type)!.push({ callbackfn: handler, options });
  }

  /**
   * Removes the handler from a node
   * @param type
   * @param handler
   * @param options
   */
  public __removeEventListener(
    type: EventType,
    handler: CustomEventListener,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: boolean | EventListenerOptions,
  ): void {
    if (this.__meta.eventListener.has(type)) {
      this.__meta.eventListener.set(
        type,
        this.__meta.eventListener
          .get(type)!
          .filter(e => e.callbackfn !== handler),
      );
    }
  }

  /**
   * Removes the handler from a node
   * @param type
   * @param handler
   * @param options
   */
  public __removeCustomEventListener(
    type: string,
    handler: CustomEventListener,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: boolean | EventListenerOptions,
  ): void {
    if (this.__meta.eventListener.has(type)) {
      this.__meta.eventListener.set(
        type,
        this.__meta.eventListener
          .get(type)!
          .filter(e => e.callbackfn !== handler),
      );
    }
  }

  /**
   * if some child is not empty, set isEmpty to false, all the way up to the root node
   * @private
   */
  protected ___updateNotEmptyPath() {
    this.___isEmpty = false;
    if (this.__parentNode !== undefined && this.__parentNode.__isEmpty) {
      this.__parentNode.___updateNotEmptyPath();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  protected __checkConstraints(
    fieldConstraints: FieldConstraints,
  ): string[] | undefined {
    if (fieldConstraints.required) {
      if (this.__isEmpty) {
        return ['constraint.violation.required'];
      }
    }
    return undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  private __toLowerCamelCase(string: string) {
    if (OPEN_MODELS_OPTIONS.UseProtoNames) {
      const [start, ...rest] = (
        string[0] === '_' ? string.replace('_', 'X') : string
      ).split('_');
      return (
        start +
        rest
          .map(s => {
            if (s.length === 0) return '';
            return s[0].toUpperCase() + s.slice(1);
          })
          .join('')
      );
    }
    return string;
  }

  // eslint-disable-next-line class-methods-use-this
  private __toLowerCamelCaseWithoutXPrefix(string: string) {
    if (OPEN_MODELS_OPTIONS.UseProtoNames) {
      const [start, ...rest] = (
        string[0] === '_' ? string.replace('_', 'X') : string
      ).split('_');
      return (
        start +
        rest
          .map(s => {
            if (s.length === 0) return '';
            return s[0].toUpperCase() + s.slice(1);
          })
          .join('')
      );
    }
    return string;
  }

  // eslint-disable-next-line class-methods-use-this
  private __toSnakeCase(string: string): string {
    return string
      .split(/(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  }
}
