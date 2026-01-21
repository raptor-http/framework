import type { IHttpError } from "../interfaces/http-error.ts";

/**
 * An error used primarily in 409 conflict request errors.
 */
export default class Conflict extends Error implements IHttpError {
  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 409;

  constructor(message?: string) {
    super();

    this.name = "Conflict";
    this.message = message ?? "Resource already exists";
  }
}
