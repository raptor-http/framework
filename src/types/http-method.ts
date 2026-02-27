/**
 * Available HTTP methods for routes.
 */
export const HttpMethod = {
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
  TRACE: "TRACE",
  CONNECT: "CONNECT",
} as const;

export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];
