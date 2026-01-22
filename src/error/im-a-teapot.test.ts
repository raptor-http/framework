/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import ImATeapot from "./im-a-teapot.ts";

Deno.test("im a teapot error has correct status code", () => {
  const error = new ImATeapot();

  assertEquals(error.status, 418);
});

Deno.test("im a teapot error has correct name", () => {
  const error = new ImATeapot();

  assertEquals(error.name, "I'm a Teapot");
});

Deno.test("im a teapot error has default message", () => {
  const error = new ImATeapot();

  assertEquals(error.message, "Yes, you are.");
});

Deno.test("im a teapot error accepts custom message", () => {
  const error = new ImATeapot("I cannot brew coffee");

  assertEquals(error.message, "I cannot brew coffee");
});
