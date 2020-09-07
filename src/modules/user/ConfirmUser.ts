import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';

@Resolver()
export class ConfirmLoginResolver {

    @Mutation(() => Boolean)
    async confirmUser(
        @Arg('token') token: string,
    ): Promise<Boolean> {

        const userId = await redis.get(token);

        if (!userId) {
            return false;
        }
        // Confirmation Successfuly
        await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
        await redis.del(token);

        return true;
    }

}
