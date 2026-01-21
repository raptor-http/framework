import Context from "./context.ts";
import BunServer from "./server/adapters/bun.ts";
import NodeServer from "./server/adapters/node.ts";
import DenoServer from "./server/adapters/deno.ts";
import InternalResponseManager from "./response/manager.ts";
import type { HttpError } from "./interfaces/http-error.ts";
import type { Middleware } from "./interfaces/middleware.ts";
import type { ErrorHandler } from "./interfaces/error-handler.ts";
import type { ServerAdapter } from "./interfaces/server-adapter.ts";
import type { ResponseManager } from "./interfaces/response-manager.ts";

/**
 * The root initialiser for the framework.
 */
export default class Kernel {
  /**
   * The response manager for the kernel.
   */
  private responseManager: ResponseManager;

  /**
   * The available middleware.
   */
  private middleware: Middleware[] = [];

  /**
   * An optional custom error handler function.
   */
  private customErrorHandler?: ErrorHandler;

  /**
   * Initialise the kernel.
   *
   * @constructor
   */
  constructor() {
    this.responseManager = new InternalResponseManager();
  }

  /**
   * Add a new module to the container.
   *
   * @param middleware An HTTP middleware instance.
   */
  public add(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Alias method for "add".
   *
   * @param middleware An HTTP middleware instance.
   */
  public use(middleware: Middleware) {
    this.add(middleware);
  }

  /**
   * Serve the application.
   *
   * @param options Server options.
   */
  public serve(options?: { port?: number }) {
    const port = options?.port ?? 80;

    const server = this.getServerAdapter();

    const handler = (request: Request) => this.respond(request);

    if (!options?.port) {
      server.serve(handler);

      return;
    }

    server.serve(handler, { port });

    console.log(
      `🦖 Raptor started on port ${port}...`,
    );
  }

  /**
   * Alias method for "serve".
   *
   * @param options Server options.
   */
  public listen(options?: { port?: number }) {
    this.serve(options);
  }

  /**
   * Handle an HTTP request and respond.
   *
   * @param request The request object.
   *
   * @returns A promise resolving the HTTP response.
   */
  public async respond(request: Request): Promise<Response> {
    const context = new Context(request, new Response());

    await this.next(context);

    return context.response;
  }

  /**
   * Set or override the response manager for the kernel.
   *
   * @param manager A valid response manager object.
   *
   * @returns void
   */
  public setResponseManager(manager: ResponseManager): void {
    this.responseManager = manager;
  }

  /**
   * Add custom error handling middleware.
   *
   * @param handler An error handler function to handle errors.
   *
   * @returns void
   */
  public catch(handler: ErrorHandler): void {
    this.customErrorHandler = handler;
  }

  /**
   * Handle the processing of middleware.
   *
   * @param context The current HTTP context.
   *
   * @returns void
   */
  private async next(context: Context): Promise<void> {
    await this.executeMiddleware(context, 0);
  }

  /**
   * Execute a chosen middleware by index.
   *
   * @param context The current HTTP context.
   * @param index The current middleware index.
   *
   * @returns Promise<void>
   */
  private async executeMiddleware(
    context: Context,
    index: number,
  ): Promise<Response | void> {
    if (index >= this.middleware.length) return;

    const middleware = this.middleware[index];

    if (!middleware) return;

    let called = false;

    const next = async () => {
      if (called) return;

      called = true;

      index++;

      await this.executeMiddleware(context, index);
    };

    try {
      const body = await middleware(context, next);

      if (called || !body) return;

      await this.processMiddlewareResponse(body, context);
    } catch (error) {
      context.error = error as Error | HttpError;

      await this.processUncaughtError(context);
    }
  }

  /**
   * Process an unknown response body with HTTP context.
   *
   * @param body An unknown response body to process.
   * @param context The current HTTP context.
   *
   * @returns Promise<void>
   */
  private async processMiddlewareResponse(
    body: unknown,
    context: Context,
  ): Promise<void> {
    const processed = await this.responseManager.process(body, context);

    context.response = processed;
  }

  /**
   * Process an uncaught error with HTTP context.
   *
   * @param error The uncaught error object to process.
   * @param context The current HTTP context object.
   *
   * @returns Promise<void>
   */
  private async processUncaughtError(
    context: Context,
  ): Promise<void> {
    if (!this.customErrorHandler) {
      return this.internalErrorHandler(context);
    }

    try {
      const errorBody = await this.customErrorHandler(context);
      await this.processMiddlewareResponse(errorBody, context);
    } catch (_error) {
      // Fall back to internal handler if custom handler fails.
      return this.internalErrorHandler(context);
    }
  }

  /**
   * Handle the uncaught error internally.
   *
   * @param error The uncaught error object to handle.
   * @param context The current HTTP context object.
   *
   * @returns Promise<void>
   */
  private internalErrorHandler(context: Context): Promise<void> {
    return this.processMiddlewareResponse(context.error, context);
  }

  /**
   * Detect the runtime and return correct adapter.
   *
   * @returns A server adapter implementation.
   */
  private getServerAdapter(): ServerAdapter {
    // deno-lint-ignore no-explicit-any
    const Bun = (globalThis as any).Bun;

    // deno-lint-ignore no-explicit-any
    const Deno = (globalThis as any).Deno;

    if (typeof Deno !== "undefined") {
      return new DenoServer();
    }

    if (typeof Bun !== "undefined") {
      return new BunServer();
    }

    return new NodeServer();
  }
}
