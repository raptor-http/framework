/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import ServerError from "./server-error.ts";

Deno.test("server error has correct status code", () => {
  const error = new ServerError();

  assertEquals(error.status, 500);
});

Deno.test("server error has correct name", () => {
  const error = new ServerError();

  assertEquals(error.name, "Server Error");
});

Deno.test("server error has default message", () => {
  const error = new ServerError();

  assertEquals(
    error.message,
    "There was an unexpected error handling your request",
  );
});

Deno.test("server error accepts custom message", () => {
  const error = new ServerError("Database connection failed");

  assertEquals(error.message, "Database connection failed");
});
