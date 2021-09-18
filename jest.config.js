module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  maxWorkers: 1,
  coverageDirectory: './coverage/jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)': '<rootDir>/src/$1',
    '^@config/(.*)': '<rootDir>/src/config/$1',
    "^@shortener/core/(.*)$": "<rootDir>/src/modules/core/$1",
    "^@shortener/shortener/(.*)$": "<rootDir>/src/modules/shortener/$1"
  },
  testTimeout: 30000
};
