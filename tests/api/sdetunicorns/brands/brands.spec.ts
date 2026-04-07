import {faker} from '@faker-js/faker';
import {BrandClient} from '@clients/brandClient';
import {createBrandPayload} from '@data/brandFactory';
import {BrandErrorResponse, BrandListItem, BrandResponse} from '@models/brand';

describe('API testing: brands endpoints', () => {
    const brandClient = new BrandClient();
    let brandId: string;
    const createdBrandIds: string[] = [];

    const brandPayload = createBrandPayload();

    // Shared brand for GET/PUT/DELETE tests. Tests run sequentially within a file
    // and depend on order: GET reads original, PUT modifies, DELETE removes last.
    // TODO: independent AAA solution, but now it is a test API, skip it
    beforeAll(async () => {
        const response = await brandClient.post(brandPayload)
            .expect(200);

        const body = response.body as BrandResponse;
        expect(body._id).toBeTruthy();
        brandId = body._id;
        createdBrandIds.push(brandId);
    });

    afterAll(async () => {
        for (const id of createdBrandIds) {
            await brandClient.delete(id);
        }
    });

    it('GET /brands', async () => {
        const response = await brandClient.get()
            .expect(200);

        const body = response.body as BrandListItem[];
        expect(body.length).toBeGreaterThan(1);
    });

    it('GET /brands/{id}', async () => {
        const response = await brandClient.getById(brandId)
            .expect(200);

        const body = response.body as BrandResponse;
        expect(body._id).toBe(brandId);
        expect(body.name).toBe(brandPayload.name);
        expect(body.description).toBe(brandPayload.description);
    });

    it('POST /brands', async () => {
        const postBody = createBrandPayload();

        const response = await brandClient.post(postBody)
            .expect(200);

        const body = response.body as BrandResponse;
        createdBrandIds.push(body._id);
        expect(body.name).toBe(postBody.name);
        expect(body.description).toBe(postBody.description);
        expect(body.__v).toBe(0);
    });

    it('PUT /brands/{id}', async () => {
        const putBody = createBrandPayload();

        const response = await brandClient.put(brandId, putBody)
            .expect(200);

        const body = response.body as BrandResponse;
        expect(body._id).toBe(brandId);
        expect(body.updatedAt).toBeTruthy();
        expect(body.name).toBe(putBody.name);
        expect(body.description).toBe(putBody.description);
    });

    it('DELETE /brands/{id}', async () => {
        const response = await brandClient.delete(brandId)
            .expect(200);

        expect(response.body).toBe(null);
        expect(response.headers['content-type']).toContain('application/json');
    });
});

describe('POST /brands — negative cases', () => {
    const brandClient = new BrandClient();

    it('should return 422 when body is empty', async () => {
        const response = await brandClient.post({})
            .expect(422);

        const body = response.body as BrandErrorResponse;
        expect(body).toEqual({error: 'Name is required'});
    });

    it('should return 422 when name is missing', async () => {
        const response = await brandClient.post({description: faker.lorem.slug(3)})
            .expect(422);

        const body = response.body as BrandErrorResponse;
        expect(body).toEqual({error: 'Name is required'});
    });

    it('should return 422 when name is empty string', async () => {
        const response = await brandClient.post({name: ''})
            .expect(422);

        const body = response.body as BrandErrorResponse;
        expect(body).toEqual({error: 'Name is required'});
    });

    it('should return 422 when name is shorter than 2 characters', async () => {
        const response = await brandClient.post({name: 'A'})
            .expect(422);

        const body = response.body as BrandErrorResponse;
        expect(body).toEqual({error: 'Brand name is too short'});
    });

    it.each([
        {type: 'number', value: 12345},
        {type: 'boolean', value: true},
    ])('should return 422 when name is $type', async ({value}) => {
        const response = await brandClient.postRaw({name: value})
            .expect(422);

        const body = response.body as BrandErrorResponse;
        expect(body).toEqual({error: 'Brand name must be a string'});
    });
});