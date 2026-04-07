// Environment configuration — single source of truth for base URLs and credentials
// dotenv loads .env file into process.env before we read the variables

import dotenv from 'dotenv';

dotenv.config({ quiet: true });

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
};
