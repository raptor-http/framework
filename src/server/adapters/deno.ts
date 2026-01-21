import ServerError from "../../error/server-error.ts";

import type { IServerAdapter } from "../../interfaces/server-adapter.ts";

/**
 * The Deno server implementation for Raptor.
 */
export default class DenoServer implements IServerAdapter {
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
    const Deno = (globalThis as any).Deno;

    if (Deno === "undefined") {
      throw new ServerError();
    }

    if (!options?.port) {
      Deno.serve(handler);

      return;
    }

    Deno.serve({
      port: options.port,
      hostname: options.hostname,
    }, handler);
  }
}
