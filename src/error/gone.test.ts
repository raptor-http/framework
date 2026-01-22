/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import Gone from "./gone.ts";

Deno.test("gone error has correct status code", () => {
  const error = new Gone();

  assertEquals(error.status, 410);
});

Deno.test("gone error has correct name", () => {
  const error = new Gone();

  assertEquals(error.name, "Gone");
});

Deno.test("gone error has default message", () => {
  const error = new Gone();

  assertEquals(error.message, "Resource no longer exists");
});

Deno.test("gone error accepts custom message", () => {
  const error = new Gone("This endpoint has been removed");

  assertEquals(error.message, "This endpoint has been removed");
});
