// Jest globalSetup — runs ONCE in the main process before workers are forked.
// Acquires the auth token and exposes it via process.env.AUTH_TOKEN (workers inherit env).
//
// No path aliases or domain-layer imports: this script is loaded by ts-node in the main
// process, where tsconfig `paths` are not resolved (moduleNameMapper applies to workers only).

import dotenv from 'dotenv';
import supertest from 'supertest';

dotenv.config({quiet: true});

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`[globalSetup] Missing required environment variable: ${name}`);
    }
    return value;
}

export default async function globalSetup(): Promise<void> {
    const baseUrl = requireEnv('BASE_URL');
    const email = requireEnv('EMAIL');
    const password = requireEnv('PASSWORD');

    const response = await supertest(baseUrl)
        .post('/admin/login')
        .type('form')
        .send({email, password});

    if (response.status !== 200) {
        throw new Error(
            `[globalSetup] Authentication failed (status ${response.status}). `
            + `Body: ${JSON.stringify(response.body)}`,
        );
    }

    const {token} = (response.body as {token: string});
    process.env.AUTH_TOKEN = token;
}
