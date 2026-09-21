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
  ]),
  {
    rules: {
      // New strict rule from eslint-plugin-react-hooks: flags standard
      // data-fetching effects (setState after async calls). Kept as a
      // warning to avoid risky refactors of working code.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
