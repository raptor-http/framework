import type { ServerAdapter } from "../../interfaces/server-adapter.ts";

export default class NodeServer implements ServerAdapter {
  /**
   * Start the server with the given request handler.
   *
   * @param handler The request handler function
   * @param options Server configuration options
   */
  public async serve(
    handler: (request: Request) => Promise<Response>,
    options?: { port?: number; hostname?: string },
  ): Promise<void> {
    const { createServer } = await import("node:http");

    const server = createServer(async (nodeRequest, nodeResponse) => {
      const request = this.toWebRequest(nodeRequest);

      const response = await handler(request);

      await this.fromWebResponse(response, nodeResponse);
    });

    server.listen(
      options?.port,
      options?.hostname ?? "localhost",
    );
  }

  // deno-lint-ignore no-explicit-any
  private toWebRequest(nodeRequest: any): Request {
    const protocol = (nodeRequest.socket.encrypted) ? "https:" : "http:";

    const url = `${protocol}//${nodeRequest.headers.host}${nodeRequest.url}`;

    return new Request(url, {
      method: nodeRequest.method,
      headers: nodeRequest.headers,
      body: nodeRequest.method !== "GET" && nodeRequest.method !== "HEAD"
        ? nodeRequest
        : undefined,
    });
  }

  private async fromWebResponse(
    response: Response,
    // deno-lint-ignore no-explicit-any
    nodeResponse: any,
  ): Promise<void> {
    nodeResponse.statusCode = response.status;

    response.headers.forEach((value, key) => {
      nodeResponse.setHeader(key, value);
    });

    if (response.body) {
      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        nodeResponse.write(value);
      }
    }

    nodeResponse.end();
  }
}
