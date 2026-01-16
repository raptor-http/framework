// deno-lint-ignore-file no-explicit-any

import type Context from "../../context.ts";
import type { Processor } from "../../interfaces/processor.ts";

/**
 * The JSON object processor for HTTP responses.
 */
export default class JsonProcessor implements Processor {
  /**
   * Handle the response and process JSON objects if found.
   *
   * @param body Any HTTP response body.
   * @param context The current HTTP context.
   * @returns An HTTP response or null.
   */
  public process(body: any, context: Context) {
    // Check if the response already has a content type set.
    const hasContentType = context.hasContentType();

    // If the middleware doesn't return an object, don't process.
    if (typeof body !== "object") return null;

    if (!hasContentType) {
      context.response.headers.set("content-type", "application/json");
    }

    try {
      const jsonBody = JSON.stringify(body);

      return new Response(jsonBody, {
        status: context.response.status,
        headers: context.response.headers,
      });
    } catch (_error) {
      return null;
    }
  }
}
