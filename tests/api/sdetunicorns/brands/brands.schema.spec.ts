import supertest from 'supertest';
import {faker} from '@faker-js/faker';

const request = supertest('https://www.practice-react.sdetunicorns.com/api/test');

describe('POST /brands — response schema', () => {
    it('should match the expected schema on 200', async () => {
        const response = await request
            .post('/brands')
            .send({
                name: faker.lorem.words(3),
                description: faker.lorem.slug(5),
            })
            .expect(200);

        expect(response.body).toStrictEqual({
            _id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            __v: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it('should match the expected schema on 422', async () => {
        const response = await request
            .post('/brands')
            .send({})
            .expect(422);

        expect(response.body).toStrictEqual({
            error: expect.any(String),
        });
    });
});
