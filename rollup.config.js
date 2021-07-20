// rollup.config.js
import eslint from "@rollup/plugin-eslint";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
// import babel from "@rollup/plugin-babel";

export default {
  input: "./main2.js",
  output: [{
    file: "bundle.js",
    format: "esm",
  }, {
    file: "bundle2.js",
    format: "cjs",
  },
  {
    file: "bundle3.js",
    format: "umd",
  }],
  plugins: [
    json(),
    resolve({
      preferBuiltins: false,
    }),
    commonjs({
      include: "node_modules/**",
    }),
    eslint({
      throwOnError: true, // 抛出异常并阻止打包
      // include: ["src/**"],
      exclude: ["node_modules/**"],
    }),
    // babel({ babelHelpers: "bundled" }),
  ],
};
