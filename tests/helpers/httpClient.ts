// Generic HTTP transport wrapping SuperTest. Owns the agent, injects Bearer auth,
// and attaches per-request logs to the current test via jest-html-reporters.

import supertest, {type Agent, type Response, type Test} from 'supertest';
import {addMsg} from 'jest-html-reporters/helper';
import {env} from '@helpers/envConfig';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestMeta {
    method: HttpMethod;
    path: string;
    body?: unknown;
    form?: Record<string, string>;
}

interface RequestLog {
    method: HttpMethod;
    url: string;
    statusCode: number;
    durationMs: number;
    requestBody?: unknown;
    requestForm?: Record<string, string>;
    responseBody?: unknown;
}

const SENSITIVE_KEY = /password|secret|token/i;

function redact(form: Record<string, string>): Record<string, string> {
    return Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, SENSITIVE_KEY.test(k) ? '***' : v]),
    );
}

export class HttpClient {
    private readonly agent: Agent;

    constructor(
        private readonly baseUrl: string,
        private readonly authToken?: string,
    ) {
        this.agent = supertest(baseUrl);
    }

    // Immutable: returns a new instance — original is untouched, safe to share across tests.
    withToken(token: string): HttpClient {
        return new HttpClient(this.baseUrl, token);
    }

    get(path: string): Test {
        return this.wrap(this.agent.get(path), {method: 'GET', path});
    }

    post<T = unknown>(path: string, body?: T): Test {
        const req = this.agent.post(path);
        if (body !== undefined) req.send(body as object);
        return this.wrap(req, {method: 'POST', path, body});
    }

    put<T = unknown>(path: string, body?: T): Test {
        const req = this.agent.put(path);
        if (body !== undefined) req.send(body as object);
        return this.wrap(req, {method: 'PUT', path, body});
    }

    delete(path: string): Test {
        return this.wrap(this.agent.delete(path), {method: 'DELETE', path});
    }

    postForm(path: string, form: Record<string, string>): Test {
        const req = this.agent.post(path).type('form').send(form);
        return this.wrap(req, {method: 'POST', path, form});
    }

    private wrap(req: Test, meta: RequestMeta): Test {
        if (this.authToken) {
            req.set('Authorization', `Bearer ${this.authToken}`);
        }

        const startedAt = Date.now();
        req.on('response', (res: Response) => {
            // Fire-and-forget: tests must not wait on logging, and logging errors must not fail tests.
            void this.log(meta, res, Date.now() - startedAt);
        });

        return req;
    }

    private async log(meta: RequestMeta, res: Response, durationMs: number): Promise<void> {
        try {
            const payload: RequestLog = {
                method: meta.method,
                url: `${this.baseUrl}${meta.path}`,
                statusCode: res.status,
                durationMs,
                ...(meta.body !== undefined ? {requestBody: meta.body} : {}),
                ...(meta.form !== undefined ? {requestForm: redact(meta.form)} : {}),
                responseBody: res.body,
            };
            await addMsg({message: payload});
        } catch {
            // Logging must never fail a test (e.g., no test context in globalSetup).
        }
    }
}

export const httpClient = new HttpClient(env.BASE_URL);
