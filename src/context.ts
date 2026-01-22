import type { HttpError } from "./interfaces/http-error.ts";

/**
 * The context definition.
 */
export default class Context {
  /**
   * The current HTTP request.
   */
  public request: Request;

  /**
   * The current HTTP response.
   */
  public response: Response;

  /**
   * An error caught by the system.
   */
  public error?: HttpError | Error;

  /**
   * If the response has content type set.
   */
  private _hasContentType?: boolean;

  /**
   * Initialise an HTTP context.
   *
   * @constructor
   */
  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }

  /**
   * Check if the response has a content-type set.
   *
   * @returns A boolean indicating whether there's a response content-type set.
   */
  public hasContentType(): boolean {
    if (this._hasContentType === undefined) {
      this._hasContentType = this.response.headers.has("content-type");
    }

    return this._hasContentType;
  }
}
