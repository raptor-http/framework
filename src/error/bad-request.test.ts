/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import BadRequest from "./bad-request.ts";

Deno.test("bad request error has correct status code", () => {
  const error = new BadRequest(["Error 1"]);

  assertEquals(error.status, 400);
});

Deno.test("bad request error has correct name", () => {
  const error = new BadRequest(["Error 1"]);

  assertEquals(error.name, "Bad Request");
});

Deno.test("bad request error has default message", () => {
  const error = new BadRequest(["Error 1"]);

  assertEquals(error.message, "There was an issue handling your request");
});

Deno.test("bad request error accepts custom message", () => {
  const error = new BadRequest(["Error 1"], "Custom message");

  assertEquals(error.message, "Custom message");
});

Deno.test("bad request error stores errors array", () => {
  const errors = ["Error 1", "Error 2", "Error 3"];
  const error = new BadRequest(errors);

  assertEquals(error.errors, errors);
});

Deno.test("bad request error is instanceof Error", () => {
  const error = new BadRequest(["Error 1"]);

  assertEquals(error instanceof Error, true);
});
