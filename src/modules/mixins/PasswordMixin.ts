import { ClassType, InputType, Field } from "type-graphql";
import { MinLength } from "class-validator";

export default function PasswordMixin<TClassType extends ClassType>(BaseClass: TClassType) {

    @InputType({ isAbstract: true })
    class PasswordInput extends BaseClass {
        @MinLength(5)
        @Field()
        password!: string;
    }
    return PasswordInput;

}