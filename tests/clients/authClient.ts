import type {Test} from 'supertest';
import {env} from '@helpers/envConfig';
import {httpClient} from '@helpers/httpClient';

// swagger -> https://www.practice-react.sdetunicorns.com/test/api-docs/
export class AuthClient {
    login(): Test {
        return httpClient.postForm('/admin/login', {
            email: env.EMAIL,
            password: env.PASSWORD,
        });
    }
}
