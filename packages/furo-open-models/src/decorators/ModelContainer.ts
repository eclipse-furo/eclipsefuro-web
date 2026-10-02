import { ModelBindings, type BindableModel, type ModelBindingDecorators } from "./ModelDecorators";

/**
 * The literal interface a generated model round-trips through, e.g. `CubeFilter` -> `ICubeFilter`.
 *
 * Read off `toLiteral()`, which protoc-gen-open-models types per message, so a container only has to
 * name its model and still gets completing paths. A model without a typed `toLiteral()` - an `ARRAY`,
 * for one - has to state its literal itself.
 */
type LiteralOf<TModel> = TModel extends { toLiteral: () => infer L extends object } ? L : Record<string, never>;

/**
 * Base class for singleton model containers. It holds the model and hands out the decorators that
 * bind a component to it, so a component writes `@MyModel.decorators.bind("path")` without a separate
 * Decorators export.
 *
 * The decorators sit under `decorators` rather than on the container itself, so a subclass surface is
 * only its model and its own helpers - nothing generic occupying `bind`:
 *
 * ```typescript
 * class CubeFilterContainer extends ModelContainer<CubeFilter, ICubeFilter> {
 *   constructor() {
 *     super(new CubeFilter(defaultFilter));
 *   }
 * }
 *
 * export const CubeFilterModel = new CubeFilterContainer();
 * ```
 *
 * The second type argument is what `bind("...")` completes from. It may be omitted - it defaults to
 * the return type of the model's own `toLiteral()`, which is the same interface - and is worth
 * spelling out only to pin the pairing explicitly, or when the model has no typed `toLiteral()`.
 */
export class ModelContainer<TModel extends BindableModel, TLiteral extends object = LiteralOf<TModel>> {
  /**
   * The decorators a component binds to this model with.
   * - `decorators.bind(path, eventType)` - keep a property in step with a field
   * - `decorators.onEvent(eventType)` - call a method on a root event
   * - `decorators.onFieldEvent(path, eventType)` - call a method on a field's event
   */
  readonly decorators: ModelBindingDecorators<TLiteral>;

  constructor(readonly model: TModel) {
    this.decorators = ModelBindings<TLiteral>(model);
  }
}
