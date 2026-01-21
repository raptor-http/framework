import type { IHttpError } from "../interfaces/http-error.ts";

/**
 * An error used primarily in 408 request timeout errors.
 */
export default class RequestTimeout extends Error implements IHttpError {
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
