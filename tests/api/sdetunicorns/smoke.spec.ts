import {BrandClient} from '@clients/brandClient';
import {CategoryClient} from '@clients/categoryClient';
import {BrandListItem} from '@models/brand';
import {CategoryListItem} from '@models/category';
import {brandSchemas} from '@schemas/brandSchemas';
import {categorySchemas} from '@schemas/categorySchemas';

// Smoke suite — GET-only tests, no data mutation.
// Validates that core read endpoints are alive and return expected structure.

const brandClient = new BrandClient();
const categoryClient = new CategoryClient();

describe('GET /brands', () => {
    it('should return a list of brands', async () => {
        const response = await brandClient.get()
            .expect(200);

        const body = response.body as BrandListItem[];
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

    it('should match the expected response schema', async () => {
        const response = await brandClient.get()
            .expect(200);

        expect(response.body).toEqual(
            expect.arrayOf(brandSchemas.listItem)
        );
    });
});

describe('GET /categories', () => {
    it('should return a list of categories', async () => {
        const response = await categoryClient.get()
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

    it('should match the expected response schema', async () => {
        const response = await categoryClient.get()
            .expect(200);

        expect(response.body).toEqual(
            expect.arrayOf(categorySchemas.listItem)
        );
    });
});
