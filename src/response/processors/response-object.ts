// deno-lint-ignore-file no-explicit-any

import type Context from "../../context.ts";
import { ResponseBodyType } from "../constants/body-type.ts";
import type { ResponseProcessor } from "../../interfaces/response-processor.ts";

/**
 * The Response processor for HTTP responses.
 */
export default class ResponseObjectProcessor implements ResponseProcessor {
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
