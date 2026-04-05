import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  // Use ts-jest to transform .ts and .js files (needed for ESM-only packages like faker v9)
  preset: 'ts-jest/presets/js-with-ts',

  // Runtime environment — Node.js (not browser)
  testEnvironment: 'node',

  // Where to look for tests
  roots: ['<rootDir>/tests'],

  // Test file patterns
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],

  // Path aliases — synced from tsconfig.json
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  // Global hooks — runs before each test file (hasAssertions, shared cleanup, etc.)
  setupFilesAfterEnv: ['<rootDir>/tests/setup/globalHooks.ts'],

  // Transform ESM-only packages (faker v9+ ships as ESM)
  transformIgnorePatterns: ['node_modules[\\\\/](?!@faker-js[\\\\/])'],

  // Parallel execution — run up to 6 spec files simultaneously across workers
  maxWorkers: 6,

  // Reporters — console output + CI/CD artifacts
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports', outputName: 'junit.xml' }],
    ['jest-html-reporters', { publicPath: 'reports', filename: 'report.html' }],
  ],

  // Verbose output — each test listed separately
  verbose: true,

  // Timeout per test (ms) — 7s for API tests
  testTimeout: 7_000,
};

export default config;
