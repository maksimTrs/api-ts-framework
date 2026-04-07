import {CategoryController} from '@tests/controller/categoryController';
import {AuthController} from '@tests/controller/authController';
import {CategoryListItem, CategoryResponse} from '@models/category';
import {LoginResponse} from '@models/auth';
import {createCategoryPayload} from '@data/categoryFactory';

describe('Categories', () => {
    let categoryController: CategoryController;
    const authController = new AuthController();

    beforeAll(async () => {
        const response = await authController
            .login()
            .expect(200);
        const body = response.body as LoginResponse;
        categoryController = new CategoryController(body.token);
    });


    it('GET /categories', async () => {
        const response = await categoryController
            .get()
            .expect(200);

        const body = response.body as CategoryListItem[];

        expect(body.length).toBeGreaterThan(1);
        expect(body).toEqual(
            expect.arrayOf(
                {
                    _id: expect.any(String),
                    name: expect.any(String),
                }
            )
        );
    });


    describe('Create Categories', () => {
        it('POST /categories', async () => {
            const body = createCategoryPayload();
            const response = await categoryController
                .post(body);

            expect(response.statusCode).toEqual(200);
        });
    });


    describe('Delete Categories', () => {
        let categoryId: string;

        beforeAll(async () => {
            const body = createCategoryPayload();
            const response = await categoryController
                .post(body)
                .expect(200);
            categoryId = (response.body as CategoryResponse)._id;
        });

        it('DELETE /categories/:id', async () => {
            const response = await categoryController
                .delete(categoryId)
                .expect(200);

            const body = response.body as CategoryResponse;

            expect(body._id).toBe(categoryId);
            expect(body.name).toEqual(expect.any(String));
        });
    });
});