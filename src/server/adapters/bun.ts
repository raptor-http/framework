import ServerError from "../../error/server-error.ts";

import type { ServerAdapter } from "../../interfaces/server-adapter.ts";

/**
 * The Bun server implementation for Raptor.
 */
export default class BunServer implements ServerAdapter {
  /**
   * Start the server with the given request handler.
   *
   * @param handler The request handler function
   * @param options Server configuration options
   */
  public serve(
    handler: (request: Request) => Promise<Response>,
    options?: { port?: number; hostname?: string },
  ): void {
    // deno-lint-ignore no-explicit-any
    const Bun = (globalThis as any).Bun;

    if (Bun === "undefined") {
      throw new ServerError();
    }

    Bun.serve({
      port: options?.port,
      hostname: options?.hostname ?? "localhost",
      fetch: handler,
    });
  }
}
