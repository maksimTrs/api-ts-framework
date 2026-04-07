import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';


export default tseslint.config(
    // Base JS rules
    eslint.configs.recommended,

    // TypeScript rules
    ...tseslint.configs.recommended,

    // Jest rules (test files only)
    {
        files: ['tests/**/*.ts'],
        ...jest.configs['flat/recommended'],
        rules: {
            ...jest.configs['flat/recommended'].rules,
            'jest/consistent-test-it': ['error', { fn: 'it' }],
            'jest/no-standalone-expect': ['error', {
                additionalTestBlockFunctions: ['beforeEach', 'afterEach', 'beforeAll', 'afterAll'],
            }],
        },
    },


    // Ignored directories
    {
        ignores: ['node_modules/', 'coverage/', 'reports/'],
    },
);
