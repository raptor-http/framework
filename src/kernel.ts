import Context from "./context.ts";
import DefaultServerManager from "./server/manager.ts";
import DefaultResponseManager from "./response/manager.ts";

import type { HttpError } from "./interfaces/http-error.ts";
import type { Middleware } from "./interfaces/middleware.ts";
import type { ErrorHandler } from "./interfaces/error-handler.ts";
import type { ServerManager } from "./interfaces/server-manager.ts";
import type { KernelOptions } from "./interfaces/kernel-options.ts";
import type { ResponseManager } from "./interfaces/response-manager.ts";

/**
 * The root initialiser for the framework.
 */
export default class Kernel {
  /**
   * Options which can be used to change kernel functionality.
   */
  private options: KernelOptions;

  /**
   * The server manager for the kernel.
   */
  private serverManager: ServerManager;

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
  constructor(options?: KernelOptions) {
    this.options = {
      ...this.initialiseDefaultOptions(),
      ...options,
    };

    this.serverManager = new DefaultServerManager();

    this.responseManager = new DefaultResponseManager(
      this.options.strictContentNegotiation,
    );
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
   * Get the configured kernel options.
   *
   * @returns The configured kernel options.
   */
  public getOptions(): KernelOptions {
    return this.options;
  }

  /**
   * Initialises the default kernel options.
   *
   * @returns The default kernel options.
   */
  public initialiseDefaultOptions(): KernelOptions {
    return {
      strictContentNegotiation: false,
    };
  }

  /**
   * Serve the application.
   *
   * @param options Server options.
   */
  public serve(options?: { port?: number }) {
    const port = options?.port ?? 80;

    const handler = (request: Request) => this.respond(request);

    if (!options?.port) {
      this.serverManager.serve(handler);

      return;
    }

    this.serverManager.serve(handler, { port });

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
   * Set or override the server manager for the kernel.
   *
   * @param manager A valid server manager object.
   *
   * @returns void
   */
  public setServerManager(manager: ServerManager): void {
    this.serverManager = manager;
  }

  /**
   * Get the currently registered server manager.
   *
   * @returns The registered server manager.
   */
  public getServerManager(): ServerManager {
    return this.serverManager;
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
   * Get the currently registered response manager.
   *
   * @returns The registered response manager.
   */
  public getResponseManager(): ResponseManager {
    return this.responseManager;
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
}
