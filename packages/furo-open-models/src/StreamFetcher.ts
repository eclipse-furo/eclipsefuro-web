import type { IApiOptions } from "./StrictFetcher";
import { buildPathAndBodyfield, describeRequest, type FieldNodeConstructor, type RequestDescriptors } from "./internal/HttpPath";
import { createStreamMapper, type StreamMapper } from "./internal/StreamMapping";
import { newSseState, parseSse, type SseState } from "./SseParser";
import { parseNdjson } from "./NdjsonParser";
import { StreamFramingError, StreamHttpError } from "./StreamErrors";

/** Reconnect delay used until the server states one with an SSE `retry:` field. */
const DEFAULT_RETRY_MS = 3000;
/** Nothing waits longer than this between attempts, however far the backoff has climbed. */
const MAX_RETRY_MS = 30000;

interface Handlers {
  /** Every time a stream is established, including after a reconnect. */
  onOpen?: (response: Response) => void;
  /** A stream was established again after it had dropped. Not fired for the first connect. */
  onReconnect?: (response: Response) => void;
  /** The stream ended with an error rather than simply dropping. */
  onStreamError?: (error: unknown, response: Response | undefined) => void;
  /** close() was called and the loop has stopped. */
  onClosed?: () => void;
}

/**
 * Consume a server streaming rpc.
 *
 * The generator emits `StreamFetcher` for a method declared `returns (stream X)`, where
 * StrictFetcher emits itself for a unary one. Two things differ from StrictFetcher and both are
 * deliberate:
 *
 * - **`invoke()` connects lazily.** It hands back an iterable straight away; the request goes out
 *   on the first `for await`. A refusal therefore surfaces from the loop, not from `invoke()`,
 *   which means the first connect and every reconnect fail the same way.
 * - **It reconnects.** A dropped body is retried on the server's `retry:` delay. A non-2xx is not:
 *   that is how a dead session surfaces, and retrying it would spin.
 *
 * The stream is **not resumed**. A reconnect starts a fresh stream and does not replay what was
 * missed, so a consumer whose events are cache invalidations should refetch on `onReconnect`.
 * SseParser does track `id:`, so adding resume later is a change here rather than a rewrite.
 *
 * Either framing works, chosen by the server through Content-Type, see {@link StreamMapper}.
 */
export class StreamFetcher<REQ, RES> {
  /** How long the *headers* may take. Once a stream is open it runs without a deadline. */
  public timeout: number;
  /** The last response, so a caller can read the status a refused stream came back with. */
  public lastResponse: Response | undefined;
  /** Whether a stream is currently open. */
  public isStreaming = false;

  private path: string;
  private method: string;
  private bodyField: keyof REQ | "*" | undefined;
  private API_OPTIONS: IApiOptions;
  private ReqType: FieldNodeConstructor;
  private descriptors: RequestDescriptors;
  private mapper: StreamMapper<RES>;

  private abortController: AbortController | undefined;
  private closed = false;
  /**
   * Read `closed` through a call, not the field.
   *
   * Every assignment to it happens in another method, so narrowing on the field - or on a getter,
   * which narrows the same way - would make the compiler treat a re-check after an await as dead
   * code.
   */
  private isClosed(): boolean {
    return this.closed;
  }

  /** Resolves the pending backoff, so close() is not stuck waiting one out. */
  private wake: (() => void) | undefined;

  constructor(options: IApiOptions, method: string, path: string, ReqType: FieldNodeConstructor, ResType: FieldNodeConstructor, bodyField?: keyof REQ | "*") {
    this.API_OPTIONS = options;
    this.method = method;
    this.path = path;
    this.bodyField = bodyField;
    this.ReqType = ReqType;
    this.descriptors = describeRequest(ReqType);
    this.mapper = createStreamMapper<RES>(ResType, options.UseProtoNames);
    this.timeout = options.timeout ?? 300000;
  }

  public setHandlers(handlers: Handlers): void {
    this.onOpen = handlers.onOpen;
    this.onReconnect = handlers.onReconnect;
    this.onStreamError = handlers.onStreamError;
    this.onClosed = handlers.onClosed;
  }

  /**
   * Stop the stream for good. A closed fetcher stays closed until the next `invoke()`.
   */
  public close(reason?: unknown): void {
    this.closed = true;
    this.abortController?.abort(reason ?? "stream closed");
    this.abortController = undefined;
    this.isStreaming = false;
    // A close during a backoff must not wait the backoff out - pagehide closes the stream and the
    // page is gone long before a 30s timer fires.
    this.wake?.();
  }

  /**
   * Open the stream.
   *
   * @return An iterable that connects on first use and reconnects until {@link close} is called.
   */
  public invoke(rqo: REQ, options?: RequestInit): Promise<AsyncIterable<RES>> {
    this.closed = false;
    return Promise.resolve({
      [Symbol.asyncIterator]: () => this.run(rqo, options),
    });
  }

  private async *run(rqo: REQ, options?: RequestInit): AsyncGenerator<RES> {
    const state = newSseState();
    let connectedBefore = false;
    let consecutiveFailures = 0;

    try {
      while (!this.isClosed()) {
        let response: Response;
        try {
          response = await this.connect(rqo, options);
        } catch (error) {
          if (this.isClosed()) {
            return;
          }
          // The server is unreachable. There is no status to act on, so this is a drop, not a
          // refusal: back off and try again.
          this.onStreamError?.(error, undefined);
          consecutiveFailures += 1;
          await this.pause(state, consecutiveFailures);
          continue;
        }

        this.lastResponse = response;

        if (!response.ok) {
          // A status instead of a stream. Never retried: a 401 would spin forever, and it is
          // exactly the signal a caller wants in order to start the auth flow.
          const error = new StreamHttpError(response);
          this.onStreamError?.(error, response);
          throw error;
        }

        consecutiveFailures = 0;
        this.isStreaming = true;
        this.onOpen?.(response);
        if (connectedBefore) {
          // Events pushed while the stream was down are gone, so this is the moment a consumer
          // refetches. See the class comment: there is no replay.
          this.onReconnect?.(response);
        }
        connectedBefore = true;

        try {
          yield* this.readBody(response, state);
        } catch (error) {
          if (this.isClosed()) {
            return;
          }
          this.onStreamError?.(error, response);
          if (error instanceof StreamFramingError) {
            // Nothing about this response will change on a retry.
            throw error;
          }
          // Anything else failed mid stream: treated as a drop, like a clean end, because the
          // reconnect gets fresh bytes.
        } finally {
          this.isStreaming = false;
        }

        if (this.isClosed()) {
          return;
        }

        // The body ended. A server streaming rpc is meant to stay open, so reconnect.
        consecutiveFailures += 1;
        await this.pause(state, consecutiveFailures);
      }
    } finally {
      this.isStreaming = false;
      this.abortController = undefined;
      if (this.isClosed()) {
        this.onClosed?.();
      }
    }
  }

  /**
   * One request. The timeout bounds time to headers only, the way StrictFetcher's does: it clears
   * the moment a response arrives, so an open stream is never cut short by it.
   */
  private async connect(rqo: REQ, options?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    this.abortController = controller;

    const { evaluatedPath, evaluatedBody } = buildPathAndBodyfield<REQ>(
      {
        apiOptions: this.API_OPTIONS,
        ReqType: this.ReqType,
        descriptors: this.descriptors,
      },
      this.path,
      this.bodyField,
      rqo
    );

    const requestInit: RequestInit = {
      method: this.method,
      headers: this.API_OPTIONS.headers,
      redirect: "follow",
      ...options,
      signal: controller.signal,
    };
    if (evaluatedBody) {
      requestInit.body = evaluatedBody;
    }

    const timeoutId = setTimeout(() => {
      controller.abort(`Timeout of ${String(this.timeout)}ms reached`);
    }, this.timeout);

    try {
      return await fetch(new Request(evaluatedPath, requestInit));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Read one open body to its end, mapping whichever framing the server chose.
   */
  private async *readBody(response: Response, state: SseState): AsyncGenerator<RES> {
    if (!response.body) {
      throw new StreamFramingError("Stream response has no readable body");
    }

    const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();

    if (contentType === "application/x-ndjson") {
      for await (const line of parseNdjson(response.body)) {
        yield this.mapper.fromNdjsonLine(line);
      }
      return;
    }

    // An absent Content-Type is read as SSE, which is what a server that forgot it almost always
    // meant. A type we do know we cannot stream is named rather than guessed at.
    if (contentType !== "" && contentType !== "text/event-stream") {
      throw new StreamFramingError(`Cannot stream Content-Type '${contentType}', expected text/event-stream or application/x-ndjson`);
    }

    for await (const frame of parseSse(response.body, state)) {
      const message = this.mapper.fromSseFrame(frame);
      if (message !== undefined) {
        yield message;
      }
    }
  }

  /**
   * Wait before the next attempt.
   *
   * The base is the server's `retry:` when it sent one, the browser's 3s default otherwise. It
   * doubles per consecutive failure so a server that is down is not hammered, and resets as soon
   * as a stream opens.
   */
  private async pause(state: SseState, consecutiveFailures: number): Promise<void> {
    const base = state.retry ?? DEFAULT_RETRY_MS;
    const backoff = base * 2 ** Math.max(0, consecutiveFailures - 1);
    const delay = Math.min(backoff, MAX_RETRY_MS);
    await new Promise<void>(resolve => {
      const timer = setTimeout(() => {
        this.wake = undefined;
        resolve();
      }, delay);
      this.wake = () => {
        clearTimeout(timer);
        this.wake = undefined;
        resolve();
      };
    });
  }

  onOpen?: (response: Response) => void;
  onReconnect?: (response: Response) => void;
  onStreamError?: (error: unknown, response: Response | undefined) => void;
  onClosed?: () => void;
}
