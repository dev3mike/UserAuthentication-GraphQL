import { Length, IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";
import { isEmailAlreadyExist } from "./isEmailAlreadyExist";
import PasswordMixin from '../../mixins/PasswordMixin';

@InputType()
export class RegisterInput extends PasswordMixin(class { }) {
    @Field()
    @Length(1, 255)
    firstName: string;

    @Field()
    @Length(1, 255)
    lastName: string;

    @Field()
    @IsEmail()
    @isEmailAlreadyExist()
    email: string;

}