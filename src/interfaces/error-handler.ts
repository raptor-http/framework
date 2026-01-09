import type Context from "../context.ts";

/**
 * Error handler function that processes a response.
 */
export type ErrorHandler = (context: Context) => unknown;
