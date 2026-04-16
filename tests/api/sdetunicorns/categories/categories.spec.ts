import {CategoryClient} from '@clients/categoryClient';
import {CategoryErrorResponse, CategoryListItem, CategoryRequestBody, CategoryResponse} from '@models/category';
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

describe('API testing: categories endpoints', () => {
    let categoryId: string;
    const createdCategoryIds: string[] = [];
    const categoryPayload = createCategoryPayload();

    beforeAll(async () => {
        const response = await categoryClient
            .post(categoryPayload)
            .expect(200);

        const body = response.body as CategoryResponse;
        expect(body._id).toEqual(expect.any(String));

        categoryId = body._id;
    });

    afterAll(async () => {
        for (const id of createdCategoryIds) {
            await categoryClient
                .delete(id)
                .expect(200);
        }
    });

    it('should return category by id', async () => {
        const response = await categoryClient
            .getById(categoryId)
            .expect(200);

        const body = response.body as CategoryResponse;

        expect(body._id).toBe(categoryId);
        expect(body.name).toBe(categoryPayload.name);
    });

    it('should create a new category', async () => {
        const postBody = createCategoryPayload();

        const response = await categoryClient
            .post(postBody)
            .expect(200);

        const body = response.body as CategoryResponse;
        createdCategoryIds.push(body._id);

        expect(body.name).toBe(postBody.name);
        expect(body.__v).toBe(0);
    });

    it('should update an existing category', async () => {
        const putBody = createCategoryPayload();

        const response = await categoryClient
            .put(categoryId, putBody)
            .expect(200);

        const body = response.body as CategoryResponse;

        expect(body._id).toBe(categoryId);
        expect(body.name).toBe(putBody.name);
    });

    // Reuses categoryId from beforeAll to minimize API calls against external test server
    it('should delete a category', async () => {
        const response = await categoryClient
            .delete(categoryId)
            .expect(200);

        const body = response.body as CategoryResponse;

        expect(body._id).toBe(categoryId);
        expect(body.name).toEqual(expect.any(String));
    });
});

describe('POST /categories — negative cases', () => {
    it('should return 422 when body is empty', async () => {
        const response = await categoryClient
            .post<Partial<CategoryRequestBody>>({})
            .expect(422);

        const body = response.body as CategoryErrorResponse;

        expect(body.error).toBe('Name is required');
    });

    it('should return 422 when name is empty string', async () => {
        const response = await categoryClient
            .post<Partial<CategoryRequestBody>>({name: ''})
            .expect(422);

        const body = response.body as CategoryErrorResponse;

        expect(body.error).toBe('Name is required');
    });

    it('should return 422 when name is shorter than 2 characters', async () => {
        const response = await categoryClient
            .post<Partial<CategoryRequestBody>>({name: 'A'})
            .expect(422);

        const body = response.body as CategoryErrorResponse;

        // API bug: error message says "Brand name" for the Category resource — upstream
        // inconsistency, not a test typo. Remove this comment once the API is fixed.
        expect(body.error).toBe('Brand name is too short');
    });

    it('should return 422 when name is boolean', async () => {
        const response = await categoryClient
            .post<Record<string, unknown>>({name: true})
            .expect(422);

        const body = response.body as CategoryErrorResponse;

        // API bug: error message says "Brand name" for the Category resource — upstream
        // inconsistency, not a test typo. Remove this comment once the API is fixed.
        expect(body.error).toBe('Brand name must be a string');
    });
});
