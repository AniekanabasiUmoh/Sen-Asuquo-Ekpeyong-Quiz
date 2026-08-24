import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // ttf copies of Lama Sans, read by the OG image route at build time.
    "app/_og-fonts/**",
  ]),
  {
    // A leading underscore is this codebase's marker for "required by the
    // signature, deliberately unused" — the `prevState` a useActionState
    // action must accept, for instance. Without this the convention reads as
    // nine unresolved warnings and the useful ones get lost in them.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    // `react-hooks/set-state-in-effect` is a React Compiler performance
    // heuristic, not a correctness rule, and every hit in this directory is
    // the pattern it cannot distinguish from a mistake: state whose initial
    // value can only come from a browser API that does not exist during SSR
    // — matchMedia("prefers-reduced-motion"), IntersectionObserver, a live
    // clock. Rendering the real value on the server would either mismatch on
    // hydration or ship an animation to someone who asked for none.
    //
    // Scoped to components/ deliberately: if this pattern shows up in a
    // route or an action, that is worth looking at rather than silencing.
    files: ["components/**/*.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
