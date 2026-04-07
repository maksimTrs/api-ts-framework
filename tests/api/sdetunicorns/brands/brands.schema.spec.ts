import {BrandClient} from '@clients/brandClient';
import {brandSchemas} from '@schemas/brandSchemas';
import {createBrandPayload} from '@data/brandFactory';
import {BrandResponse} from '@models/brand';

const brandClient = new BrandClient();

describe('GET /brands/{id} — response schema', () => {
    let brandId: string;

    beforeAll(async () => {
        const response = await brandClient.post(createBrandPayload())
            .expect(200);
        brandId = (response.body as BrandResponse)._id;
    });

    afterAll(async () => {
        await brandClient.delete(brandId);
    });

    it('should match the expected schema on 200', async () => {
        const response = await brandClient.getById(brandId)
            .expect(200);

        expect(response.body).toStrictEqual(brandSchemas.full);
    });
});

describe('POST /brands — response schema', () => {
    const createdBrandIds: string[] = [];

    afterAll(async () => {
        for (const id of createdBrandIds) {
            await brandClient.delete(id);
        }
    });

    it('should match the expected schema on 200', async () => {
        const response = await brandClient.post(createBrandPayload())
            .expect(200);

        createdBrandIds.push((response.body as BrandResponse)._id);
        expect(response.body).toStrictEqual(brandSchemas.full);
    });

    it('should match the expected schema on 422', async () => {
        const response = await brandClient.post({})
            .expect(422);

        expect(response.body).toStrictEqual(brandSchemas.error);
    });
});

describe('PUT /brands/{id} — response schema', () => {
    let brandId: string;

    beforeAll(async () => {
        const response = await brandClient.post(createBrandPayload())
            .expect(200);
        brandId = (response.body as BrandResponse)._id;
    });

    afterAll(async () => {
        await brandClient.delete(brandId);
    });

    it('should match the expected schema on 200', async () => {
        const response = await brandClient.put(brandId, createBrandPayload())
            .expect(200);

        expect(response.body).toStrictEqual(brandSchemas.full);
    });
});

describe('DELETE /brands/{id} — response schema', () => {
    let brandId: string;

    beforeAll(async () => {
        const response = await brandClient.post(createBrandPayload())
            .expect(200);
        brandId = (response.body as BrandResponse)._id;
    });

    // DELETE test removes the brand itself — no afterAll cleanup needed

    it('should return null body on 200', async () => {
        const response = await brandClient.delete(brandId)
            .expect(200);

        expect(response.body).toBe(null);
    });
});
