// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";
import type { ResponseBodyType } from "../response/constants/body-type.ts";

/**
 * An HTTP response body processor.
 */
export interface Processor {
  /**
   * The response body type the processor handles.
   *
   * @returns The body type.
   */
  type() : ResponseBodyType;

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
  ): Promise<Response> | Response;
}
