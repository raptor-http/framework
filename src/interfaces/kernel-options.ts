/**
 * Options which can be used to change kernel functionality.
 */
export interface KernelOptions {
  /**
   * Enable strict RFC 7231 content negotiation.
   *
   * When true, throws not acceptable if response cannot match accept header.
   * When false, returns content regardless of accept header.
   */
  strictContentNegotiation?: boolean;
}
