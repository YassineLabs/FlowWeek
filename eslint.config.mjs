import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig(
  tseslint.config(
    {
      ignores: ["dist/**", "node_modules/**"],
    },
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      plugins: {
        "@typescript-eslint": tseslint.plugin,
        react: reactPlugin,
        "react-hooks": reactHooksPlugin,
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      },
    },
  ),
);
