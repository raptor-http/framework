import type { HttpError } from "../interfaces/http-error.ts";

/**
 * An error used primarily in 429 gone request errors.
 */
export default class TooManyRequests extends Error implements HttpError {
  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 429;

  constructor(message?: string) {
    super();

    this.name = "Too Many Requests";
    this.message = message ??
      "You have exceeded the maximum number of requests";
  }
}
