import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class LoginResolver {

    @Mutation(() => User, { nullable: true })
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() context: MyContext,
    ): Promise<User | null> {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return null;
        }

        // Validate Password
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return null;
        }

        // Check Email Confirmation
        if (!user.confirmed) {
            return null;
        }

        // Set Session
        context.req.session!.userId = user.id;

        return user;
    }

}
