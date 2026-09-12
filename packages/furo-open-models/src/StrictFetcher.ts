import type { JSONObject } from "@/well_known/Struct";
import { buildPathAndBodyfield, describeRequest, type FieldNodeConstructor, type RequestDescriptors } from "./internal/HttpPath";
import { createStreamMapper } from "./internal/StreamMapping";
import { newSseState, parseSse } from "./SseParser";
import { parseNdjson } from "./NdjsonParser";

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

  // The REQ type's field descriptors: camelCase fieldName → protoName and → FieldConstructor
  private descriptors: RequestDescriptors;

  constructor(options: IApiOptions, method: string, path: string, ReqType: FieldNodeConstructor, ResType: FieldNodeConstructor, bodyField?: keyof REQ | "*") {
    this.API_OPTIONS = options;
    this.path = path;
    this.bodyField = bodyField;
    this.method = method;
    this.ReqType = ReqType;
    this.ResType = ResType;

    this.descriptors = describeRequest(ReqType);

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

        // Both streaming framings resolve with an AsyncIterable rather than a value. The framing
        // and the mapping live in SseParser / NdjsonParser and StreamMapping, so StrictFetcher's
        // one pass over a stream and StreamFetcher's reconnecting loop cannot drift apart.
        const mapper = createStreamMapper<RES>(this.ResType, this.API_OPTIONS.UseProtoNames);

        this.responseHandler.set("application/x-ndjson", r => {
          const body = r.body;
          if (!body) {
            throw new Error("NDJSON response has no readable body");
          }

          resolve({
            async *[Symbol.asyncIterator](): AsyncGenerator<RES> {
              for await (const line of parseNdjson(body)) {
                yield mapper.fromNdjsonLine(line);
              }
            },
          });
        });

        // One pass, no reconnect: that is StreamFetcher's job. Registered so a StrictFetcher aimed
        // at an event stream parses it instead of falling through to the json handler.
        this.responseHandler.set("text/event-stream", r => {
          const body = r.body;
          if (!body) {
            throw new Error("SSE response has no readable body");
          }

          const state = newSseState();
          resolve({
            async *[Symbol.asyncIterator](): AsyncGenerator<RES> {
              for await (const frame of parseSse(body, state)) {
                const message = mapper.fromSseFrame(frame);
                if (message !== undefined) {
                  yield message;
                }
              }
            },
          });
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

  private buildPathAndBodyfield(
    path: string,
    bodyField: keyof REQ | "*" | undefined,
    rqo: REQ
  ): {
    evaluatedPath: string;
    evaluatedBody: string | undefined;
  } {
    return buildPathAndBodyfield<REQ>(
      {
        apiOptions: this.API_OPTIONS,
        ReqType: this.ReqType,
        descriptors: this.descriptors,
      },
      path,
      bodyField,
      rqo
    );
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
