import { FieldNode } from "../FieldNode";

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

  let evaluatedPath = path;
  let evaluatedBody;

  const keysForBodyOrQueryParams = new Map<string, keyof REQ>();
  Object.keys(rqo as object).forEach(key => {
    keysForBodyOrQueryParams.set(key, key as keyof REQ);
  });

  // Build a reverse map: protoName → camelCase fieldName for path template resolution
  const protoToFieldMap = new Map<string, string>();
  reqProtoNameMap.forEach((protoName, fieldName) => {
    protoToFieldMap.set(protoName, fieldName);
  });

  const fields = [...path.matchAll(/\{([^}]+)}/g)];
  // Replace URL templates with values: /v1/cube/{cube_id} => /v1/cube/12
  // Path templates use proto names, but rqo uses camelCase keys
  fields.forEach(field => {
    const protoName = field[1];
    const camelKey = (protoToFieldMap.get(protoName) ?? protoName) as keyof REQ;
    const rqoValue = rqo[camelKey];
    evaluatedPath = evaluatedPath.replace(field[0], String(rqoValue));
    keysForBodyOrQueryParams.delete(camelKey as string);
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
