import { OpenAPIV3 } from "openapi-types";

export interface ApiOptions {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  servers?: OpenAPIV3.ServerObject[];
  defaultMimeType?: string;
}

export class Api {
  protected document: OpenAPIV3.Document<{}>;
  protected _defaultMimeType: string;

  constructor(apiOptions: ApiOptions) {
    this._defaultMimeType = apiOptions.defaultMimeType || "application/json";

    this.document = {
      openapi: "3.0.3",
      info: {
        title: apiOptions.title,
        version: apiOptions.version,
        description: apiOptions.description,
        termsOfService: apiOptions.termsOfService,
      },
      paths: {},
      tags: [],
      components: {},
      servers: apiOptions.servers,
    };
  }

  public get components() {
    return this.document.components!;
  }

  public get defaultMimeType() {
    return this._defaultMimeType;
  }

  public get openApi() {
    return this.document.openapi;
  }

  public get contact() {
    return this.document.info.contact;
  }

  public set contact(contact: OpenAPIV3.ContactObject | undefined) {
    this.document.info.contact = contact;
  }

  public get paths() {
    return this.document.paths;
  }

  public set termsOfService(tos: string | undefined) {
    this.document.info.termsOfService = tos;
  }

  public get termsOfService() {
    return this.document.info.termsOfService;
  }

  public set license(license: OpenAPIV3.LicenseObject) {
    this.document.info.license = license;
  }

  public getDocument() {
    return this.document;
  }
}
