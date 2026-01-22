/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import NotFound from "./not-found.ts";

Deno.test("not found ehas correct status code", () => {
  const error = new NotFound();

  assertEquals(error.status, 404);
});

Deno.test("not found ehas correct name", () => {
  const error = new NotFound();

  assertEquals(error.name, "Not Found");
});

Deno.test("not found ehas default message", () => {
  const error = new NotFound();

  assertEquals(error.message, "The resource requested could not be found");
});

Deno.test("not found error accepts custom message", () => {
  const error = new NotFound("User not found");

  assertEquals(error.message, "User not found");
});
