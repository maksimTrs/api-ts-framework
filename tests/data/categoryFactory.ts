import {CategoryRequestBody} from '@models/category';
import {faker} from '@faker-js/faker';

export function createCategoryPayload(overrides?: Partial<CategoryRequestBody>): Required<CategoryRequestBody> {
    return {
        name: `${faker.company.name()} ${faker.string.alphanumeric(3)}`,
        ...overrides,
    };
}