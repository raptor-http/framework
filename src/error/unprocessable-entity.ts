/**
 * An error used primarily in 422 unprocessable entity request errors.
 */
export default class UnprocessableEntity extends Error implements Error {
  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 422;

  constructor(message?: string) {
    super();

    this.name = "Unprocessable Entity";
    this.message = message ?? "Semantic errors in request";
  }
}
