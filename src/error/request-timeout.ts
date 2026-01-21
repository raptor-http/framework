import type { HttpError } from "../interfaces/http-error.ts";

/**
 * An error used primarily in 408 request timeout errors.
 */
export default class RequestTimeout extends Error implements HttpError {
  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 408;

  constructor(message?: string) {
    super();

    this.name = "Request Timeout";
    this.message = message ?? "Server timed out waiting for request";
  }
}
