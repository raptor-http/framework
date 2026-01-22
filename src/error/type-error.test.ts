/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import TypeError from "./type-error.ts";

Deno.test("type error has correct status code", () => {
  const error = new TypeError();

  assertEquals(error.status, 500);
});

Deno.test("type error has correct name", () => {
  const error = new TypeError();

  assertEquals(error.name, "Type Error");
});

Deno.test("type error has default message", () => {
  const error = new TypeError();

  assertEquals(
    error.message,
    "There was a problem running the application code",
  );
});

Deno.test("type error accepts custom message", () => {
  const error = new TypeError("Invalid type passed to function");

  assertEquals(error.message, "Invalid type passed to function");
});
