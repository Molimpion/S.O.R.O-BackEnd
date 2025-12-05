// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    // Ignorar pastas de build e arquivos gerados
    ignores: ["dist/**", "node_modules/**", "coverage/**", "**/*.d.ts", "prisma/migrations/**"]
  },
  {
    // Aplicar globais do Node (process, module, require, etc) para TODOS os arquivos JS/TS
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { 
      globals: globals.node 
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,js}"],
    rules: {
      // Regras personalizadas
      "@typescript-eslint/no-explicit-any": "warn", // Apenas avisa, não quebra o build
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { 
          "argsIgnorePattern": "^_", 
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }]
    }
  }
];