import angularEslintPlugin from "@angular-eslint/eslint-plugin";
import js from "@eslint/js";
import * as parser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import globals from "globals";


export default defineConfig([
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        sourceType: "module"
      }
    },
    plugins: { "@angular-eslint": angularEslintPlugin },
    rules: {
      // Desactiva todas las reglas conflictivas
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@angular-eslint/prefer-inject": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      // ...desactiva cualquier otra regla conflictiva
    }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.browser },
  },
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      ".angular",
      "frontend",
      "public",
      "src/**/*.html",
      "src/index.html",
      "src/**/*.spec.ts",
      "src/**/*.css"
    ]
  }
]);
