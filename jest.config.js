const { pathsToModuleNameMapper } = require('ts-jest');
//const { compilerOptions } = require('./tsconfig.json');
const tsConfigPaths = {
    '@/*': [ 'src/*' ],
    '@tests/*': [ 'tests/*' ],
};

/** @type {import('@jest/types').Config.InitialOptions } */
module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',

    transform: { '^.+\\.tsx?$': 'ts-jest' },
    transformIgnorePatterns: [ 'node_modules/(?!(nanoid)/)' ],

    testRegex: '(/__test__/.*|/tests/.*|(\\.|/)(test|spec))\\.[tj]sx?$',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/tests/fakes/',
        '/tests/fixtures/'
    ],

    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json'
    ],
    moduleNameMapper: pathsToModuleNameMapper(tsConfigPaths, { prefix: `${__dirname}/` }),

    coverageDirectory: './coverage',
    coverageReporters: [ 'html', 'text' ],
    collectCoverageFrom: [
        'src/**/*.{ts,js}',
        '!src/types/**/*',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/dist/**',
        '!**/tests/**'
    ],
};
