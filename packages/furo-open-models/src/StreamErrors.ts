/**
 * The two ways a stream fails for good.
 *
 * Both are permanent: the loop in StreamFetcher reconnects a stream that merely dropped, and
 * rethrows these instead, because the same request would come back the same way and retrying it
 * would spin.
 */

/**
 * The server answered a stream with a status instead of a stream.
 *
 * Carries the Response, which is the whole reason a fetch based stream beats an EventSource: a
 * caller can tell a 401 from a 503 and act on it.
 */
export class StreamHttpError extends Error {
  public readonly status: number;
  public readonly response: Response;

  constructor(response: Response) {
    super(`Stream refused with ${String(response.status)} ${response.statusText}`);
    this.name = "StreamHttpError";
    this.status = response.status;
    this.response = response;
  }
}

/**
 * The response cannot be streamed at all, i.e. it came back under a Content-Type neither framing
 * understands, or with no body.
 */
export class StreamFramingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StreamFramingError";
  }
}
