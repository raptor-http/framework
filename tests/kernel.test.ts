/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "jsr:@std/assert";

import Kernel from "../src/kernel.ts";
import type Context from "../src/context.ts";
import NotFound from "../src/error/not-found.ts";
import BadRequest from "../src/error/bad-request.ts";
import ServerError from "../src/error/server-error.ts";
import ResponseManager from "../src/response/manager.ts";
import type { ResponseProcessor } from "../src/interfaces/response-processor.ts";
import { ResponseBodyType } from "../src/response/constants/body-type.ts";

const APP_URL = "http://localhost:8000";

Deno.test("test kernel handles plain text HTTP response", async () => {
  const app = new Kernel();

  app.add(() => "Test Successful");

  const response = await app.respond(new Request(APP_URL));

  assertEquals(response.headers.get("content-type"), "text/plain");
  assertEquals(await response.text(), "Test Successful");
});

Deno.test("test kernel handles JSON HTTP response", async () => {
  const app = new Kernel();

  app.add(() => ({ value: "Test" }));

  const response = await app.respond(new Request(APP_URL));

  assertEquals(response.headers.get("content-type"), "application/json");
  assertEquals(await response.json(), { value: "Test" });
});

Deno.test("test kernel handles HTML HTTP response", async () => {
  const app = new Kernel();

  app.add(() => "<h1>Test</h1>");

  const response = await app.respond(new Request(APP_URL));

  assertEquals(response.headers.get("content-type"), "text/html");
  assertEquals(await response.text(), "<h1>Test</h1>");
});

Deno.test("test kernel updates middleware context", async () => {
  const app = new Kernel();

  app.add((ctx: Context) => {
    ctx.response.headers.set("content-type", "application/json");

    return "Hello, Dr Malcolm!";
  });

  const response = await app.respond(new Request(APP_URL));

  assertEquals(response.headers.get("content-type"), "application/json");
});

Deno.test("test middleware next callback functionality", async () => {
  const app = new Kernel();

  app.add(async (_ctx: Context, next: CallableFunction) => {
    await next();

    return "Hello from the first middleware";
  });

  app.add(() => {
    return "Hello from the second middleware";
  });

  const response = await app.respond(new Request(APP_URL));

  assertEquals(await response.text(), "Hello from the second middleware");
});

Deno.test("test middleware catches 404 error", async () => {
  const app = new Kernel();

  app.add((_ctx: Context) => {
    throw new NotFound();
  });

  const response = await app.respond(new Request(APP_URL));

  assertEquals(
    await response.text(),
    "Not Found - The resource requested could not be found",
  );
});

Deno.test("test middleware catches server error", async () => {
  const app = new Kernel();

  app.add((_ctx: Context) => {
    throw new ServerError();
  });

  const response = await app.respond(new Request(APP_URL));

  assertEquals(
    await response.text(),
    "Server Error - There was an unexpected error handling your request",
  );
});

Deno.test("test middleware catches bad request error", async () => {
  const app = new Kernel();

  app.add((_ctx: Context) => {
    throw new BadRequest([
      "There was an error in validation of field #1",
      "There was an error in validation of field #2",
    ]);
  });

  const response = await app.respond(new Request(APP_URL));

  assertEquals(
    await response.text(),
    "Bad Request - There was an issue handling your request",
  );
});

Deno.test("test kernel automatically catches error", async () => {
  const app = new Kernel();

  app.add((_ctx: Context) => {
    throw new NotFound();
  });

  const response = await app.respond(new Request(APP_URL));

  assertEquals(
    await response.text(),
    "Not Found - The resource requested could not be found",
  );
});

Deno.test("test kernel automatically catches error by default", async () => {
  const app = new Kernel();

  app.add((_ctx: Context) => {
    throw new NotFound();
  });

  const response = await app.respond(new Request(APP_URL));

  assertEquals(
    await response.text(),
    "Not Found - The resource requested could not be found",
  );
});

Deno.test("test kernel does not automatically catch error", async () => {
  const app = new Kernel();

  app.add((_ctx: Context) => {
    throw new NotFound();
  });

  app.catch((context: Context) => {
    if (context.error instanceof NotFound) {
      return new Response(
        JSON.stringify({
          message: "Nothing was found",
        }),
        {
          status: 404,
        },
      );
    }
  });

  const response = await app.respond(new Request(APP_URL));

  const data = await response.json() as { message: string };

  assertEquals(data.message, "Nothing was found");
});

Deno.test("test new processor is added to kernel", async () => {
  const app = new Kernel();

  class MyStringProcessor implements ResponseProcessor {
    type() {
      return ResponseBodyType.STRING;
    }

    process(body: any): Response {
      return new Response(`MyStringProcessor: ${body}`);
    }
  }

  const manager = new ResponseManager();

  manager.addProcessor(new MyStringProcessor());

  app.setResponseManager(manager);

  app.add(() => "Test");

  const response = await app.respond(new Request(APP_URL));

  assertEquals(await response.text(), "MyStringProcessor: Test");
});
