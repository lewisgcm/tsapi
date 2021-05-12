import crypto from "crypto";
import { OpenAPIV3 } from "openapi-types";
import { Api } from "./api";

export interface IntegerParameterProps {
  name: string;
  in: "path";
  format?: "int32" | "int64";
  description: string;
  required?: boolean;
}

export class IntegerParameter implements OpenAPIV3.ParameterObject {
  readonly name: string;
  readonly in: string;
  readonly description?: string;
  readonly required?: boolean;
  readonly schema: OpenAPIV3.NonArraySchemaObject;

  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;

  example?: any;
  examples?:
    | { [media: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.ExampleObject }
    | undefined;
  content?: { [media: string]: OpenAPIV3.MediaTypeObject } | undefined;

  constructor(props: IntegerParameterProps) {
    this.name = props.name;
    this.in = props.in;
    this.description = props.description;
    this.required = props.required;
    this.schema = {
      type: "integer",
      format: props.format,
    };
  }
}

export interface PathOptions {
  operationId: string;
  path: string;
  method: OpenAPIV3.HttpMethods;
  summary?: string;
  description?: string;
  servers?: OpenAPIV3.ServerObject[];
  parameters: OpenAPIV3.ParameterObject[];
  responses: {
    [key: string]: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject;
  };
  requestBody?: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject;
}

export class PathOperation {
  public readonly path: string;
  protected operations: OpenAPIV3.OperationObject;

  constructor(public api: Api, options: PathOptions) {
    const path = api.paths[options.path];
    if (path && path[options.method]) {
      throw `API already has a path [${options.path}] cannot redeclare.`;
    }

    this.path = options.path;
    api.paths[options.path] = api.paths[options.path] || {};

    this.operations = api.paths[options.path]![options.method] = {
      summary: options.summary,
      description: options.description,
      servers: options.servers,
      parameters: options.parameters,
      responses: options.responses,
      tags: [],
      requestBody: options.requestBody,
    };
  }

  public get responses() {
    return this.operations.responses;
  }

  public set responses(responses) {
    this.operations.responses = responses;
  }
}

export interface ResponseOptions {
  description: string;
  mimeType?: string;
  schema?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
}

export class Response implements OpenAPIV3.ReferenceObject {
  public readonly $ref: string;

  constructor(api: Api, name: string, options: ResponseOptions) {
    const body = {
      description: options.description,
      content: {
        [options.mimeType || api.defaultMimeType]: {
          schema: options.schema,
        },
      },
    };

    const id =
      name +
      "-" +
      crypto.createHash("md5").update(JSON.stringify(body)).digest("hex");

    api.components.responses = api.components.responses || {};
    api.components.responses[id] = body;

    this.$ref = `#/components/responses/${id}`;
  }
}

export class Schema implements OpenAPIV3.ReferenceObject {
  public readonly $ref: string;

  constructor(api: Api, name: string, schema: OpenAPIV3.SchemaObject) {
    const id =
      name +
      "-" +
      crypto.createHash("md5").update(JSON.stringify(schema)).digest("hex");

    schema.title = schema.title || name;
    api.components.schemas = api.components.schemas || {};
    api.components.schemas[id] = schema;

    this.$ref = `#/components/schemas/${id}`;
  }
}
