// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";
import JsonProcessor from "./processors/json.ts";
import HtmlProcessor from "./processors/html.ts";
import ErrorProcessor from "./processors/error.ts";
import { HTML_REGEX } from "../helpers/html-regex.ts";
import ResponseProcessor from "./processors/response.ts";
import type { Processor } from "../interfaces/processor.ts";
import PlainTextProcessor from "./processors/plain-text.ts";

/**
 * The response manager takes the response body and processes it
 * into a valid HTTP response.
 */
export default class ResponseManager {
  /**
   * All available response processors.
   */
  private processors: Map<string, Processor> = new Map();

  /**
   * Initialise the HTTP processor.
   *
   * @constructor
   */
  constructor() {
    this.processors.set("response", new ResponseProcessor());
    this.processors.set("error", new ErrorProcessor());
    this.processors.set("string:plain", new PlainTextProcessor());
    this.processors.set("string:html", new HtmlProcessor());
    this.processors.set("object", new JsonProcessor());
  }

  /**
   * Add a new processor to the response manager.
   *
   * @param key A unique key for your processor.
   * @param processor An implementation of the processor interface.
   * @returns void
   */
  public addProcessor(key: string, processor: Processor): void {
    this.processors.set(key, processor);
  }

  /**
   * Process a body into a valid Response object.
   *
   * @param body A body value to process.
   * @param context The current HTTP context.
   * @returns A valid HTTP response object.
   */
  public async process(
    body: any,
    context: Context,
  ): Promise<Response> {
    const typeKey = this.getTypeKey(body);

    const response = await this.processors.get(typeKey)!.process(body, context);

    if (response instanceof Response) {
      return response;
    }

    throw new Error("No response body was found.");
  }

  /**
   * Determine the type key for a given body.
   *
   * @param body The response body to classify.
   *
   * @returns A string key identifying the body type.
   */
  private getTypeKey(body: any): string {
    if (body instanceof Response) {
      return "Response";
    }

    if (body instanceof Error) {
      return "Error";
    }

    if (typeof body === "string") {
      return HTML_REGEX.test(body) ? "string:html" : "string:plain";
    }

    if (typeof body === "object" && body !== null) {
      return "object";
    }

    return "unknown";
  }
}
