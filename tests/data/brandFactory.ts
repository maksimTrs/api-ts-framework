import {faker} from '@faker-js/faker';
import {BrandRequestBody} from '@models/brand';

export function createBrandPayload(overrides?: Partial<BrandRequestBody>): Required<BrandRequestBody> {
    return {
        name: `${faker.company.name()} ${faker.string.alphanumeric(5)}`,
        description: faker.company.catchPhrase(),
        ...overrides,
    };
}
