import {CategoryClient} from '@clients/categoryClient';
import {AuthClient} from '@clients/authClient';
import {CategoryErrorResponse, CategoryListItem, CategoryResponse} from '@models/category';
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

describe('API testing: categories endpoints', () => {
    let authCategoryClient: CategoryClient;
    let categoryId: string;
    const createdCategoryIds: string[] = [];
    const categoryPayload = createCategoryPayload();

    beforeAll(async () => {
        const authClient = new AuthClient();
        const loginResponse = await authClient.login().expect(200);
        const loginBody = loginResponse.body as LoginResponse;
        authCategoryClient = new CategoryClient(loginBody.token);

        const response = await authCategoryClient
            .post(categoryPayload)
            .expect(200);

        const body = response.body as CategoryResponse;
        expect(body._id).toEqual(expect.any(String));

        categoryId = body._id;
    });

    afterAll(async () => {
        for (const id of createdCategoryIds) {
            await authCategoryClient
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

        const response = await authCategoryClient
            .post(postBody)
            .expect(200);

        const body = response.body as CategoryResponse;
        createdCategoryIds.push(body._id);

        expect(body.name).toBe(postBody.name);
        expect(body.__v).toBe(0);
    });

    it('should update an existing category', async () => {
        const putBody = createCategoryPayload();

        const response = await authCategoryClient
            .put(categoryId, putBody)
            .expect(200);

        const body = response.body as CategoryResponse;

        expect(body._id).toBe(categoryId);
        expect(body.name).toBe(putBody.name);
    });

    // Reuses categoryId from beforeAll to minimize API calls against external test server
    it('should delete a category', async () => {
        const response = await authCategoryClient
            .delete(categoryId)
            .expect(200);

        const body = response.body as CategoryResponse;

        expect(body._id).toBe(categoryId);
        expect(body.name).toEqual(expect.any(String));
    });
});

describe('POST /categories — negative cases', () => {
    let authCategoryClient: CategoryClient;

    beforeAll(async () => {
        const authClient = new AuthClient();
        const response = await authClient.login().expect(200);
        const loginBody = response.body as LoginResponse;
        authCategoryClient = new CategoryClient(loginBody.token);
    });

    it('should return 422 when body is empty', async () => {
        const response = await authCategoryClient
            .postPartial({})
            .expect(422);

        const body = response.body as CategoryErrorResponse;

        expect(body.error).toBe('Name is required');
    });

    it('should return 422 when name is empty string', async () => {
        const response = await authCategoryClient
            .postPartial({name: ''})
            .expect(422);

        const body = response.body as CategoryErrorResponse;

        expect(body.error).toBe('Name is required');
    });

    it('should return 422 when name is shorter than 2 characters', async () => {
        const response = await authCategoryClient
            .postPartial({name: 'A'})
            .expect(422);

        const body = response.body as CategoryErrorResponse;

        expect(body.error).toBe('Brand name is too short');
    });

    it('should return 422 when name is boolean', async () => {
        const response = await authCategoryClient
            .postRaw({name: true})
            .expect(422);

        const body = response.body as CategoryErrorResponse;

        expect(body.error).toBe('Brand name must be a string');
    });
});
