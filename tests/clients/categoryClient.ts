import supertest, {Test} from 'supertest';
import {env} from '@helpers/envConfig';
import {CategoryRequestBody} from '@models/category';

// swagger -> https://www.practice-react.sdetunicorns.com/test/api-docs/
export class CategoryClient {
    private readonly request = supertest(env.BASE_URL);


    constructor(private readonly token?: string) {
    }

    private withAuth(req: Test): Test {
        return this.token
            ? req.set('Authorization', `Bearer ${this.token}`)
            : req;
    }

    get(): Test {
        return this.request
            .get('/categories');
    }

    getById(categoryId: string): Test {
        return this.request
            .get(`/categories/${categoryId}`);
    }

    post(body: CategoryRequestBody): Test {
        return this.withAuth(this.request.post('/categories').send(body));
    }

    postRaw(body: Record<string, unknown>): Test {
        return this.withAuth(this.request.post('/categories').send(body));
    }

    put(categoryId: string, body: CategoryRequestBody): Test {
        return this.withAuth(this.request.put(`/categories/${categoryId}`).send(body));
    }

    putRaw(categoryId: string, body: Record<string, unknown>): Test {
        return this.withAuth(this.request.put(`/categories/${categoryId}`).send(body));
    }

    delete(categoryId: string): Test {
        return this.withAuth(this.request.delete(`/categories/${categoryId}`));
    }

}
