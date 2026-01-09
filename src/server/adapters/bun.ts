import console from "node:console";
import ServerError from "../../error/server-error.ts";

import type { ServerAdapter } from "../../interfaces/server-adapter.ts";

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
    console.log(`Serving on port ${options?.port}...`);
    Bun.serve({
      port: options?.port,
      hostname: options?.hostname ?? "localhost",
      fetch: handler,
    });
  }
}
