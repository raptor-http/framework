/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import Forbidden from "./forbidden.ts";

Deno.test("forbidden error has correct status code", () => {
  const error = new Forbidden();

  assertEquals(error.status, 403);
});

Deno.test("forbidden error has correct name", () => {
  const error = new Forbidden();

  assertEquals(error.name, "Forbidden");
});

Deno.test("forbidden error has default message", () => {
  const error = new Forbidden();

  assertEquals(error.message, "Server refused request");
});

Deno.test("forbidden error accepts custom message", () => {
  const error = new Forbidden("Insufficient permissions");

  assertEquals(error.message, "Insufficient permissions");
});
