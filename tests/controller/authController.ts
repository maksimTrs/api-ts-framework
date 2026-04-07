import supertest, {Test} from 'supertest';
import {env} from '@helpers/envConfig';

// swagger -> https://www.practice-react.sdetunicorns.com/test/api-docs/
export class AuthController {
    private readonly request = supertest(env.BASE_URL);

    login(): Test {
        return this.request
            .post('/admin/login')
            .type('form')
            .send({email: env.EMAIL, password: env.PASSWORD});
    }
}
