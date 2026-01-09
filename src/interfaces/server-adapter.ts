export interface ServerAdapter {
  /**
   * Start the server with the given request handler.
   *
   * @param handler The request handler function
   * @param options Server configuration options
   */
  serve(
    handler: (request: Request) => Promise<Response>,
    options?: { port?: number; hostname?: string },
  ): void | Promise<void>;
}
