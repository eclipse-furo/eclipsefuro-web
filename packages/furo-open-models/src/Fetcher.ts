import {
  deepJsonNameToProtoName,
  deepProtoNameToJsonName,
  protoNameToJsonName,
} from './Mapper';

export interface IApiOptions {
  // leave empty to connect to the same host which delivers your files, otherwise set something like http://localhost:3000
  serverAddr: string;
  ApiBaseURL: string;
  headers?: Headers;
  timeout?: number;
  PreserveProtoNames: boolean;
}

interface Handlers<REQ, RES> {
  /**
   * The `onResponse` handler is triggered, when we have a successful response.
   * @param response
   * @param serverResponse
   */
  onResponse?: (response: RES, serverResponse: Response) => void;

  /**
   * The `onResponseError` handler is triggered on any received status >=400.
   * @param parsedResponse - The parsed response body from the server.
   * @param serverResponse
   */
  onResponseError?: (parsedResponse: unknown, serverResponse: Response) => void;

  /**
   * The `onRequestStarted` handler is triggered, whenever a request is started.
   * @param req - The request object
   */
  onRequestStarted?: (req: REQ) => void;

  /**
   * The `onRequestFinished` handler is triggered, whenever a request is finished or aborted.
   * @param req - The request object
   */
  onRequestFinished?: (req: REQ) => void;

  /**
   * The `onRequestAborted` handler is triggered, whenever a request is aborted.
   * An abort can be triggered by
   *  - calling `abortPendingRequest`.
   *  - triggering the request again, while you have a pending request.
   *  - by reaching the request timeout.
   *
   *  The timeout can be set in the OPEN_MODELS_OPTIONS, the default is 600s aka 5min.
   *
   * @param req
   */
  onRequestAborted?: (req: REQ) => void;

  /**
   * The `onResponseRaw` handler is triggered, when we have a successful response.
   *
   * @param serverResponse
   */
  onResponseRaw?: (serverResponse: Response) => void;

  /**
   * The `onResponseErrorRaw` handler is triggered on any 400
   * @param serverResponse
   */
  onResponseErrorRaw?: (serverResponse: Response) => void;

  /**
   * The `onParseError` handler is triggered, when the content could not be parsed, according to the `content-type` header of the response.
   *
   * @param error
   * @param serverResponse
   */
  onResponseParseError?: (error: unknown, serverResponse: Response) => void;
  /**
   * The `onParseError` handler is triggered, when the content of the error could not be parsed, according to the `content-type` header of the response.
   *
   * @param error
   * @param serverResponse
   */
  onResponseErrorParseError?: (
    error: unknown,
    serverResponse: Response,
  ) => void;

  /**
   * The `onFatalError` handler is triggered when nothing could be caught with the cather.
   * This should not happen.
   * @param error
   */
  onFatalError?: (error: unknown) => void;
}

export class Fetcher<REQ, RES> {
  public timeout: number;

  /**
   * Contains the response from the last request. Also on errors.
   */
  public lastResponse: Response | undefined;

  /**
   * Indicator for a pending request. Maybe you are also interested on the `onRequestStarted` and `onRequestFinished` callback methods.
   */
  public isLoading: boolean = false;

  private path: string;

  private requestInit: RequestInit;

  private method: string;

  private responseHandler: Map<string, (r: Response) => void> = new Map<
    string,
    (r: Response) => void
  >();

  private abortController: AbortController;

  private timeoutId: ReturnType<typeof setTimeout> | number | undefined;

  private bodyField: keyof REQ | '*' | undefined;

  private API_OPTIONS: IApiOptions;

  /**
   *
   * @param options
   * @param method
   * @param path
   * @param bodyField
   */
  constructor(
    options: IApiOptions,
    // method
    method: string,
    // options path
    path: string,
    bodyField?: keyof REQ | '*',
  ) {
    this.API_OPTIONS = options;
    this.path = path;
    this.bodyField = bodyField;
    this.method = method;

    this.abortController = new AbortController();
    const { signal } = this.abortController;
    this.requestInit = {
      method: this.method,
      signal,
      headers: this.API_OPTIONS.headers,
      redirect:'follow'
    };

    this.timeout = this.API_OPTIONS.timeout || 300000; // chrome default timeout
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

  /**
   * setHandlers let you bind all handlers at once.
   * @param handlers
   */
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
      this.onRequestAborted(reason);
    }
  }

  public invoke(rqo: REQ, options?: RequestInit) {
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

    if (this.isLoading) {
      this.isLoading = false;
      this.abortPendingRequest('invoke triggered before response');
    }

    this.isLoading = true;

    const { evaluatedPath, evaluatedBody } = this.buildPathAndBodyfield(
      this.path,
      this.bodyField,
      rqo,
    );
    if (evaluatedBody) {
      this.requestInit.body = evaluatedBody;
    }

    clearTimeout(this.timeoutId);
    const request = new Request(evaluatedPath, this.requestInit);
    this.timeoutId = setTimeout(() => {
      this.abortController.abort(`Timeout of ${this.timeout}ms reached`);
      if (this.onRequestAborted) {
        this.onRequestAborted(rqo);
      }
      // eslint-disable-next-line no-console
      console.error(
        `RequestService fetch aborted: Timeout of ${this.timeout}ms reached`,
      );
    }, this.timeout);

    if (this.onRequestStarted) {
      this.onRequestStarted(rqo);
    }

    fetch(request)
      .then(response => {
        this._reworkRequest(response);
        if (this.onRequestFinished) {
          this.onRequestFinished(rqo);
        }
      })
      .catch(err => {
        this.isLoading = false;

        if (err.name === 'AbortError') {
          if (this.onRequestAborted) {
            this.onRequestAborted(rqo);
          }
          if (this.onRequestFinished) {
            this.onRequestFinished(rqo);
          }
          // eslint-disable-next-line no-console
          console.error('RequestService fetch aborted: ', err);
        } else {
          if (this.onRequestFinished) {
            this.onRequestFinished(rqo);
          }

          if (this.onFatalError) {
            this.onFatalError(err);
          }
        }
      });
  }

  /**
   * Succeeded is true if the request succeeded. The request succeeded if it
   * loaded without error, wasn't aborted, and the status code is ≥ 200, and
   * < 300, or if the status code is 0.
   */

  /**
   * Errorhandling according to Google rest-api-v3 Status Codes
   * (https://developers.google.com/maps-booking/reference/rest-api-v3/status_codes)
   *
   * Dispatches event `response-error` and a specific error event with status code
   * @private
   */
  _reworkRequest(response: Response) {
    /**
     * The status code 0 is accepted as a success because some schemes - e.g.
     * file:// - don't provide status codes.
     */
    this.isLoading = false;
    clearTimeout(this.timeoutId);
    const status = response.status || 0;

    if (status === 0 || (status >= 200 && status < 300)) {
      /**
       * Loaded without error, fires event `response` with full response object
       */
      this.lastResponse = response;

      if (this.onResponseRaw) {
        this.onResponseRaw(response);
      }

      /**
       * parses response object according to response heaader informationen `content-type`
       * you will find the supported content-types in the declaration area
       */

      this._parseResponse(response)
        .then(r => {
          if (this.onResponse) {
            this.onResponse(r as RES, response);
          }
        })
        .catch(error => {
          if (this.onResponseParseError) {
            this.onResponseParseError(error, response);
          }
        });
    } else {
      /**
       * Error detected
       */
      this.lastResponse = response;
      if (this.onResponseErrorRaw) {
        this.onResponseErrorRaw(response);
      }

      /**
       * parses response object according to response heaader `content-type`
       */
      this._parseResponse(response)
        .then(r => {
          if (this.onResponseError) {
            this.onResponseError(r, response);
          }
        })
        /**
         * error parsing is not possible, empty response
         * the dispatched event will have the raw error object in the event detail
         */
        .catch(error => {
          if (this.onResponseErrorParseError) {
            this.onResponseErrorParseError(error, response);
          }
        });
    }
  }

  /**
   * parses response object according to lastRequest heaader informationen `content-type`
   * you will find the supported content-types in the declaration area
   * response Fetch API response object [https://developer.mozilla.org/en-US/docs/Web/API/Response]
   * Default response handler is json!
   * @param response
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  _parseResponse(response: Response) {
    return new Promise((resolve, reject) => {
      if (response) {
        this.responseHandler.set('text/plain', r => {
          r.text()
            .then(text => {
              resolve(text);
            })
            .catch(err => {
              reject(err);
            });
        });

        this.responseHandler.set('text/html', r => {
          r.text()
            .then(text => {
              resolve(text);
            })
            .catch(err => {
              reject(err);
            });
        });
        this.responseHandler.set('application/json', r => {
          r.json()
            .then(json => {
              // convert to literal type when needed
              resolve(
                this.API_OPTIONS.PreserveProtoNames
                  ? deepProtoNameToJsonName(json)
                  : json,
              );
            })
            .catch(err => {
              reject(err);
            });
        });
        this.responseHandler.set('application/octet-stream', r => {
          r.arrayBuffer()
            .then(buffer => {
              resolve(buffer);
            })
            .catch(err => {
              reject(err);
            });
        });
        this.responseHandler.set('application/pdf', r => {
          r.blob()
            .then(blob => {
              resolve(blob);
            })
            .catch(err => {
              reject(err);
            });
        });
        this.responseHandler.set('image/jpeg', r => {
          r.blob()
            .then(blob => {
              resolve(blob);
            })
            .catch(err => {
              reject(err);
            });
        });

        const contentType = response.headers.get('content-type');
        let handler = contentType?.split(';')[0].trim();
        if (handler === undefined) {
          handler = 'application/json';
        }
        let typeHandler = this.responseHandler.get(handler);

        if (typeHandler === undefined) {
          // eslint-disable-next-line no-console
          console.error('No parser for', handler);
          typeHandler = this.responseHandler.get('application/json');
        }

        if (typeHandler) {
          typeHandler(response);
        }
      } else {
        reject(new Error('no response'));
      }
    });
  }

  private buildPathAndBodyfield(
    path: string,
    bodyField: keyof REQ | '*' | undefined,
    rqo: REQ,
  ): {
    evaluatedPath: string;
    evaluatedBody: string | undefined;
  } {
    // use the rules specified here  https://docs.solo.io/gloo-edge/latest/reference/api/github.com/solo-io/solo-kit/api/external/google/api/http.proto.sk/
    // find all fields in path
    let evaluatedPath = path;
    let evaluatedBody;

    const keysForBodyOrQueryParams: Map<string, keyof REQ> = new Map();
    Object.keys(rqo as object).forEach(key => {
      keysForBodyOrQueryParams.set(key, key as keyof REQ);
    });

    const fields = [...path.matchAll(/\{([^}]+)}/g)];
    // replace url templates with values
    // /v1/cube/{id} => /v1/cube/12
    fields.forEach(field => {
      // TODO: check if qp is always set as proto name
      const rqoKey = protoNameToJsonName(field[1]) as keyof REQ;
      const rqoValue = rqo[rqoKey];
      evaluatedPath = evaluatedPath.replace(field[0], `${rqoValue}`);
      keysForBodyOrQueryParams.delete(rqoKey as string);
    });

    if (bodyField === '*') {
      // build body object
      const body: { [key: string]: unknown } = {};
      keysForBodyOrQueryParams.forEach(key => {
        body[key as string] = rqo[key];
      });
      evaluatedBody = JSON.stringify(body);
    } else {
      // build query params
      const params: string[] = [];
      if (bodyField !== undefined) {
        keysForBodyOrQueryParams.delete(bodyField as string);
      }
      keysForBodyOrQueryParams.forEach(key => {
        if (Array.isArray(rqo[key])) {
          (rqo[key] as unknown[]).forEach(e => {
            params.push(`${key as string}=${e}`);
          });
        } else {
          params.push(`${key as string}=${rqo[key]}`);
        }
      });
      if (params.length) {
        evaluatedPath = `${evaluatedPath}?${params.join('&')}`;
      }

      if (bodyField !== undefined) {
        evaluatedBody = JSON.stringify(
          this.API_OPTIONS.PreserveProtoNames
            ? deepJsonNameToProtoName(rqo[bodyField])
            : rqo[bodyField],
        );
      }
    }

    evaluatedPath = `${this.API_OPTIONS.serverAddr}${this.API_OPTIONS.ApiBaseURL}${evaluatedPath}`;

    return {
      evaluatedPath,
      evaluatedBody,
    };
  }

  /**
   * The `onResponse` handler is triggered, when we have a successful response.
   * @param response
   * @param serverResponse
   */
  onResponse?: (response: RES, serverResponse: Response) => void;

  /**
   * The `onResponseError` handler is triggered on any received status >=400.
   * @param parsedResponse - The parsed response body from the server.
   * @param serverResponse
   */
  onResponseError?: (parsedResponse: unknown, serverResponse: Response) => void;

  /**
   * The `onRequestStarted` handler is triggered, whenever a request is started.
   * @param req - The request object
   */
  onRequestStarted?: (req: REQ) => void;

  /**
   * The `onRequestFinished` handler is triggered, whenever a request is finished or aborted.
   * @param req - The request object
   */
  onRequestFinished?: (req: REQ) => void;

  /**
   * The `onRequestAborted` handler is triggered, whenever a request is aborted.
   * An abort can be triggered by
   *  - calling `abortPendingRequest`.
   *  - triggering the request again, while you have a pending request.
   *  - by reaching the request timeout.
   *
   *  The timeout can be set in the OPEN_MODELS_OPTIONS, the default is 600s aka 5min.
   *
   * @param req
   */
  onRequestAborted?: (req: REQ) => void;

  /**
   * The `onResponseRaw` handler is triggered, when we have a successful response.
   *
   * @param serverResponse
   */
  onResponseRaw?: (serverResponse: Response) => void;

  /**
   * The `onResponseErrorRaw` handler is triggered on any 400
   * @param serverResponse
   */
  onResponseErrorRaw?: (serverResponse: Response) => void;

  /**
   * The `onParseError` handler is triggered, when the content could not be parsed, according to the `content-type` header of the response.
   *
   * @param error
   * @param serverResponse
   */
  onResponseParseError?: (error: unknown, serverResponse: Response) => void;

  /**
   * The `onParseError` handler is triggered, when the content of the error could not be parsed, according to the `content-type` header of the response.
   *
   * @param error
   * @param serverResponse
   */
  onResponseErrorParseError?: (
    error: unknown,
    serverResponse: Response,
  ) => void;

  /**
   * The `onFatalError` handler is triggered when nothing could be caught with the cather.
   * This should not happen.
   * @param error
   */
  onFatalError?: (error: unknown) => void;
}
