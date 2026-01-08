// deno-lint-ignore-file

import Context from "./http/context.ts";
import BunServer from "./server/adapters/bun.ts";
import ServerError from "./error/server-error.ts";
import NodeServer from "./server/adapters/node.ts";
import DenoServer from "./server/adapters/deno.ts";
import ResponseManager from "./http/response-manager.ts";
import type { HttpError } from "./interfaces/http-error.ts";
import type { ServerAdapter } from "./interfaces/server-adapter.ts";

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
  private middleware: CallableFunction[] = [];

  /**
   * An optional custom error handler function.
   */
  private customErrorHandler?: CallableFunction;

  /**
   * Initialise the kernel.
   *
   * @constructor
   */
  constructor() {
    this.responseManager = new ResponseManager();
  }

  /**
   * Add a new module to the container.
   *
   * @param middleware An HTTP middleware instance.
   */
  public add(middleware: CallableFunction) {
    this.middleware.push(middleware);
  }

  /**
   * Alias method for "add".
   *
   * @param middleware An HTTP middleware instance.
   */
  public use(middleware: CallableFunction) {
    this.add(middleware);
  }

  /**
   * Serve the application.
   *
   * @param options Server options.
   */
  public serve(options?: { port?: number }) {
    const server = this.getServerAdapter();

    const handler = (request: Request) => this.respond(request);

    if (!options?.port) {
      server.serve(handler);

      return;
    }

    server.serve(handler, { port: options.port ?? 80 });
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
   * @param request
   * @returns A promise resolving the HTTP response.
   */
  public async respond(request: Request): Promise<Response> {
    const context = new Context(request.clone(), new Response());

    await this.next(context);

    return context.response;
  }

  /**
   * Set or override the response manager for the kernel.
   *
   * @param manager A valid response manager object.
   * @returns void
   */
  public setResponseManager(manager: ResponseManager): void {
    this.responseManager = manager;
  }

  /**
   * Add custom error handling middleware.
   *
   * @param middleware A middleware function to handle errors.
   * @returns void
   */
  public catch(middleware: CallableFunction): void {
    this.customErrorHandler = middleware;
  }

  /**
   * Handle the processing of middleware.
   *
   * @param context The current HTTP context.
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
 * @returns Promise<Response | void>
 */
  private async executeMiddleware(
    context: Context,
    index: number,
  ): Promise<Response | void> {
    if (index >= this.middleware.length) return;

    const middleware = this.middleware[index];

    if (!middleware) return;
    
    let called = false;

    const next = async (): Promise<Response | void> => {
      if (called) {
        throw new ServerError("next() called multiple times");
      }

      called = true;

      return await this.executeMiddleware(context, index + 1);
    };

    try {
      const body = await middleware(context, next);

      if (called) return;

      if (!body) return;

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
   */
  private async processMiddlewareResponse(
    body: any,
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
    } catch (error) {
      // Fall back to internal handler if custom handler fails.
      return this.internalErrorHandler(context);
    }
  }

  /**
   * Handle the uncaught error internally.
   *
   * @param error The uncaught error object to handle.
   * @param context The current HTTP context object.
   * @returns Promise<void>
   */
  private async internalErrorHandler(context: Context): Promise<void> {
    return this.processMiddlewareResponse(context.error, context);
  }

  /**
   * Detect the runtime and return correct adapter.
   *
   * @returns A server adapter implementation.
   */
  private getServerAdapter(): ServerAdapter {
    const Bun = (globalThis as any).Bun;
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
