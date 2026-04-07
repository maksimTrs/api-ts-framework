import {CategoryClient} from '@clients/categoryClient';
import {AuthClient} from '@clients/authClient';
import {categorySchemas} from '@schemas/categorySchemas';
import {createCategoryPayload} from '@data/categoryFactory';
import {LoginResponse} from '@models/auth';
import {CategoryResponse} from '@models/category';

let categoryClient: CategoryClient;

beforeAll(async () => {
    const authClient = new AuthClient();
    const response = await authClient.login().expect(200);
    const body = response.body as LoginResponse;
    categoryClient = new CategoryClient(body.token);
});

describe('[smoke] GET /categories — response schema', () => {
    it('should match the expected schema on 200', async () => {
        const response = await categoryClient.get()
            .expect(200);

        expect(response.body).toEqual(
            expect.arrayOf(categorySchemas.listItem)
        );
    });
});

describe('POST /categories — response schema', () => {
    const createdCategoryIds: string[] = [];

    afterAll(async () => {
        for (const id of createdCategoryIds) {
            await categoryClient.delete(id);
        }
    });

    it('should match the expected schema on 200', async () => {
        const response = await categoryClient.post(createCategoryPayload())
            .expect(200);

        createdCategoryIds.push((response.body as CategoryResponse)._id);
        expect(response.body).toStrictEqual(categorySchemas.full);
    });
});

describe('DELETE /categories/{id} — response schema', () => {
    let categoryId: string;

    beforeAll(async () => {
        const response = await categoryClient.post(createCategoryPayload())
            .expect(200);
        categoryId = (response.body as CategoryResponse)._id;
    });

    // DELETE test removes the category itself — no afterAll cleanup needed

    it('should match the expected schema on 200', async () => {
        const response = await categoryClient.delete(categoryId)
            .expect(200);

        expect(response.body).toStrictEqual(categorySchemas.full);
    });
});
