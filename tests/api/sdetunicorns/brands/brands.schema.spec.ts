import {BrandController} from '@tests/controller/brandController';
import {brandSchemas} from '@schemas/brandSchemas';
import {createBrandPayload} from '@data/brandFactory';

const brandController = new BrandController();

describe('GET /brands — response schema', () => {
    it('should match the expected schema on 200', async () => {
        const response = await brandController.get()
            .expect(200);

        expect(response.body).toEqual(
            expect.arrayOf(brandSchemas.listItem)
        );
    });
});

describe('GET /brands/{id} — response schema', () => {
    let brandId: string;

    beforeAll(async () => {
        const response = await brandController.post(createBrandPayload())
            .expect(200);
        brandId = response.body._id;
    });

    it('should match the expected schema on 200', async () => {
        const response = await brandController.getById(brandId)
            .expect(200);

        expect(response.body).toStrictEqual(brandSchemas.full);
    });
});

describe('POST /brands — response schema', () => {
    it('should match the expected schema on 200', async () => {
        const response = await brandController.post(createBrandPayload())
            .expect(200);

        expect(response.body).toStrictEqual(brandSchemas.full);
    });

    it('should match the expected schema on 422', async () => {
        const response = await brandController.post({})
            .expect(422);

        expect(response.body).toStrictEqual(brandSchemas.error);
    });
});

describe('PUT /brands/{id} — response schema', () => {
    let brandId: string;

    beforeAll(async () => {
        const response = await brandController.post(createBrandPayload())
            .expect(200);
        brandId = response.body._id;
    });

    it('should match the expected schema on 200', async () => {
        const response = await brandController.put(brandId, createBrandPayload())
            .expect(200);

        expect(response.body).toStrictEqual(brandSchemas.full);
    });
});

describe('DELETE /brands/{id} — response schema', () => {
    let brandId: string;

    beforeAll(async () => {
        const response = await brandController.post(createBrandPayload())
            .expect(200);
        brandId = response.body._id;
    });

    it('should return null body on 200', async () => {
        const response = await brandController.delete(brandId)
            .expect(200);

        expect(response.body).toBe(null);
    });
});
