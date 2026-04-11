import {faker} from '@faker-js/faker';
import {BrandClient} from '@clients/brandClient';
import {createBrandPayload} from '@data/brandFactory';
import {BrandErrorResponse, BrandListItem, BrandResponse} from '@models/brand';
import {brandSchemas} from '@schemas/brandSchemas';

const brandClient = new BrandClient();

describe('GET /brands', () => {
    it('should return a list of brands', async () => {
        const response = await brandClient
            .get()
            .expect(200);

        const body = response.body as BrandListItem[];

        expect(body.length).toBeGreaterThan(1);
    });

    it('should match the expected response schema', async () => {
        const response = await brandClient
            .get()
            .expect(200);

        expect(response.body).toEqual(
            expect.arrayOf(brandSchemas.listItem)
        );
    });
});

describe('API testing: brands endpoints', () => {
    let brandId: string;
    const createdBrandIds: string[] = [];
    const brandPayload = createBrandPayload();

    beforeAll(async () => {
        const response = await brandClient
            .post(brandPayload)
            .expect(200);

        const body = response.body as BrandResponse;
        expect(body._id).toBeTruthy();

        brandId = body._id;
    });

    afterAll(async () => {
        for (const id of createdBrandIds) {
            await brandClient
                .delete(id)
                .expect(200);
        }
    });

    it('GET /brands/{id}', async () => {
        const response = await brandClient
            .getById(brandId)
            .expect(200);

        const body = response.body as BrandResponse;

        expect(body._id).toBe(brandId);
        expect(body.name).toBe(brandPayload.name);
        expect(body.description).toBe(brandPayload.description);
    });

    it('POST /brands', async () => {
        const postBody = createBrandPayload();

        const response = await brandClient
            .post(postBody)
            .expect(200);

        const body = response.body as BrandResponse;
        createdBrandIds.push(body._id);

        expect(body.name).toBe(postBody.name);
        expect(body.description).toBe(postBody.description);
        expect(body.__v).toBe(0);
    });

    it('PUT /brands/{id}', async () => {
        const putBody = createBrandPayload();

        const response = await brandClient
            .put(brandId, putBody)
            .expect(200);

        const body = response.body as BrandResponse;

        expect(body._id).toBe(brandId);
        expect(body.updatedAt).toBeTruthy();
        expect(body.name).toBe(putBody.name);
        expect(body.description).toBe(putBody.description);
    });

    it('DELETE /brands/{id}', async () => {
        const response = await brandClient
            .delete(brandId)
            .expect(200);

        expect(response.body).toBe(null);
        expect(response.headers['content-type']).toContain('application/json');
    });
});

describe('POST /brands — negative cases', () => {

    it('should return 422 when body is empty', async () => {
        const response = await brandClient
            .postPartial({})
            .expect(422);

        const body = response.body as BrandErrorResponse;

        expect(body.error).toBe('Name is required');
    });

    it('should return 422 when name is missing', async () => {
        const response = await brandClient
            .postPartial({description: faker.lorem.slug(3)})
            .expect(422);

        const body = response.body as BrandErrorResponse;

        expect(body.error).toBe('Name is required');
    });

    it('should return 422 when name is empty string', async () => {
        const response = await brandClient
            .postPartial({name: ''})
            .expect(422);

        const body = response.body as BrandErrorResponse;

        expect(body.error).toBe('Name is required');
    });

    it('should return 422 when name is shorter than 2 characters', async () => {
        const response = await brandClient
            .postPartial({name: 'A'})
            .expect(422);

        const body = response.body as BrandErrorResponse;

        expect(body.error).toBe('Brand name is too short');
    });

    it.each([
        {type: 'number', value: 12345},
        {type: 'boolean', value: true},
    ])('should return 422 when name is $type', async ({value}) => {
        const response = await brandClient
            .postRaw({name: value})
            .expect(422);

        const body = response.body as BrandErrorResponse;

        expect(body.error).toEqual('Brand name must be a string');
    });
});