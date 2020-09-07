import { Resolver, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/createConfirmationUrl';

@Resolver()
export class RegisterResolver {

    // @FieldResolver()
    // async name(@Root() parent: User) {
    //     return `${parent.firstName} ${parent.lastName}`;
    // }

    @Mutation(() => User)
    async register(
        @Arg('data') { email, firstName, lastName, password }: RegisterInput,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }).save();

        // Send Confirmation Email
        await sendEmail(email, await createConfirmationUrl(user.id));

        return user;
    }

}
