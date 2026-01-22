/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import RequestTimeout from "./request-timeout.ts";

Deno.test("request timeout error has correct status code", () => {
  const error = new RequestTimeout();

  assertEquals(error.status, 408);
});

Deno.test("request timeout error has correct name", () => {
  const error = new RequestTimeout();

  assertEquals(error.name, "Request Timeout");
});

Deno.test("request timeout error has default message", () => {
  const error = new RequestTimeout();

  assertEquals(error.message, "Server timed out waiting for request");
});

Deno.test("request timeout error accepts custom message", () => {
  const error = new RequestTimeout("Request took too long");

  assertEquals(error.message, "Request took too long");
});
