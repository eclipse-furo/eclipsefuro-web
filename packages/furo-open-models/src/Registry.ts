/**
 * notes:
 * primitives are also registered
 */
import { FieldNode } from './FieldNode';

const registry: Map<string, FieldNode> = new Map<string, FieldNode>();

export class Registry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static register(type: string, clazz: any) {
    registry.set(type, clazz);
  }

  private static get(
    typename: string,
  ): new (
    initData?: object,
    parent?: FieldNode | undefined,
    attributeName?: string | undefined,
  ) => FieldNode {
    const clazz = registry.get(typename);
    if (clazz !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return clazz as any;
    }
    throw new Error(
      `Cannot find type ${typename}, ${typename} is not in the registry`,
    );
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
    attributeName?: string,
  ): FieldNode {
    const ConstructorName = Registry.get(typename);
    return new ConstructorName(initData, parent, attributeName);
  }
}
