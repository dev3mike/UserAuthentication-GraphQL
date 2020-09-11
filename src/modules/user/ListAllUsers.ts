import { Resolver, Query } from 'type-graphql';
import { User } from '../../entity/User';

@Resolver()
export class ListAllUsersResolver {

    @Query(() => [User])
    async listAllUsers() {
        return User.createQueryBuilder().orderBy('id', 'DESC').getMany();
    }

}
