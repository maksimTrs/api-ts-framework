import type {Test} from 'supertest';
import {httpClient} from '@helpers/httpClient';
import type {BrandRequestBody} from '@models/brand';

// swagger -> https://www.practice-react.sdetunicorns.com/test/api-docs/
// All /brands endpoints are public (no auth).
export class BrandClient {
    get(): Test {
        return httpClient.get('/brands');
    }

    getById(brandId: string): Test {
        return httpClient.get(`/brands/${brandId}`);
    }

    post<T = BrandRequestBody>(body: T): Test {
        return httpClient.post('/brands', body);
    }

    put<T = BrandRequestBody>(brandId: string, body: T): Test {
        return httpClient.put(`/brands/${brandId}`, body);
    }

    delete(brandId: string): Test {
        return httpClient.delete(`/brands/${brandId}`);
    }
}
