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

const myInfoQuery = `
    {
        myinfo {
            id,
            firstName,
            lastName,
            email,
            name,
        }
    }
`;


describe('My Info', () => {
    it('get user', async () => {

        // Create Demo User
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }).save();

        const response = await Gq({
            source: myInfoQuery,
            userId: user.id
        });

        expect(response).toMatchObject({
            data: {
                myinfo: {
                    id: `${user.id}`,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                }
            }
        });

    });
})
