/**
 * An error used primarily in 405 method not allowed request errors.
 */
export default class MethodNotAllowed extends Error implements Error {
  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 405;

  public errors: string[];

  constructor(errors: string[], message?: string) {
    super();

    this.name = "Method Not Allowed";
    this.message = message ?? "Request method not permitted";
    this.errors = errors;
  }
}
