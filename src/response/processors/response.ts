// deno-lint-ignore-file no-explicit-any

import type Context from "../../context.ts";
import type { Processor } from "../../interfaces/processor.ts";

/**
 * The Response processor for HTTP responses.
 */
export default class ResponseProcessor implements Processor {
  /**
   * Handle the response and process if found.
   *
   * @param response Any HTTP response object.
   * @param context The current HTTP context.
   * @returns An HTTP response or null.
   */
  public process(response: any, _context: Context): Response | null {
    if (response instanceof Response) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    return null;
  }
}
