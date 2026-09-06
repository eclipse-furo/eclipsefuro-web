import { FieldNode } from "./FieldNode";
import type { JSONObject } from "@/well_known/Struct";

export interface IApiOptions {
  serverAddr: string;
  ApiBaseURL: string;
  headers?: Headers;
  timeout?: number;
  UseProtoNames: boolean;
  UseProtoNamesForQueryParams: boolean;
}

interface Handlers<REQ, RES> {
  onResponse?: (response: RES, serverResponse: Response) => void;
  onResponseError?: (parsedResponse: unknown, serverResponse: Response) => void;
  onRequestStarted?: (req: REQ) => void;
  onRequestFinished?: (req: REQ) => void;
  onRequestAborted?: (req: REQ) => void;
  onResponseRaw?: (serverResponse: Response) => void;
  onResponseErrorRaw?: (serverResponse: Response) => void;
  onResponseParseError?: (error: unknown, serverResponse: Response) => void;
  onResponseErrorParseError?: (error: unknown, serverResponse: Response) => void;
  onFatalError?: (error: unknown) => void;
  onRawJsonResponse?: (json: JSONObject) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldNodeConstructor = new (initData?: any, parent?: FieldNode, parentAttributeName?: string) => FieldNode;

export class StrictFetcher<REQ, RES> {
  public timeout: number;
  public lastResponse: Response | undefined;
  public isLoading = false;

  private path: string;
  private requestInit: RequestInit;
  private method: string;
  private responseHandler: Map<string, (r: Response) => void> = new Map<string, (r: Response) => void>();
  private abortController: AbortController;
  private timeoutId: ReturnType<typeof setTimeout> | number | undefined;
  private bodyField: keyof REQ | "*" | undefined;
  private API_OPTIONS: IApiOptions;

  private ReqType: FieldNodeConstructor;
  private ResType: FieldNodeConstructor;

  // Maps camelCase fieldName → protoName from the REQ type's field descriptors
  private reqProtoNameMap: Map<string, string>;
  // Maps camelCase fieldName → FieldConstructor from the REQ type's field descriptors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private reqFieldConstructorMap: Map<string, any>;

  constructor(options: IApiOptions, method: string, path: string, ReqType: FieldNodeConstructor, ResType: FieldNodeConstructor, bodyField?: keyof REQ | "*") {
    this.API_OPTIONS = options;
    this.path = path;
    this.bodyField = bodyField;
    this.method = method;
    this.ReqType = ReqType;
    this.ResType = ResType;

    // Build the proto name map from the REQ type's field descriptors
    this.reqProtoNameMap = new Map<string, string>();
    this.reqFieldConstructorMap = new Map<string, FieldNodeConstructor>();
    const tempReq = new ReqType();
    tempReq.__meta.nodeFields.forEach(field => {
      this.reqProtoNameMap.set(field.fieldName, field.protoName);
      this.reqFieldConstructorMap.set(field.fieldName, field.FieldConstructor as FieldNodeConstructor);
    });

    this.abortController = new AbortController();
    const { signal } = this.abortController;
    this.requestInit = {
      method: this.method,
      signal,
      headers: this.API_OPTIONS.headers,
      redirect: "follow",
    };

    this.timeout = this.API_OPTIONS.timeout ?? 300000;
  }

  public setRequestOptions(ri: RequestInit) {
    const { signal } = this.abortController;
    this.requestInit = {
      method: this.method,
      headers: this.API_OPTIONS.headers,
      signal,
      ...ri,
    };
  }

  public setHandlers(handlers: Handlers<REQ, RES>) {
    this.onResponse = handlers.onResponse;
    this.onResponseError = handlers.onResponseError;
    this.onRequestStarted = handlers.onRequestStarted;
    this.onRequestFinished = handlers.onRequestFinished;
    this.onRequestAborted = handlers.onRequestAborted;
    this.onResponseRaw = handlers.onResponseRaw;
    this.onResponseErrorRaw = handlers.onResponseErrorRaw;
    this.onResponseParseError = handlers.onResponseParseError;
    this.onResponseErrorParseError = handlers.onResponseErrorParseError;
    this.onFatalError = handlers.onFatalError;
    this.onRawJsonResponse = handlers.onRawJsonResponse;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abortPendingRequest(reason: any): void {
    if (!this.isLoading) {
      return;
    }
    clearTimeout(this.timeoutId);
    this.isLoading = false;
    this.abortController.abort(reason);

    if (this.onRequestAborted) {
      this.onRequestAborted(reason as REQ);
    }
  }

  public invoke(rqo: REQ, options?: RequestInit): Promise<RES> {
    return new Promise((resolve, reject) => {
      if (this.isLoading) {
        this.abortPendingRequest("invoke triggered before response");
      }

      this.abortController = new AbortController();
      const { signal } = this.abortController;

      this.requestInit = {
        method: this.method,
        signal,
        headers: this.API_OPTIONS.headers,
      };

      if (options) {
        this.setRequestOptions(options);
      }

      this.isLoading = true;

      const { evaluatedPath, evaluatedBody } = this.buildPathAndBodyfield(this.path, this.bodyField, rqo);
      if (evaluatedBody) {
        this.requestInit.body = evaluatedBody;
      }

      clearTimeout(this.timeoutId);
      const request = new Request(evaluatedPath, this.requestInit);
      this.timeoutId = setTimeout(() => {
        this.abortController.abort(`Timeout of ${String(this.timeout)}ms reached`);
        if (this.onRequestAborted) {
          this.onRequestAborted(rqo);
        }

        console.error(`RequestService fetch aborted: Timeout of ${String(this.timeout)}ms reached`);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
        reject(rqo);
      }, this.timeout);

      if (this.onRequestStarted) {
        this.onRequestStarted(rqo);
      }

      fetch(request)
        .then(response => {
          this._reworkRequest(response)
            .then(data => {
              resolve(data);
            })
            .catch(reject);
          if (this.onRequestFinished) {
            this.onRequestFinished(rqo);
          }
        })
        .catch((err: unknown) => {
          this.isLoading = false;

          if (err instanceof Error && err.name === "AbortError") {
            if (this.onRequestAborted) {
              this.onRequestAborted(rqo);
            }
            if (this.onRequestFinished) {
              this.onRequestFinished(rqo);
            }

            console.error("RequestService fetch aborted: ", err);
          } else {
            if (this.onRequestFinished) {
              this.onRequestFinished(rqo);
            }

            if (this.onFatalError) {
              this.onFatalError(err);
            }
          }
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
          reject(err);
        });
    });
  }

  _reworkRequest(response: Response): Promise<RES> {
    return new Promise((resolve, reject) => {
      this.isLoading = false;
      clearTimeout(this.timeoutId);
      const status = response.status;

      if (status === 0 || (status >= 200 && status < 300)) {
        this.lastResponse = response;

        if (this.onResponseRaw) {
          this.onResponseRaw(response);
        }

        this._parseResponse(response)
          .then(r => {
            resolve(r as RES);
            if (this.onResponse) {
              this.onResponse(r as RES, response);
            }
          })
          .catch((error: unknown) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
            reject(error);
            if (this.onResponseParseError) {
              this.onResponseParseError(error, response);
            }
          });
      } else {
        this.lastResponse = response;
        if (this.onResponseErrorRaw) {
          this.onResponseErrorRaw(response);
        }

        this._parseResponse(response)
          .then(r => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
            reject(r);
            if (this.onResponseError) {
              this.onResponseError(r, response);
            }
          })
          .catch((error: unknown) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
            reject(error);
            if (this.onResponseErrorParseError) {
              this.onResponseErrorParseError(error, response);
            }
          });
      }
    });
  }

  _parseResponse(response: Response) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
      if (response) {
        // No Content / Reset Content carry no body by definition; resolve as an empty
        // message ({}) without touching the body to avoid parse errors.
        if (response.status === 204 || response.status === 205) {
          resolve({});
          return;
        }

        this.responseHandler.set("text/plain", r => {
          r.text()
            .then(text => {
              resolve(text);
            })
            .catch((err: unknown) => {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
              reject(err);
            });
        });

        this.responseHandler.set("text/html", r => {
          r.text()
            .then(text => {
              resolve(text);
            })
            .catch((err: unknown) => {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
              reject(err);
            });
        });

        this.responseHandler.set("application/json", r => {
          r.text()
            .then(text => {
              // An empty body is the proto3 JSON representation of google.protobuf.Empty ({}).
              // r.json() would reject on an empty body, so read text and only parse when non-empty.
              const trimmed = text.trim();
              const json = trimmed === "" ? {} : (JSON.parse(trimmed) as JSONObject);

              if (this.onRawJsonResponse) {
                this.onRawJsonResponse(json);
              }

              if (this.API_OPTIONS.UseProtoNames) {
                // Use FieldNode-based conversion instead of generic Mapper
                const resNode = new this.ResType();
                resNode.__fromProtoNameJson(json);
                resolve(resNode.__toLiteral());
              } else {
                resolve(json);
              }
            })
            .catch((err: unknown) => {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
              reject(err);
            });
        });

        this.responseHandler.set("application/x-ndjson", r => {
          const preserveProtoNames = this.API_OPTIONS.UseProtoNames;
          const ResTypeCtor = this.ResType;

          const reader = r.body?.getReader();
          if (!reader) {
            throw new Error("NDJSON response has no readable body");
          }

          const decoder = new TextDecoder();
          let buffer = "";

          const iterator = {
            async *[Symbol.asyncIterator](): AsyncGenerator<RES> {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- loop exits via break on done
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";

                for (const line of lines) {
                  const trimmed = line.trim();
                  if (trimmed === "") {
                    continue;
                  }

                  let parsed: RES;
                  try {
                    parsed = JSON.parse(trimmed) as RES;
                  } catch {
                    throw new Error(`Failed to parse NDJSON line: ${trimmed}`);
                  }

                  if (preserveProtoNames) {
                    const resNode = new ResTypeCtor();
                    resNode.__fromProtoNameJson(parsed);
                    yield resNode.__toLiteral() as RES;
                  } else {
                    yield parsed;
                  }
                }
              }

              if (buffer.trim() !== "") {
                try {
                  const parsed = JSON.parse(buffer.trim()) as RES;
                  if (preserveProtoNames) {
                    const resNode = new ResTypeCtor();
                    resNode.__fromProtoNameJson(parsed);
                    yield resNode.__toLiteral() as RES;
                  } else {
                    yield parsed;
                  }
                } catch {
                  throw new Error(`Failed to parse final NDJSON line: ${buffer.trim()}`);
                }
              }
            },
          };

          resolve(iterator);
        });

        this.responseHandler.set("application/octet-stream", r => {
          r.arrayBuffer()
            .then(buffer => {
              resolve(buffer);
            })
            .catch((err: unknown) => {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
              reject(err);
            });
        });
        this.responseHandler.set("application/pdf", r => {
          r.blob()
            .then(blob => {
              resolve(blob);
            })
            .catch((err: unknown) => {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
              reject(err);
            });
        });
        this.responseHandler.set("image/jpeg", r => {
          r.blob()
            .then(blob => {
              resolve(blob);
            })
            .catch((err: unknown) => {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- changing rejection types would break downstream error handlers
              reject(err);
            });
        });

        const contentType = response.headers.get("content-type");
        let handler = contentType?.split(";")[0].trim();
        handler ??= "application/json";
        let typeHandler = this.responseHandler.get(handler);

        if (typeHandler === undefined) {
          console.error("No parser for", handler);
          typeHandler = this.responseHandler.get("application/json");
        }

        if (typeHandler) {
          typeHandler(response);
        }
      } else {
        reject(new Error("no response"));
      }
    });
  }

  /**
   * Append one query parameter, percent encoded.
   *
   * Both halves are encoded: a value carrying `&` or `=` would otherwise be read by the server as
   * additional parameters.
   */
  private static pushParam(params: string[], name: string, value: unknown): void {
    params.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`);
  }

  /**
   * Flatten an already serialized message into dotted query parameters.
   *
   * `google/api/http.proto`: "In the case of a message type, each field of the message is mapped to
   * a separate parameter, such as `...?foo.a=A&foo.b=B&foo.c=C`".
   */
  private static flattenParam(params: string[], prefix: string, value: unknown): void {
    if (value === null || value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(entry => {
        StrictFetcher.flattenParam(params, prefix, entry);
      });
      return;
    }
    if (typeof value === "object") {
      Object.entries(value).forEach(([key, child]) => {
        StrictFetcher.flattenParam(params, `${prefix}.${key}`, child);
      });
      return;
    }
    StrictFetcher.pushParam(params, prefix, value);
  }

  private buildPathAndBodyfield(
    path: string,
    bodyField: keyof REQ | "*" | undefined,
    rqo: REQ
  ): {
    evaluatedPath: string;
    evaluatedBody: string | undefined;
  } {
    let evaluatedPath = path;
    let evaluatedBody;

    const keysForBodyOrQueryParams = new Map<string, keyof REQ>();
    Object.keys(rqo as object).forEach(key => {
      keysForBodyOrQueryParams.set(key, key as keyof REQ);
    });

    // Build a reverse map: protoName → camelCase fieldName for path template resolution
    const protoToFieldMap = new Map<string, string>();
    this.reqProtoNameMap.forEach((protoName, fieldName) => {
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
      if (this.API_OPTIONS.UseProtoNames) {
        const reqNode = new this.ReqType();
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
        const paramName = this.API_OPTIONS.UseProtoNamesForQueryParams ? (this.reqProtoNameMap.get(key as string) ?? (key as string)) : (key as string);
        const value = rqo[key];

        // A non repeated message becomes one parameter per leaf. Serializing it through its own
        // FieldNode first keeps enums, int64 and oneofs consistent with the body encoding, and lets
        // EmitDefaultValues / EmitUnpopulated decide whether an unset field contributes at all.
        // Primitives carry a FieldConstructor too, so the object check is what selects this branch.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- FieldConstructor stored from meta is untyped
        const FieldCtor = this.reqFieldConstructorMap.get(key as string);
        if (FieldCtor && value !== null && typeof value === "object" && !Array.isArray(value)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- FieldConstructor is dynamically resolved from meta
          const fieldNode = new FieldCtor(undefined) as FieldNode;
          fieldNode.__fromLiteral(value);
          StrictFetcher.flattenParam(params, paramName, this.API_OPTIONS.UseProtoNamesForQueryParams ? fieldNode.__toJson() : fieldNode.__toLiteral());
          return;
        }

        if (Array.isArray(value)) {
          (value as unknown[]).forEach(e => {
            StrictFetcher.pushParam(params, paramName, e);
          });
        } else {
          StrictFetcher.pushParam(params, paramName, value);
        }
      });
      if (params.length) {
        evaluatedPath = `${evaluatedPath}?${params.join("&")}`;
      }

      if (bodyField !== undefined) {
        // Use FieldNode serialization for the named body field when UseProtoNames is true
        if (this.API_OPTIONS.UseProtoNames) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- FieldConstructor stored from meta is untyped
          const FieldCtor = this.reqFieldConstructorMap.get(bodyField as string);
          if (FieldCtor) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- FieldConstructor is dynamically resolved from meta
            const fieldNode = new FieldCtor(undefined) as FieldNode;
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

    evaluatedPath = `${this.API_OPTIONS.serverAddr}${this.API_OPTIONS.ApiBaseURL}${evaluatedPath}`;

    return {
      evaluatedPath,
      evaluatedBody,
    };
  }

  onResponse?: (response: RES, serverResponse: Response) => void;
  onResponseError?: (parsedResponse: unknown, serverResponse: Response) => void;
  onRequestStarted?: (req: REQ) => void;
  onRequestFinished?: (req: REQ) => void;
  onRequestAborted?: (req: REQ) => void;
  onResponseRaw?: (serverResponse: Response) => void;
  onResponseErrorRaw?: (serverResponse: Response) => void;
  onResponseParseError?: (error: unknown, serverResponse: Response) => void;
  onResponseErrorParseError?: (error: unknown, serverResponse: Response) => void;
  onFatalError?: (error: unknown) => void;
  onRawJsonResponse?: (json: JSONObject) => void;
}
