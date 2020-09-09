import { testConn } from '../../../test-utils/testConn';
import { Connection } from 'typeorm';
import faker from 'faker';
import { Gq } from '../../../test-utils/Gq';
import { User } from '../../../entity/User';

jest.setTimeout(10000);

let conn: Connection;
beforeAll(async () => {
    conn = await testConn();
});


afterAll(async () => {
    await conn.close();
});

const registerMutation = `
    mutation Register($data: RegisterInput!){
    register(
        data: $data
    ){
        id,
        firstName,
        lastName,
        email,
        name,
    }
    }
`;

const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
}


describe('Register', () => {
    it('create user', async () => {
        const response = await Gq({
            source: registerMutation,
            variableValues: {
                data: user,
            }
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                }
            }
        });

        // Check User
        const dbUser = await User.findOne({ where: { email: user.email } });
        expect(dbUser).toBeDefined();
        expect(dbUser!.confirmed).toBeFalsy();
        expect(dbUser!.firstName).toBe(user.firstName);
    });
})
