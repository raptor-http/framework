import type Context from "../context.ts";

/**
 * Middleware function that processes a response.
 */
export type IMiddleware = (
  context: Context,
  next: CallableFunction,
) => unknown;
