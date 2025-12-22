import type { HttpError } from "../interfaces/http-error.ts";

/**
 * An error used primarily for application code errors.
 */
export default class TypeError extends Error implements HttpError {
  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 500;

  constructor(message?: string) {
    super();

    this.name = "Type Error";
    this.message = message ??
      "There was a problem running the application code";
  }
}
