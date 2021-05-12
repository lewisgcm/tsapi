import { Generator } from "../lib";
import { MyApi } from "./myApi";

const api = new MyApi();

Generator.generate(api, {
  outDir: "./out.json",
  pretty: true,
});
