/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import ContentNegotiator from "./content-negotiator.ts";

Deno.test("content negotiator detects JSON from accept header", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/json" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator detects HTML from accept header", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "text/html" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator detects plain text from accept header", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "text/plain" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator defaults to plain text with no headers", () => {
  const request = new Request("http://localhost");

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator defaults to plain text with wildcard accept", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "*/*" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator prioritizes higher quality value", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "text/html;q=0.5, application/json;q=0.9" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator prioritizes lower quality specific type over higher quality wildcard", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "text/html;q=0.5, text/*;q=0.9" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator assumes quality 1.0 when not specified", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/json, text/html;q=0.5" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator filters out q=0 (not acceptable)", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/json;q=0, text/html;q=1.0" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator handles fractional quality values", () => {
  const request = new Request("http://localhost", {
    headers: {
      "accept": "text/html;q=0.7, application/json;q=0.8, text/plain;q=0.6",
    },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator prefers specific type over subtype wildcard with equal quality", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "text/*, text/html" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator prefers specific type over full wildcard with equal quality", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "*/*, application/json" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator prefers subtype wildcard over full wildcard with equal quality", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "*/*, text/*" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator detects HAL+JSON as JSON", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/hal+json" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator detects Problem+JSON as JSON", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/problem+json" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator detects custom +json format as JSON", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/vnd.api+json" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator prioritizes standard JSON over custom +json with higher quality", () => {
  const request = new Request("http://localhost", {
    headers: {
      "accept": "application/vnd.api+json;q=0.9, application/json;q=1.0",
    },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator handles text/* wildcard", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "text/*" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator handles application/* wildcard", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/*" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator skips wildcards when specific types available", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "*/*, text/html;q=0.5" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator returns default for wildcard-only accept", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "*/*" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator uses content-type as fallback when no accept header", () => {
  const request = new Request("http://localhost", {
    headers: { "content-type": "application/json" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator uses content-type fallback when accept has no matches", () => {
  const request = new Request("http://localhost", {
    headers: {
      "accept": "image/png, video/mp4",
      "content-type": "application/json",
    },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator prefers accept over content-type", () => {
  const request = new Request("http://localhost", {
    headers: {
      "accept": "text/html",
      "content-type": "application/json",
    },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator handles content-type with charset parameter", () => {
  const request = new Request("http://localhost", {
    headers: { "content-type": "application/json; charset=utf-8" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator handles content-type HTML fallback", () => {
  const request = new Request("http://localhost", {
    headers: { "content-type": "text/html" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator handles complex browser accept header", () => {
  const request = new Request("http://localhost", {
    headers: {
      "accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator handles accept header with spaces", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "  application/json  ,  text/html  " },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator handles multiple parameters per type", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/json;q=0.9;level=1, text/html" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator handles accept with only unsupported types", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "image/png, video/mp4, audio/mpeg" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator handles empty accept header", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator handles malformed quality value", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/json;q=abc, text/html" },
  });

  // NaN from parseFloat should be handled gracefully
  // Since q=abc becomes NaN, it should be filtered or handled
  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator handles negative quality value", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/json;q=-0.5, text/html" },
  });

  // Negative q should be filtered out (q > 0 check)
  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator handles quality value greater than 1", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/json;q=1.5, text/html;q=1.0" },
  });

  // Should accept and sort by value even if > 1.0
  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator handles accept header with trailing comma", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "application/json, text/html," },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator handles accept header with leading comma", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": ", application/json, text/html" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator handles case-insensitive media types", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "APPLICATION/JSON" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator handles mixed case media types", () => {
  const request = new Request("http://localhost", {
    headers: { "accept": "Text/HTML" },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator parseAcceptHeader sorts by quality descending", () => {
  const result = ContentNegotiator.parseAcceptHeader(
    "text/html;q=0.5, application/json;q=0.9, text/plain;q=0.3",
  );

  assertEquals(result, ["application/json", "text/html", "text/plain"]);
});

Deno.test("content negotiator parseAcceptHeader sorts by specificity when quality equal", () => {
  const result = ContentNegotiator.parseAcceptHeader(
    "*/*, text/*, text/html",
  );

  // All have q=1.0, so sort by specificity: text/html (2) > text/* (1) > */* (0)
  assertEquals(result, ["text/html", "text/*", "*/*"]);
});

Deno.test("content negotiator parseAcceptHeader filters out q=0", () => {
  const result = ContentNegotiator.parseAcceptHeader(
    "application/json, text/html;q=0, text/plain",
  );

  assertEquals(result.includes("text/html"), false);
  assertEquals(result.includes("application/json"), true);
  assertEquals(result.includes("text/plain"), true);
});

Deno.test("content negotiator parseAcceptHeader handles empty string", () => {
  const result = ContentNegotiator.parseAcceptHeader("");

  assertEquals(result, []);
});

Deno.test("content negotiator parseAcceptHeader handles single type", () => {
  const result = ContentNegotiator.parseAcceptHeader("application/json");

  assertEquals(result, ["application/json"]);
});

Deno.test("content negotiator parseAcceptHeader handles types with extra parameters", () => {
  const result = ContentNegotiator.parseAcceptHeader(
    "application/json;level=1;q=0.9, text/html;charset=utf-8",
  );

  // Should extract types and sort by quality
  assertEquals(result, ["text/html", "application/json"]);
});

Deno.test("content negotiator handles typical browser request", () => {
  const request = new Request("http://localhost", {
    headers: {
      "accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/html");
});

Deno.test("content negotiator handles typical API client request", () => {
  const request = new Request("http://localhost", {
    headers: {
      "accept": "application/json, text/plain, */*",
    },
  });

  assertEquals(ContentNegotiator.negotiate(request), "application/json");
});

Deno.test("content negotiator handles curl default accept", () => {
  const request = new Request("http://localhost", {
    headers: {
      "accept": "*/*",
    },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});

Deno.test("content negotiator handles fetch API default", () => {
  const request = new Request("http://localhost", {
    headers: {
      "accept": "*/*",
    },
  });

  assertEquals(ContentNegotiator.negotiate(request), "text/plain");
});
