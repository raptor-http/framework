// Copyright 2025, @briward. All rights reserved. MIT license.

import Kernel from "./src/kernel.ts";
import Gone from "./src/error/gone.ts";
import Context from "./src/context.ts";
import Conflict from "./src/error/conflict.ts";
import NotFound from "./src/error/not-found.ts";
import Forbidden from "./src/error/forbidden.ts";
import ImATeapot from "./src/error/im-a-teapot.ts";
import BadRequest from "./src/error/bad-request.ts";
import ServerError from "./src/error/server-error.ts";
import Unauthorized from "./src/error/unauthorized.ts";
import NotAcceptable from "./src/error/not-acceptable.ts";
import RequestTimeout from "./src/error/request-timeout.ts";
import ResponseManager from "./src/response/manager.ts";
import TooManyRequests from "./src/error/too-many-requests.ts";
import MethodNotAllowed from "./src/error/method-not-allowed.ts";
import UnprocessableEntity from "./src/error/unprocessable-entity.ts";
import { ResponseBodyType } from "./src/response/constants/body-type.ts";

// Export all available interfaces/types.
export type { Middleware } from "./src/interfaces/middleware.ts";
export type { HttpError as Error } from "./src/interfaces/http-error.ts";
export type { ResponseProcessor } from "./src/interfaces/response-processor.ts";

export {
  BadRequest,
  Conflict,
  Context,
  Forbidden,
  Gone,
  ImATeapot,
  Kernel,
  MethodNotAllowed,
  NotAcceptable,
  NotFound,
  RequestTimeout,
  ResponseBodyType,
  ResponseManager,
  ServerError,
  TooManyRequests,
  Unauthorized,
  UnprocessableEntity,
};
