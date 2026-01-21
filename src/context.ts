import type { HttpError } from "./interfaces/http-error.ts";

/**
 * The context definition.
 */
export default class Context {
  /**
   * The current HTTP request.
   */
  public request: Request;

  /**
   * The current HTTP response.
   */
  public response: Response;

  /**
   * An error caught by the system.
   */
  public error?: HttpError | Error;

  /**
   * If the response has content type set.
   */
  private _hasContentType?: boolean;

  /**
   * Initialise an HTTP context.
   *
   * @constructor
   */
  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }

  /**
   * Detect what content type is best for the response.
   *
   * @returns An appropriate content type for the request.
   */
  public detectAppropriateContentType(): string {
    const acceptHeader = this.request.headers.get("accept");
    const contentTypeHeader = this.request.headers.get("content-type");

    if (acceptHeader && acceptHeader !== "*/*") {
      const acceptedTypes = this.parseAcceptHeader(acceptHeader);

      for (const type of acceptedTypes) {
        const baseType = this.getBaseMediaType(type);

        if (this.isJsonType(baseType)) {
          return "application/json";
        }

        if (baseType === "text/html") {
          return "text/html";
        }

        if (baseType === "text/plain") {
          return "text/plain";
        }

        if (baseType.startsWith("text/")) {
          return "text/plain";
        }

        if (baseType === "application/*" || baseType === "*/*") {
          return "text/plain";
        }
      }
    }

    if (contentTypeHeader) {
      const baseType = this.getBaseMediaType(contentTypeHeader);

      if (this.isJsonType(baseType)) {
        return "application/json";
      }

      if (baseType === "text/html") {
        return "text/html";
      }
    }

    return "text/plain";
  }

  /**
   * Check if the response has a content-type set.
   *
   * @returns A boolean indicating whether there's a response content-type set.
   */
  public hasContentType(): boolean {
    if (this._hasContentType === undefined) {
      this._hasContentType = this.response.headers.has("content-type");
    }

    return this._hasContentType;
  }

  /**
   * Extract base media type without parameters.
   *
   * @param contentType The content type to retrieve the base type from.
   * @returns The base media type without any parameters.
   */
  private getBaseMediaType(contentType: string): string {
    return contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  }

  /**
   * Check if a content type is JSON or JSON-based.
   *
   * @param contentType The content type to check for JSON.
   * @returns A boolean indicating whether the content type is JSON.
   */
  private isJsonType(contentType: string): boolean {
    return contentType === "application/json" ||
      contentType === "application/hal+json" ||
      contentType === "application/problem+json" ||
      contentType.endsWith("+json");
  }

  /**
   * Parse Accept header and return types sorted by quality value.
   *
   * @param header The header to parse.
   * @returns An array of headers sorted by quality value.
   */
  private parseAcceptHeader(header: string): string[] {
    return header
      .split(",")
      .map((part) => {
        const [type, ...params] = part.trim().split(";");

        if (!type) return null;

        const qMatch = params.find((p) => p.trim().startsWith("q="));

        const qValue = qMatch?.split("=")[1];

        const q = qValue ? parseFloat(qValue) : 1.0;

        return {
          type: type.trim(),
          q,
        };
      })
      .filter((item): item is { type: string; q: number } => item !== null)
      .sort((a, b) => b.q - a.q)
      .map((item) => item.type);
  }
}
