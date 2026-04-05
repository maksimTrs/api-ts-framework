import supertest from 'supertest';
import {faker} from '@faker-js/faker';

// swagger -> https://www.practice-react.sdetunicorns.com/test/api-docs/
const request = supertest('https://www.practice-react.sdetunicorns.com/api/test');

describe('API testing: brands endpoints', () => {
    let brandId: string;

    const brandPayload = {
        name: faker.book.title(),
        description: faker.lorem.slug(),
    };

    // Shared brand for GET/PUT/DELETE tests. Tests run sequentially within a file
    // and depend on order: GET reads original, PUT modifies, DELETE removes last.
    beforeAll(async () => {
        const response = await request
            .post('/brands')
            .send(brandPayload)
            .expect(200);

        expect(response.body._id).toBeTruthy();
        brandId = response.body._id;
    });

    it('GET /brands', async () => {
        const response = await request
            .get('/brands')
            .expect(200);

        expect(response.body.length).toBeGreaterThan(1);
        expect(response.body).toEqual(
            expect.arrayOf({
                _id: expect.any(String),
                name: expect.any(String),
            })
        );

        for (const brand of response.body) {
            expect(Object.keys(brand)).toHaveLength(2);
        }
    });

    it('GET /brands/{id}', async () => {
        const response = await request
            .get(`/brands/${brandId}`)
            .expect(200);

        expect(response.body._id).toBe(brandId);
        expect(response.body.name).toBe(brandPayload.name);
        expect(response.body.description).toBe(brandPayload.description);
    });

    it('POST /brands', async () => {
        const postRequestBody = {
            name: faker.lorem.words(3),
            description: faker.lorem.slug(5),
        };

        const response = await request
            .post('/brands')
            .set('Accept', 'application/json')
            .send(postRequestBody)
            .expect(200);

        expect(response.body).toMatchObject({
            name: postRequestBody.name,
            description: postRequestBody.description,
            _id: expect.any(String),
            __v: 0,
        });
    });

    it('PUT /brands/{id}', async () => {
        const putRequestBody = {
            name: faker.lorem.word(5),
            description: faker.lorem.slug(7),
        };

        const response = await request
            .put(`/brands/${brandId}`)
            .send(putRequestBody)
            .expect(200);

        expect(response.body._id).toBe(brandId);
        expect(response.body.updatedAt).toBeTruthy();
        expect(response.body.name).toBe(putRequestBody.name);
        expect(response.body.description).toBe(putRequestBody.description);
    });

    it('DELETE /brands/{id}', async () => {
        const response = await request
            .delete(`/brands/${brandId}`)
            .expect(200);

        expect(response.body).toBe(null);
        expect(response.headers['content-type']).toContain('application/json');
    });
});

describe('POST /brands — negative cases', () => {
    it('should return 422 when body is empty', async () => {
        const response = await request
            .post('/brands')
            .send({})
            .expect(422);

        expect(response.body).toEqual({error: 'Name is required'});
    });

    it('should return 422 when name is missing', async () => {
        const response = await request
            .post('/brands')
            .send({description: faker.lorem.slug(3)})
            .expect(422);

        expect(response.body).toEqual({error: 'Name is required'});
    });

    it('should return 422 when name is empty string', async () => {
        const response = await request
            .post('/brands')
            .send({name: '', description: faker.lorem.slug(3)})
            .expect(422);

        expect(response.body).toEqual({error: 'Name is required'});
    });

    it('should return 422 when name is shorter than 2 characters', async () => {
        const response = await request
            .post('/brands')
            .send({name: 'A', description: faker.lorem.slug(3)})
            .expect(422);

        expect(response.body).toEqual({error: 'Brand name is too short'});
    });

    it.each([
        {type: 'number', value: 12345},
        {type: 'boolean', value: true},
    ])('should return 422 when name is $type', async ({value}) => {
        const response = await request
            .post('/brands')
            .send({name: value, description: faker.lorem.slug(3)})
            .expect(422);

        expect(response.body).toEqual({error: 'Brand name must be a string'});
    });
});