import { Resolver, Query, Ctx, UseMiddleware } from 'type-graphql';
import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';
import { isAuth } from '../../middleware/isAuth';

@Resolver()
export class MyInfoResolver {

    @UseMiddleware(isAuth)
    @Query(() => Boolean)
    async isAuthenticated() {
        return true;
    }

    // Sample Query to Prevent Error
    @Query(() => User, { nullable: true })
    async myinfo(
        @Ctx() context: MyContext
    ): Promise<User | undefined> {
        if (!context.req.session!.userId) {
            return undefined;
        }

        return User.findOne(context.req.session!.userId);
    }


}
