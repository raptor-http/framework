import type { Context } from "@raptor/framework";

/**
 * Error handler function that processes a response.
 */
export type ErrorHandler = (context: Context) => unknown;
