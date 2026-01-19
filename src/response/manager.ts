// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";
import ErrorProcessor from "./processors/error.ts";
import StringProcessor from "./processors/string.ts";
import ObjectProcessor from "./processors/object.ts";
import ResponseProcessor from "./processors/response.ts";
import type { Processor } from "../interfaces/processor.ts";

/**
 * The response manager takes the response body and processes it
 * into a valid HTTP response.
 */
export default class ResponseManager {
  /**
   * All available response processors.
   */
  private processors: Map<string, Processor[]> = new Map();

  /**
   * Initialise the HTTP processor.
   *
   * @constructor
   */
  constructor() {
    this.addProcessor("response", new ResponseProcessor());
    this.addProcessor("error", new ErrorProcessor());
    this.addProcessor("string", new StringProcessor());
    this.addProcessor("object", new ObjectProcessor());
  }

  /**
   * Add a new processor to the response manager.
   *
   * @param type The type of value you will be processing.
   * @param processor An implementation of the processor interface.
   * @param weight An optional weight property for handling runtime order.
   *
   * @returns void
   */
  public addProcessor(
    type: string,
    processor: Processor,
    weight: number = 0,
  ): void {
    if (!this.processors.has(type)) {
      this.processors.set(type, []);
    }

    const processors = this.processors.get(type)!;

    const insertIndex = processors.findIndex((p) =>
      (p as any)._weight > weight
    );

    (processor as any)._weight = weight;

    if (insertIndex === -1) {
      processors.push(processor);

      return;
    }

    processors.splice(insertIndex, 0, processor);
  }

  /**
   * Process a body into a valid Response object.
   *
   * @param body A body value to process.
   * @param context The current HTTP context.
   * @returns A valid HTTP response object.
   */
  public async process(body: any, context: Context): Promise<Response> {
    const typeKey = this.getTypeKey(body);

    const processors = this.processors.get(typeKey);

    if (!processors || processors.length === 0) {
      throw new Error(`No processor found for type: ${typeKey}`);
    }

    for (let i = 0; i < processors.length; i++) {
      const response = await processors[i].process(body, context);

      if (response instanceof Response) {
        return response;
      }
    }

    throw new Error("No processor could handle the response body.");
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
      return "response";
    }

    if (body instanceof Error) {
      return "error";
    }

    if (typeof body === "string") {
      return "string";
    }

    if (typeof body === "object" && body !== null) {
      return "object";
    }

    return "unknown";
  }
}
