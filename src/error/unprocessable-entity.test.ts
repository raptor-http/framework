/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import UnprocessableEntity from "./unprocessable-entity.ts";

Deno.test("unprocessable entity error has correct status code", () => {
  const error = new UnprocessableEntity({});

  assertEquals(error.status, 422);
});

Deno.test("unprocessable entity error has correct name", () => {
  const error = new UnprocessableEntity({});

  assertEquals(error.name, "Unprocessable Entity");
});

Deno.test("unprocessable entity error has default message", () => {
  const error = new UnprocessableEntity({});

  assertEquals(error.message, "Semantic errors in request");
});

Deno.test("unprocessable entity error accepts custom message", () => {
  const error = new UnprocessableEntity({}, "Validation failed");

  assertEquals(error.message, "Validation failed");
});

Deno.test("unprocessable entity error stores errors object", () => {
  const errors = {
    email: ["Invalid format", "Already taken"],
    password: ["Too short"],
  };
  const error = new UnprocessableEntity(errors);

  assertEquals(error.errors, errors);
});

Deno.test("unprocessable entity error handles empty errors object", () => {
  const error = new UnprocessableEntity({});

  assertEquals(error.errors, {});
});
