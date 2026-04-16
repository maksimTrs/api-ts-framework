import type {Test} from 'supertest';
import {env} from '@helpers/envConfig';
import {HttpClient, httpClient} from '@helpers/httpClient';
import type {CategoryRequestBody} from '@models/category';

// swagger -> https://www.practice-react.sdetunicorns.com/test/api-docs/
// GET is public; POST/PUT/DELETE require Bearer auth (token from env.AUTH_TOKEN).
export class CategoryClient {
    private _authedHttp?: HttpClient;

    // Built lazily so GET-only usage doesn't require AUTH_TOKEN.
    private get authedHttp(): HttpClient {
        return (this._authedHttp ??= httpClient.withToken(env.AUTH_TOKEN));
    }

    get(): Test {
        return httpClient.get('/categories');
    }

    getById(categoryId: string): Test {
        return httpClient.get(`/categories/${categoryId}`);
    }

    post<T = CategoryRequestBody>(body: T): Test {
        return this.authedHttp.post('/categories', body);
    }

    put<T = CategoryRequestBody>(categoryId: string, body: T): Test {
        return this.authedHttp.put(`/categories/${categoryId}`, body);
    }

    delete(categoryId: string): Test {
        return this.authedHttp.delete(`/categories/${categoryId}`);
    }
}
