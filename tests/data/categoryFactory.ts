import {CategoryRequestBody} from '@models/category';
import {faker} from '@faker-js/faker';

export function createCategoryPayload(overrides?: Partial<CategoryRequestBody>): CategoryRequestBody {
    return {
        name: `Category ${faker.string.alphanumeric(12)}`,
        ...overrides,
    };
}