import { FieldNode } from "../FieldNode";
import { protoNameToJsonName } from "../Mapper";

/**
 * The `google.api.http` url building shared by every fetcher.
 *
 * Extracted from StrictFetcher so StreamFetcher builds its url the exact same way. Nothing here
 * is stream specific: a streaming rpc resolves its path template and its query parameters under
 * the same rules as a unary one.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldNodeConstructor = new (initData?: any, parent?: FieldNode, parentAttributeName?: string) => FieldNode;

/**
 * The subset of IApiOptions that url building needs.
 *
 * Declared structurally rather than imported, so this module stays free of a cycle back to
 * StrictFetcher. Both IApiOptions declarations satisfy it.
 */
export interface IUrlOptions {
  serverAddr: string;
  ApiBaseURL: string;
  UseProtoNames: boolean;
  UseProtoNamesForQueryParams: boolean;
}

/**
 * The request type's field descriptors, read once per fetcher.
 */
export interface RequestDescriptors {
  // camelCase fieldName → protoName
  protoNames: Map<string, string>;
  // camelCase fieldName → FieldConstructor
  fieldConstructors: Map<string, FieldNodeConstructor>;
}

/**
 * Read the field descriptors off a request type, the way every fetcher does in its constructor.
 */
export function describeRequest(ReqType: FieldNodeConstructor): RequestDescriptors {
  const protoNames = new Map<string, string>();
  const fieldConstructors = new Map<string, FieldNodeConstructor>();

  const tempReq = new ReqType();
  tempReq.__meta.nodeFields.forEach(field => {
    protoNames.set(field.fieldName, field.protoName);
    fieldConstructors.set(field.fieldName, field.FieldConstructor as FieldNodeConstructor);
  });

  return { protoNames, fieldConstructors };
}

/**
 * Append one query parameter, percent encoded.
 *
 * Both halves are encoded: a value carrying `&` or `=` would otherwise be read by the server as
 * additional parameters.
 */
export function pushParam(params: string[], name: string, value: unknown): void {
  params.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`);
}

/**
 * Flatten an already serialized message into dotted query parameters.
 *
 * `google/api/http.proto`: "In the case of a message type, each field of the message is mapped to
 * a separate parameter, such as `...?foo.a=A&foo.b=B&foo.c=C`".
 */
export function flattenParam(params: string[], prefix: string, value: unknown): void {
  if (value === null || value === undefined) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(entry => {
      flattenParam(params, prefix, entry);
    });
    return;
  }
  if (typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => {
      flattenParam(params, `${prefix}.${key}`, child);
    });
    return;
  }
  pushParam(params, prefix, value);
}

/**
 * One `{...}` variable of a `google.api.http` path template.
 *
 * `google/api/http.proto`: `Variable = "{" FieldPath [ "=" Segments ] "}"`, `FieldPath = IDENT { "." IDENT }`.
 * So `{name=clients/*}` binds the field `name` and constrains its value to `clients/*`, and
 * `{client.name=clients/*}` binds the nested field `name` of the message field `client`.
 */
export interface PathVariable {
  // proto names, outermost first
  fieldPath: string[];
  // the `Segments` after `=`, absent for a plain `{field}`
  template?: string;
}

export function parsePathVariable(capture: string): PathVariable {
  const eq = capture.indexOf("=");
  const fieldPart = (eq === -1 ? capture : capture.slice(0, eq)).trim();
  const template = eq === -1 ? undefined : capture.slice(eq + 1).trim();
  return { fieldPath: fieldPart.split("."), template };
}

/**
 * The anchored RegExp a value bound to a template variable has to match.
 *
 * `*` matches one segment, `**` one or more, a literal segment itself.
 */
export function templateToRegExp(template: string): RegExp {
  const parts = template.split("/").map(segment => {
    if (segment === "**") {
      return ".+";
    }
    if (segment === "*") {
      return "[^/]+";
    }
    return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  return new RegExp(`^${parts.join("/")}$`);
}

/**
 * Validate and encode the value of one path variable.
 *
 * A plain `{field}` is inserted as `String(value)`, as it always was. A template variable
 * (`{name=clients/*}`) must match its template; each segment is percent encoded, the `/` between
 * segments is kept, because the template is exactly what spans them.
 */
export function encodePathValue(variable: PathVariable, rawCapture: string, value: unknown): string {
  if (variable.template === undefined) {
    return String(value);
  }
  const str = typeof value === "string" || typeof value === "number" || typeof value === "bigint" ? String(value) : "";
  if (str === "" || !templateToRegExp(variable.template).test(str)) {
    throw new Error(`open-models: path variable {${rawCapture}} got '${str}', expected ${variable.template}`);
  }
  return str
    .split("/")
    .map(segment => encodeURIComponent(segment))
    .join("/");
}

/**
 * Look up the value a proto name field path points to.
 *
 * `protoToCamel` maps the proto name at one level of the path to the camelCase key of the literal.
 * It is called outermost first, once per level.
 */
export function resolvePathValue(
  rqo: unknown,
  fieldPath: string[],
  protoToCamel: (level: number, protoName: string) => string
): { topKey: string; value: unknown } {
  const keys: string[] = [];
  let current: unknown = rqo;
  fieldPath.forEach((protoName, level) => {
    const key = protoToCamel(level, protoName);
    keys.push(key);
    current = current !== null && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined;
  });
  return { topKey: keys[0], value: current };
}

/**
 * Resolve a field path through the request's field descriptors, level by level.
 *
 * Level 0 uses the request's protoName map, every deeper level the field descriptors of the message
 * type the previous level reached. Without a descriptor the generic conversion is used.
 */
function descriptorResolver(descriptors: RequestDescriptors): (level: number, protoName: string) => string {
  const topMap = new Map<string, string>();
  descriptors.protoNames.forEach((protoName, fieldName) => {
    topMap.set(protoName, fieldName);
  });
  // the message type reached by the previous level
  let currentCtor: FieldNodeConstructor | undefined;
  return (level, protoName) => {
    if (level === 0) {
      const key = topMap.get(protoName) ?? protoNameToJsonName(protoName);
      currentCtor = descriptors.fieldConstructors.get(key);
      return key;
    }
    const descriptor = currentCtor ? new currentCtor().__meta.nodeFields.find(f => f.protoName === protoName) : undefined;
    currentCtor = descriptor?.FieldConstructor as FieldNodeConstructor | undefined;
    return descriptor?.fieldName ?? protoNameToJsonName(protoName);
  };
}

/**
 * Replace every `{...}` variable of a path template.
 *
 * @return the path and the top level keys a single segment field path consumed. Those leave the
 * query params and a `*` body. A nested path (`{client.name=...}`) consumes nothing: its parent
 * message still goes to the body as a whole, which http.proto allows.
 */
export function evaluatePathTemplate(
  path: string,
  rqo: unknown,
  protoToCamel: (level: number, protoName: string) => string
): { evaluatedPath: string; consumedKeys: string[] } {
  let evaluatedPath = path;
  const consumedKeys: string[] = [];
  [...path.matchAll(/\{([^}]+)}/g)].forEach(match => {
    const variable = parsePathVariable(match[1]);
    const { topKey, value } = resolvePathValue(rqo, variable.fieldPath, protoToCamel);
    const encoded = encodePathValue(variable, match[1], value);
    // a function replacer, so a `$` in the value is not read as a replacement pattern
    evaluatedPath = evaluatedPath.replace(match[0], () => encoded);
    if (variable.fieldPath.length === 1) {
      consumedKeys.push(topKey);
    }
  });
  return { evaluatedPath, consumedKeys };
}

/**
 * Everything a caller has to hand over to resolve a path template and its query parameters.
 */
export interface UrlContext<REQ> {
  apiOptions: IUrlOptions;
  ReqType: FieldNodeConstructor;
  descriptors: RequestDescriptors;
  bodyField?: keyof REQ | "*";
}

export function buildPathAndBodyfield<REQ>(
  ctx: UrlContext<REQ>,
  path: string,
  bodyField: keyof REQ | "*" | undefined,
  rqo: REQ
): {
  evaluatedPath: string;
  evaluatedBody: string | undefined;
} {
  const { apiOptions, descriptors } = ctx;
  const reqProtoNameMap = descriptors.protoNames;
  const reqFieldConstructorMap = descriptors.fieldConstructors;

  let evaluatedBody;

  const keysForBodyOrQueryParams = new Map<string, keyof REQ>();
  Object.keys(rqo as object).forEach(key => {
    keysForBodyOrQueryParams.set(key, key as keyof REQ);
  });

  // Replace URL templates with values: /v1/cube/{cube_id} => /v1/cube/12, /v1/{name=cubes/*} => /v1/cubes/12
  // Path templates use proto names, but rqo uses camelCase keys
  const template = evaluatePathTemplate(path, rqo, descriptorResolver(descriptors));
  let { evaluatedPath } = template;
  template.consumedKeys.forEach(key => {
    keysForBodyOrQueryParams.delete(key);
  });

  if (bodyField === "*") {
    // Use FieldNode serialization for body when UseProtoNames is true
    if (apiOptions.UseProtoNames) {
      const reqNode = new ctx.ReqType();
      // Build a literal from remaining keys
      const literalBody: Record<string, unknown> = {};
      keysForBodyOrQueryParams.forEach(key => {
        literalBody[key as string] = rqo[key];
      });
      reqNode.__fromLiteral(literalBody);
      evaluatedBody = JSON.stringify(reqNode.__toJson());
    } else {
      const body: Record<string, unknown> = {};
      keysForBodyOrQueryParams.forEach(key => {
        body[key as string] = rqo[key];
      });
      evaluatedBody = JSON.stringify(body);
    }
  } else {
    // Build query params
    const params: string[] = [];
    if (bodyField !== undefined) {
      keysForBodyOrQueryParams.delete(bodyField as string);
    }
    keysForBodyOrQueryParams.forEach(key => {
      // Use the reqProtoNameMap for proto name lookup instead of generic conversion
      const paramName = apiOptions.UseProtoNamesForQueryParams ? (reqProtoNameMap.get(key as string) ?? (key as string)) : (key as string);
      const value = rqo[key];

      // A non repeated message becomes one parameter per leaf. Serializing it through its own
      // FieldNode first keeps enums, int64 and oneofs consistent with the body encoding, and lets
      // EmitDefaultValues / EmitUnpopulated decide whether an unset field contributes at all.
      // Primitives carry a FieldConstructor too, so the object check is what selects this branch.

      const FieldCtor = reqFieldConstructorMap.get(key as string);
      if (FieldCtor && value !== null && typeof value === "object" && !Array.isArray(value)) {
        const fieldNode = new FieldCtor(undefined);
        fieldNode.__fromLiteral(value);
        flattenParam(params, paramName, apiOptions.UseProtoNamesForQueryParams ? fieldNode.__toJson() : fieldNode.__toLiteral());
        return;
      }

      if (Array.isArray(value)) {
        (value as unknown[]).forEach(e => {
          pushParam(params, paramName, e);
        });
      } else {
        pushParam(params, paramName, value);
      }
    });
    if (params.length) {
      evaluatedPath = `${evaluatedPath}?${params.join("&")}`;
    }

    if (bodyField !== undefined) {
      // Use FieldNode serialization for the named body field when UseProtoNames is true
      if (apiOptions.UseProtoNames) {
        const FieldCtor = reqFieldConstructorMap.get(bodyField as string);
        if (FieldCtor) {
          const fieldNode = new FieldCtor(undefined);
          fieldNode.__fromLiteral(rqo[bodyField] || {});
          evaluatedBody = JSON.stringify(fieldNode.__toJson());
        } else {
          evaluatedBody = JSON.stringify(rqo[bodyField]);
        }
      } else {
        evaluatedBody = JSON.stringify(rqo[bodyField]);
      }
    }
  }

  evaluatedPath = `${apiOptions.serverAddr}${apiOptions.ApiBaseURL}${evaluatedPath}`;

  return {
    evaluatedPath,
    evaluatedBody,
  };
}
