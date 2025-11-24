module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/api-tests/automated/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  setupFilesAfterEnv: ["<rootDir>/api-tests/setup.ts"],

  setupFiles: ["dotenv/config"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/configs/environment.ts",
    "!src/routes/*.ts",
  ],
};
