/**
 * An error used primarily in 403 forbidden request errors.
 */
export default class Forbidden extends Error implements Error {
  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 403;

  public errors: string[];

  constructor(errors: string[], message?: string) {
    super();

    this.name = "Forbidden";
    this.message = message ?? "Server refused request";
    this.errors = errors;
  }
}
