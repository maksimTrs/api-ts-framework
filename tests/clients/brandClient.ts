import supertest, {Test} from 'supertest';
import {env} from '@helpers/envConfig';
import {BrandRequestBody, BrandRequestBodyPartial} from '@models/brand';

// swagger -> https://www.practice-react.sdetunicorns.com/test/api-docs/
export class BrandClient {
    private readonly request = supertest(env.BASE_URL);

    get(): Test {
        return this.request
            .get('/brands');
    }

    getById(brandId: string): Test {
        return this.request
            .get(`/brands/${brandId}`);
    }

    post(body: BrandRequestBody): Test {
        return this.request
            .post('/brands')
            .send(body);
    }

    postPartial(body: BrandRequestBodyPartial): Test {
        return this.request
            .post('/brands')
            .send(body);
    }

    postRaw(body: Record<string, unknown>): Test {
        return this.request
            .post('/brands')
            .send(body);
    }

    put(brandId: string, body: BrandRequestBody): Test {
        return this.request
            .put(`/brands/${brandId}`)
            .send(body);
    }

    putPartial(brandId: string, body: BrandRequestBodyPartial): Test {
        return this.request
            .put(`/brands/${brandId}`)
            .send(body);
    }

    putRaw(brandId: string, body: Record<string, unknown>): Test {
        return this.request
            .put(`/brands/${brandId}`)
            .send(body);
    }

    delete(brandId: string): Test {
        return this.request
            .delete(`/brands/${brandId}`);
    }

}
