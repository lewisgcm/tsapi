import { Api, IntegerParameter, PathOperation, Response } from "../lib";
import { OpenAPIV3 } from "openapi-types";

import { buildStandardResponses } from "./messages";

export class MyApi extends Api {
  constructor() {
    super({
      title: "MyAPI",
      version: "1.0.0",
      description: "This is a sample API to do stuff.",
      servers: [
        {
          url: "https://api.cool.com/v3",
        },
      ],
      termsOfService: "https://legal.com",
    });

    this.contact = { name: "Api Dude", email: "email@gmail.com" };
    this.license = { name: "MIT" };

    const standardResponses = buildStandardResponses(this);

    const okResponse = new Response(this, "OkResponse", {
      description: "idk",
      schema: {
        title: "User",
        type: "object",
        required: ["username"],
        properties: {
          username: {
            type: "string",
            minLength: 1,
            maxLength: 10,
          },
        },
      },
    });

    new PathOperation(this, {
      operationId: "SaveUser",
      path: "/user/{user_id}",
      method: OpenAPIV3.HttpMethods.POST,
      parameters: [
        new IntegerParameter({
          in: "path",
          name: "user_id",
          required: true,
          description: "User id",
        }),
      ],
      responses: {
        ...standardResponses,
        200: okResponse,
      },
    });
  }
}
