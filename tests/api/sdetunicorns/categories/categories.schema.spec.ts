import {CategoryClient} from '@clients/categoryClient';
import {categorySchemas} from '@schemas/categorySchemas';
import {createCategoryPayload} from '@data/categoryFactory';
import {CategoryRequestBody, CategoryResponse} from '@models/category';

const categoryClient = new CategoryClient();

describe('POST /categories — response schema', () => {
    const createdCategoryIds: string[] = [];

    afterAll(async () => {
        for (const id of createdCategoryIds) {
            await categoryClient
                .delete(id)
                .expect(200);
        }
    });

    it('should match the expected schema on 200', async () => {
        const response = await categoryClient
            .post(createCategoryPayload())
            .expect(200);

        createdCategoryIds.push((response.body as CategoryResponse)._id);

        expect(response.body).toStrictEqual(categorySchemas.full);
    });

    it('should match the expected schema on 422', async () => {
        const response = await categoryClient
            .post<Partial<CategoryRequestBody>>({})
            .expect(422);

        expect(response.body).toStrictEqual(categorySchemas.error);
    });
});

describe('DELETE /categories/{id} — response schema', () => {
    let categoryId: string;

    beforeAll(async () => {
        const response = await categoryClient
            .post(createCategoryPayload())
            .expect(200);

        categoryId = (response.body as CategoryResponse)._id;
        expect(categoryId).toEqual(expect.any(String));
    });

    // DELETE test removes the category itself — no afterAll cleanup needed
    it('should match the expected schema on 200', async () => {
        const response = await categoryClient
            .delete(categoryId)
            .expect(200);

        expect(response.body).toStrictEqual(categorySchemas.full);
    });
});
