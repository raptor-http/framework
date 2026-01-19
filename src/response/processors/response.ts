// deno-lint-ignore-file no-explicit-any

import type Context from "../../context.ts";
import { ResponseBodyType } from "../constants/body-type.ts";
import type { Processor } from "../../interfaces/processor.ts";

/**
 * The Response processor for HTTP responses.
 */
export default class ResponseProcessor implements Processor {
  /**
     * The response body type the processor handles.
     *
     * @returns The body type.
     */
  type(): ResponseBodyType {
    return ResponseBodyType.RESPONSE;
  }

  /**
   * Handle the response and process if found.
   *
   * @param response Any HTTP response object.
   * @param context The current HTTP context.
   * @returns An HTTP response.
   */
  public process(response: any, _context: Context): Response {
    return response;
  }
}
