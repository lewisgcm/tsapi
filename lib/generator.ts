import { writeFile } from "fs";
import validator from "ibm-openapi-validator";

import { Api } from "./api";

const bulletPoint = "\u2022";
const colours = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    crimson: "\x1b[38m",
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    crimson: "\x1b[48m",
  },
};

export namespace Generator {
  export interface GeneratorOptions {
    outDir: string;
    strict?: boolean;
    pretty?: boolean;
  }

  export function generate(api: Api, options: GeneratorOptions) {
    const document = api.getDocument();

    console.log(
      colours.fg.green,
      `${bulletPoint} Starting API validation [OpenAPI v${api.openApi}]`,
      colours.reset
    );

    validator(document, true)
      .then((validationResults) => {
        if (validationResults.errors?.length > 0) {
          console.error(
            colours.fg.red,
            `${bulletPoint} Validation failed`,
            colours.reset
          );

          for (let message of validationResults.errors) {
            console.error(
              colours.fg.red,
              "   \u2022",
              colours.bright,
              message.message,
              colours.reset
            );
            console.error(
              colours.fg.red,
              "         ",
              message.path,
              colours.reset
            );
          }

          return;
        }

        if (validationResults.warnings?.length > 0) {
          console.warn(
            colours.fg.yellow,
            `${bulletPoint} Validation warnings`,
            colours.reset
          );

          for (let message of validationResults.warnings) {
            console.warn(
              colours.fg.yellow,
              "   \u2022",
              colours.bright,
              message.message,
              colours.reset
            );
            console.warn(
              colours.fg.yellow,
              "         ",
              Array.isArray(message.path)
                ? message.path.join(".")
                : message.path,
              colours.reset
            );
          }

          if (options?.strict) {
            console.error(
              colours.fg.red,
              `${bulletPoint} Failed to generate specification without warnings (strict mode enabled)`,
              colours.reset
            );

            return;
          }
        }

        writeFile(
          options.outDir,
          JSON.stringify(document, null, options.pretty === true ? 2 : 0),
          function (err) {
            if (err) {
              console.error(
                colours.fg.red,
                `${bulletPoint} Failed to write API spec with error: ${err}.`,
                colours.reset
              );
            } else {
              console.log(
                colours.fg.green,
                `${bulletPoint} API spec generated.`,
                colours.reset
              );
            }
          }
        );
      })
      .catch((error: any) => {
        console.error(
          colours.fg.red,
          `${bulletPoint} Failed to validate API spec with error: ${error}.`,
          colours.reset
        );
      });
  }
}
