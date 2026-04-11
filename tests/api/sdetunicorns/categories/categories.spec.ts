import {CategoryClient} from '@clients/categoryClient';
import {AuthClient} from '@clients/authClient';
import {CategoryListItem, CategoryResponse} from '@models/category';
import {LoginResponse} from '@models/auth';
import {createCategoryPayload} from '@data/categoryFactory';
import {categorySchemas} from '@schemas/categorySchemas';

const categoryClient = new CategoryClient();

describe('GET /categories', () => {
    it('should return a list of categories', async () => {
        const response = await categoryClient
            .get()
            .expect(200);

        const body = response.body as CategoryListItem[];
        expect(body.length).toBeGreaterThan(1);
    });

    it('should match the expected response schema', async () => {
        const response = await categoryClient
            .get()
            .expect(200);

        expect(response.body).toEqual(
            expect.arrayOf(categorySchemas.listItem)
        );
    });
});

describe('Categories', () => {
    let categoryClient: CategoryClient;
    const authClient = new AuthClient();
    const createdCategoryIds: string[] = [];

    beforeAll(async () => {
        const response = await authClient
            .login()
            .expect(200);

        const body = response.body as LoginResponse;
        categoryClient = new CategoryClient(body.token);
    });

    afterAll(async () => {
        for (const id of createdCategoryIds) {
            await categoryClient
                .delete(id)
                .expect(200);
        }
    });


    describe('Create Categories', () => {
        it('should create a new category', async () => {
            const body = createCategoryPayload();
            const response = await categoryClient
                .post(body);

            const created = response.body as CategoryResponse;
            createdCategoryIds.push(created._id);

            expect(response.statusCode).toEqual(200);
        });
    });


    describe('Delete Categories', () => {
        let categoryId: string;

        beforeAll(async () => {
            const body = createCategoryPayload();
            const response = await categoryClient
                .post(body)
                .expect(200);

            categoryId = (response.body as CategoryResponse)._id;
            expect(categoryId).toEqual(expect.any(String));
        });

        it('should delete a category', async () => {
            const response = await categoryClient
                .delete(categoryId)
                .expect(200);

            const body = response.body as CategoryResponse;

            expect(body._id).toBe(categoryId);
            expect(body.name).toEqual(expect.any(String));
        });
    });
});