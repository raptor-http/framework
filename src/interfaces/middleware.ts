import type { Context } from "@raptor/framework";

/**
 * Middleware function that processes a response.
 */
export type Middleware = (
  context: Context,
  next: CallableFunction,
) => unknown;
