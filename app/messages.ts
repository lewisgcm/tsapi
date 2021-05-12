import { Schema, Response } from "../lib";
import { MyApi } from "./myApi";

export function buildStandardResponses(api: MyApi) {
  const messageSchema = new Schema(api, "ServerMessage", {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  });

  const errorSchema = new Schema(api, "ErrorMessage", {
    type: "object",
    properties: {
      error: {
        type: "string",
      },
    },
  });

  const notFoundResponse = new Response(api, "NotFoundResponse", {
    description: "Resource not found",
    schema: messageSchema,
  });

  const internalErrorResponse = new Response(api, "InternalErrorResponse", {
    description: "Internal server error",
    schema: errorSchema,
  });

  const badRequestResponse = new Response(api, "BadRequestResponse", {
    description: "Bad request",
    schema: messageSchema,
  });

  return {
    400: badRequestResponse,
    404: notFoundResponse,
    500: internalErrorResponse,
  };
}
