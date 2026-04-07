import supertest, {Test} from 'supertest';
import {env} from '@helpers/envConfig';
import {CategoryRequestBody} from '@models/category';

// swagger -> https://www.practice-react.sdetunicorns.com/test/api-docs/
export class CategoryClient {
    private readonly request = supertest(env.BASE_URL);


    constructor(private readonly token?: string) {
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
        const req = this.request.post('/categories').send(body);
        return this.token
            ? req.set('Authorization', `Bearer ${this.token}`)
            : req;
    }

    postRaw(body: Record<string, unknown>): Test {
        const req = this.request.post('/categories').send(body);
        return this.token
            ? req.set('Authorization', `Bearer ${this.token}`)
            : req;
    }

    put(categoryId: string, body: CategoryRequestBody): Test {
        const req = this.request.put(`/categories/${categoryId}`).send(body);
        return this.token
            ? req.set('Authorization', `Bearer ${this.token}`)
            : req;
    }

    putRaw(categoryId: string, body: Record<string, unknown>): Test {
        const req = this.request.put(`/categories/${categoryId}`).send(body);
        return this.token
            ? req.set('Authorization', `Bearer ${this.token}`)
            : req;
    }

    delete(categoryId: string): Test {
        const req = this.request.delete(`/categories/${categoryId}`);
        return this.token
            ? req.set('Authorization', `Bearer ${this.token}`)
            : req;
    }

}
