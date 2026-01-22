/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import Unauthorized from "./unauthorized.ts";

Deno.test("unauthorized error has correct status code", () => {
  const error = new Unauthorized();

  assertEquals(error.status, 401);
});

Deno.test("unauthorized error has correct name", () => {
  const error = new Unauthorized();

  assertEquals(error.name, "Unauthorized");
});

Deno.test("unauthorized error has default message", () => {
  const error = new Unauthorized();

  assertEquals(error.message, "Authentication required");
});

Deno.test("unauthorized error accepts custom message", () => {
  const error = new Unauthorized("Invalid token");

  assertEquals(error.message, "Invalid token");
});
