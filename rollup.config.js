"use strict";

import clear from "rollup-plugin-clear";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import screeps from "rollup-plugin-screeps";

const screepsConfigPath = "./.screeps.json";

const dest = process.env.DEST;

let screepsOptions;

if (dest) {
  const config = require(screepsConfigPath)[dest];
  if (!config) {
    throw new Error("Invalid upload destination");
  }
  screepsOptions = {config};
} else {
  console.log("Not uploading, no destination specified");
  screepsOptions = {dryRun: true};
}

export default {
  input: "src/main.ts",
  external: ["lodash"],
  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true
  },
  plugins: [
    clear({targets: ["dist"]}),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    screeps(screepsOptions)
  ]
};
