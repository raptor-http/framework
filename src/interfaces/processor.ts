// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";

type ProcessResponse = Response | null;

/**
 * An HTTP response body processor.
 */
export interface Processor {
  /**
   * Handle the response body and process.
   *
   * @param body Any HTTP response body.
   * @param context The current HTTP context.
   * @returns An HTTP response or null.
   */
  process(
    body: any,
    context: Context,
  ): Promise<ProcessResponse> | ProcessResponse;
}
