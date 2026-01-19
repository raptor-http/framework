/**
 * The body type of the response.
 */
export const ResponseBodyType = {
  RESPONSE: "response",
  ERROR: "error",
  STRING: "string",
  OBJECT: "object",
} as const;

export type ResponseBodyType =
  typeof ResponseBodyType[keyof typeof ResponseBodyType];
