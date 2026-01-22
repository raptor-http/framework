/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import TooManyRequests from "./too-many-requests.ts";

Deno.test("too many requests error has correct status code", () => {
  const error = new TooManyRequests();

  assertEquals(error.status, 429);
});

Deno.test("too many requests error has correct name", () => {
  const error = new TooManyRequests();

  assertEquals(error.name, "Too Many Requests");
});

Deno.test("too many requests error has default message", () => {
  const error = new TooManyRequests();

  assertEquals(
    error.message,
    "You have exceeded the maximum number of requests",
  );
});

Deno.test("too many requests error accepts custom message", () => {
  const error = new TooManyRequests("Rate limit: 100 requests per hour");

  assertEquals(error.message, "Rate limit: 100 requests per hour");
});
