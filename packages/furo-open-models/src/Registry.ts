/**
 * notes:
 * primitives are also registered
 */
import { FieldNode } from "./FieldNode";

const registry: Map<string, FieldNode> = new Map<string, FieldNode>();

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- converting to functions changes public API
export class Registry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static register(type: string, clazz: any) {
    registry.set(type, clazz as FieldNode);
  }

  private static get(typename: string): new (initData?: object, parent?: FieldNode, attributeName?: string) => FieldNode {
    const clazz = registry.get(typename);
    if (clazz !== undefined) {
      return clazz as unknown as new (initData?: object, parent?: FieldNode, attributeName?: string) => FieldNode;
    }
    throw new Error(`Cannot find type ${typename}, ${typename} is not in the registry`);
  }

  /**
   * Checks whether a given type is registered.
   *
   * @param {string} type - The name of the type to check for registration.
   * @returns {boolean} `true` if the specified type is registered; otherwise, `false`.
   */
  public static isRegistered(type: string): boolean {
    return registry.has(type);
  }

  /**
   * Internal method to create instances for Any
   * @param typename
   * @param initData
   * @param parent
   * @param attributeName
   */
  static createInstanceByTypeName(
    typename: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initData?: any,
    parent?: FieldNode,
    attributeName?: string
  ): FieldNode {
    const ConstructorName = Registry.get(typename);
    return new ConstructorName(initData as object | undefined, parent, attributeName);
  }
}
