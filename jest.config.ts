import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  verbose: true,
  projects: [
    {
      displayName: "client",
      clearMocks: true,
      testEnvironment: "jsdom",
      testMatch: [
        "**/tests/unit/**/*.+(test|spec).[jt]s?(x)",
        "**/tests/integration/**/*.client.+(test|spec).[jt]s?(x)",
        "**/*.client.+(test|spec).[jt]s?(x)",
      ],
      testPathIgnorePatterns: [".*\\.server\\.(test|spec)\\.[jt]s?(x)$"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
      },
    },
    {
      displayName: "server",
      clearMocks: true,
      testEnvironment: "node",
      testMatch: [
        "**/*tests/integration/**/*.server.+(test|spec).[jt]s?(x)",
        "**/*.server.+(test|spec).[jt]s?(x)",
      ],
      testPathIgnorePatterns: [".*\\.client\\.(test|spec)\\.[jt]s?(x)$"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
      setupFilesAfterEnv: ["<rootDir>/jest.server.setup.ts"],
      transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
      },
    },
  ],
  coverageProvider: "v8",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "components/**/*.{js,ts,jsx,tsx,mdx}",
    "lib/**/*.{js,ts}",
    // "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/**/*.{ts,tsx}",
    // "./constants/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/*.test.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    // "!**/.next/**",
    // "!**/out/**",
    // "!**/built/**",
    // "!**/next-env.d.ts",
    // "!**/jest.config.ts",
    // "!**/jest.setup.ts",
    // "!**/__test__/**",
    // "!**/coverage/**",
    // "!**/public/**",
    // "!**/app/layout.tsx",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
