import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { ChangePasswordInput } from './changePassword/changePasswordInput';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';
import bcrypt from 'bcryptjs';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class ChangePasswordResolver {

    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg('data') { token, password }: ChangePasswordInput,
        @Ctx() context: MyContext,
    ): Promise<User | null> {

        const userId = await redis.get(forgotPasswordPrefix + token);
        if (!userId) return null;

        const user = await User.findOne(userId);
        if (!user) return null;

        redis.del(forgotPasswordPrefix + token);

        user.password = await bcrypt.hash(password, 12);
        user.confirmed = true;
        await user.save();

        // Auto Login After Confirmation
        context.req.session!.userId = user.id;

        return user;
    }

}
