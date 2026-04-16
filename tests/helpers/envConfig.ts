// Environment configuration — single source of truth for base URLs and credentials.

import dotenv from 'dotenv';

dotenv.config({quiet: true});

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}. Check your .env file.`);
    }

    return value;
}

export const env = {
    BASE_URL: requireEnv('BASE_URL'),
    EMAIL: requireEnv('EMAIL'),
    PASSWORD: requireEnv('PASSWORD'),

    // Set by globalSetup (workers inherit via child_process fork). Lazy so GET-only tests don't trigger it.
    get AUTH_TOKEN(): string {
        const value = process.env.AUTH_TOKEN;
        if (!value) {
            throw new Error('AUTH_TOKEN is not set — ensure jest.config.ts registers tests/setup/globalSetup.ts.');
        }
        return value;
    },
};
