/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import NotAcceptable from "./not-acceptable.ts";

Deno.test("not acceptable error has correct status code", () => {
  const error = new NotAcceptable();

  assertEquals(error.status, 406);
});

Deno.test("not acceptable error has correct name", () => {
  const error = new NotAcceptable();

  assertEquals(error.name, "Not Acceptable");
});

Deno.test("not acceptable error has default message", () => {
  const error = new NotAcceptable();

  assertEquals(error.message, "Resource can't return requested format");
});

Deno.test("not acceptable error accepts custom message", () => {
  const error = new NotAcceptable("Only JSON supported");

  assertEquals(error.message, "Only JSON supported");
});
