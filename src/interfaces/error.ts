/**
 * The base error definition.
 */
export interface Error {
  /**
   * The name of the error.
   */
  name: string;

  /**
   * The HTTP status code associated with the error.
   */
  status: number;

  /**
   * The end-user message attached to the error.
   */
  message: string;

  /**
   * Any optional error messages associated with the error.
   */
  errors?: string[];

  /**
   * The stack string associated with the error.
   */
  stack?: string;
}
