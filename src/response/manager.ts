// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";
import ServerError from "../error/server-error.ts";
import ErrorProcessor from "./processors/error.ts";
import StringProcessor from "./processors/string.ts";
import ObjectProcessor from "./processors/object.ts";
import { ResponseBodyType } from "./constants/body-type.ts";
import ResponseObjectProcessor from "./processors/response-object.ts";
import type { ResponseManager } from "../interfaces/response-manager.ts";
import type { ResponseProcessor } from "../interfaces/response-processor.ts";

/**
 * The response manager takes the response body and processes it
 * into a valid HTTP response.
 */
export default class DefaultResponseManager implements ResponseManager {
  /**
   * All available response processors.
   */
  private processors: Map<string, ResponseProcessor> = new Map();

  /**
   * Initialise the HTTP processor.
   *
   * @constructor
   */
  constructor() {
    this.addProcessor(new ResponseObjectProcessor());
    this.addProcessor(new ErrorProcessor());
    this.addProcessor(new StringProcessor());
    this.addProcessor(new ObjectProcessor());
  }

  /**
   * Add a new processor to the response manager.
   *
   * @param processor An implementation of the processor interface.
   *
   * @returns void
   */
  public addProcessor(processor: ResponseProcessor): void {
    this.processors.set(processor.type(), processor);
  }

  /**
   * Process a body into a valid Response object.
   *
   * @param body A body value to process.
   * @param context The current HTTP context.
   * @returns A valid HTTP response object.
   */
  public process(body: any, context: Context): Response | Promise<Response> {
    const typeKey = this.getTypeKey(body);

    const processor = this.processors.get(typeKey);

    if (!processor) {
      throw new ServerError(
        `No processor was found for this type key: ${typeKey}.`,
      );
    }

    return processor.process(body, context);
  }

  /**
   * Determine the type key for a given body.
   *
   * @param body The response body to check against.
   *
   * @returns A string key representing the body type.
   */
  private getTypeKey(body: any): string {
    if (body instanceof Response) {
      return ResponseBodyType.RESPONSE;
    }

    if (body instanceof Error) {
      return ResponseBodyType.ERROR;
    }

    if (typeof body === "string") {
      return ResponseBodyType.STRING;
    }

    if (typeof body === "object" && body !== null) {
      return ResponseBodyType.OBJECT;
    }

    return "unknown";
  }
}
