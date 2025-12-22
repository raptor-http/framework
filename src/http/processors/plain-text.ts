// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";
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
    const hasContentType = context.response.headers.get("content-type");

    // If the middleware doesn't return a string, don't process.
    if (typeof body !== "string") return null;

    // Check if the string contains HTML, ignore if it does.
    const isHtml = (new RegExp(/<[a-z/][\s\S]*>/i)).test(body);

    if (isHtml) return null;

    if (!isHtml && !hasContentType) {
      context.response.headers.set("content-type", "text/plain");
    }

    return new Response(body, {
      status: context.response.status,
      headers: context.response.headers,
    });
  }
}
