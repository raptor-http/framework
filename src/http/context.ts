import type { HttpError } from "../interfaces/http-error.ts";

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
  public error?: HttpError;

  /**
   * Initialise an HTTP context.
   *
   * @constructor
   */
  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }
}
