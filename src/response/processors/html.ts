// deno-lint-ignore-file no-explicit-any

import type Context from "../../context.ts";
import type { Processor } from "../../interfaces/processor.ts";

/**
 * The HTML processor for HTTP responses.
 */
export default class HtmlProcessor implements Processor {
  /**
   * Handle the response and process HTML if found.
   *
   * @param body Any HTTP response body.
   * @param context The current HTTP context.
   * @returns An HTTP response or null.
   */
  public process(body: any, context: Context) {
    // Check if the response already has a content type set.
    const hasContentType = context.response.headers.get("content-type");

    // If the middleware returns a string and contains HTML, process HTML.
    if (typeof body === "string") {
      const isHtml = (new RegExp(/<[a-z/][\s\S]*>/i)).test(body);

      if (isHtml && !hasContentType) {
        context.response.headers.set("content-type", "text/html");
      }

      return new Response(body, {
        status: context.response.status,
        headers: context.response.headers,
      });
    }

    return null;
  }
}
