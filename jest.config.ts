import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest", // Use ts-jest preset
  testEnvironment: "node", // Or 'jsdom' for frontend tests
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    // If you are using .js imports in TS files
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}", // all source files
    "!src/**/*.d.ts", // ignore type definitions
    "!src/**/index.{ts,js}", // optionally ignore index files
    "!src/tests/**", // ignore test files themselves
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};

export default config;
