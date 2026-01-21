/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

const APP_URL = "http://localhost:8000";

import Context from "../src/context.ts";

Deno.test("test context falls back to plain text content-type", async () => {
  const context = new Context(
    new Request(APP_URL),
    new Response()
  );

  assertEquals(context.detectAppropriateContentType(), "text/plain");
});

Deno.test("test context detects JSON content-type with accept header", async () => {
  const context = new Context(
    new Request(APP_URL, {
      headers: {
        "Accept": "application/json"
      }
    }),
    new Response()
  );

  assertEquals(context.detectAppropriateContentType(), "application/json");
});

Deno.test("test context detects HTML content-type with accept header", async () => {
  const context = new Context(
    new Request(APP_URL, {
      headers: {
        "Accept": "text/html"
      }
    }),
    new Response()
  );

  assertEquals(context.detectAppropriateContentType(), "text/html");
});

Deno.test("test context detects wildcard content-type with accept header", async () => {
  const context = new Context(
    new Request(APP_URL, {
      headers: {
        "Accept": "*/*"
      }
    }),
    new Response()
  );

  assertEquals(context.detectAppropriateContentType(), "text/plain");
});

Deno.test("test context detects plain text content-type with content-type header", async () => {
  const context = new Context(
    new Request(APP_URL, {
      headers: {
        "Content-Type": "text/plain"
      }
    }),
    new Response()
  );

  assertEquals(context.detectAppropriateContentType(), "text/plain");
});

Deno.test("test context detects HTML content-type with content-type html", async () => {
  const context = new Context(
    new Request(APP_URL, {
      headers: {
        "Content-Type": "text/html"
      }
    }),
    new Response()
  );

  assertEquals(context.detectAppropriateContentType(), "text/html");
});

Deno.test("test context detects JSON content-type with content-type JSON", async () => {
  const context1 = new Context(
    new Request(APP_URL, {
      headers: {
        "Content-Type": "application/json"
      }
    }),
    new Response()
  );

  const context2 = new Context(
    new Request(APP_URL, {
      headers: {
        "Content-Type": "application/hal+json"
      }
    }),
    new Response()
  );

  const context3 = new Context(
    new Request(APP_URL, {
      headers: {
        "Content-Type": "application/problem+json"
      }
    }),
    new Response()
  );

  assertEquals(context1.detectAppropriateContentType(), "application/json");
  assertEquals(context2.detectAppropriateContentType(), "application/json");
  assertEquals(context3.detectAppropriateContentType(), "application/json");
});

