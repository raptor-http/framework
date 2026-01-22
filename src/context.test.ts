/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import Context from "../src/context.ts";

Deno.test("context detects when content-type is set on response", () => {
  const request = new Request("http://localhost");

  const response = new Response(null, {
    headers: { "content-type": "application/json" },
  });

  const context = new Context(request, response);

  assertEquals(context.hasContentType(), true);
});

Deno.test("context detects when content-type is not set on response", () => {
  const request = new Request("http://localhost");

  const response = new Response();

  const context = new Context(request, response);

  assertEquals(context.hasContentType(), false);
});

Deno.test("context caches hasContentType check", () => {
  const request = new Request("http://localhost");
  const response = new Response();

  const context = new Context(request, response);

  assertEquals(context.hasContentType(), false);

  response.headers.set("content-type", "text/plain");

  assertEquals(context.hasContentType(), false);
});
