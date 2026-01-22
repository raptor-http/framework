/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import MethodNotAllowed from "./method-not-allowed.ts";

Deno.test("method not allowed error has correct status code", () => {
  const error = new MethodNotAllowed();

  assertEquals(error.status, 405);
});

Deno.test("method not allowed error has correct name", () => {
  const error = new MethodNotAllowed();

  assertEquals(error.name, "Method Not Allowed");
});

Deno.test("method not allowed error has default message", () => {
  const error = new MethodNotAllowed();

  assertEquals(error.message, "Request method not permitted");
});

Deno.test("method not allowed error accepts custom message", () => {
  const error = new MethodNotAllowed("POST not allowed on this resource");

  assertEquals(error.message, "POST not allowed on this resource");
});
