/**
 *  @type {import("prettier").Options}
 */
const config = {
  plugins: [
    "prettier-plugin-css-order",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  cssDeclarationSorterOrder: "smacss",
  importOrder: [
    "^solid-js$",
    "<TYPES>^(solid-js)",
    "^@*solid",
    "<TYPES>^(@*solid)",
    "^clsx$",
    "<TYPES>^(clsx)",
    "<BUILTIN_MODULES>",
    "<TYPES>^(node:)",
    "<THIRD_PARTY_MODULES>",
    "<TYPES>^([@a-z])",
    "^~/(.*)$",
    "<TYPES>^~/(.*)",
    "^[.]",
    "<TYPES>",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  importOrderTypeScriptVersion: "5.8.3",
  tailwindFunctions: ["clsx", "cn", "cva", "cx"],
};

export default config;
