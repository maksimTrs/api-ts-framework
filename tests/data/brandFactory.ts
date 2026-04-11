import {faker} from '@faker-js/faker';
import {BrandRequestBody} from '@models/brand';

export function createBrandPayload(overrides?: Partial<BrandRequestBody>): BrandRequestBody {
    return {
        name: `Brand ${faker.string.alphanumeric(12)}`,
        description: faker.company.catchPhrase(),
        ...overrides,
    };
}
