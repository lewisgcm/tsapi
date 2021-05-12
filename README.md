# tsapi - typescript powered OpenAPI specs

This is an experimental project aimed at bringing a strongly typed programmatic experience to OpenAPI definitions. In addition to being strongly typed we can provide helper methods, defaults and short hands.

This project is still experimental and is not ready for use. However you can generate a sample OpenAPI definition by running the command: `npm run generate`. The OpenAPI v3 spec will be available in the `out.json` file.

## Example

#### **`main.ts`**

```ts
import { Generator } from "../lib";
import { MyApi } from "./myApi";

const api = new MyApi();

Generator.generate(api, {
  outDir: "./out.json",
  pretty: true,
});
```

#### **`myApi.ts`**

```ts
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
```
