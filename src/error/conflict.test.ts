/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import Conflict from "./conflict.ts";

Deno.test("conflict error has correct status code", () => {
  const error = new Conflict();

  assertEquals(error.status, 409);
});

Deno.test("conflict error has correct name", () => {
  const error = new Conflict();

  assertEquals(error.name, "Conflict");
});

Deno.test("conflict error has default message", () => {
  const error = new Conflict();

  assertEquals(error.message, "Resource already exists");
});

Deno.test("conflict error accepts custom message", () => {
  const error = new Conflict("Email already registered");

  assertEquals(error.message, "Email already registered");
});
