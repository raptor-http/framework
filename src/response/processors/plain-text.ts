// deno-lint-ignore-file no-explicit-any

import type Context from "../../context.ts";
import type { Processor } from "../../interfaces/processor.ts";

/**
 * The plain text processor for HTTP responses.
 */
export default class PlainTextProcessor implements Processor {
  /**
   * Handle the response and process plain text if found.
   *
   * @param body Any HTTP response body.
   * @param context The current HTTP context.
   * @returns An HTTP response or null.
   */
  public process(body: any, context: Context): Response | null {
    // Check if the response already has a content type set.
    const hasContentType = context.hasContentType();

    if (!hasContentType) {
      context.response.headers.set("content-type", "text/plain");
    }

    return new Response(body, {
      status: context.response.status,
      headers: context.response.headers,
    });
  }
}
