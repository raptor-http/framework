import type { IHttpError } from "../interfaces/http-error.ts";

/**
 * An error used primarily in 418 gone request errors.
 */
export default class Teapot extends Error implements IHttpError {
  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 418;

  constructor(message?: string) {
    super();

    this.name = "I'm a Teapot";
    this.message = message ?? "Yes, you are.";
  }
}
