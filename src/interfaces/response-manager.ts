// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";
import type { ResponseProcessor } from "./response-processor.ts";

/**
 * Manages the processing of response bodies into HTTP Response objects.
 */
export interface ResponseManager {
  /**
   * Process a body into a valid Response object.
   *
   * @param body A body value to process.
   * @param context The current HTTP context.
   *
   * @returns A valid HTTP response object.
   */
  process(body: any, context: Context): Response | Promise<Response>;

  /**
   * Add a new processor to the response manager.
   *
   * @param processor An implementation of the response processor interface.
   *
   * @returns void
   */
  addProcessor(processor: ResponseProcessor): void;
}
