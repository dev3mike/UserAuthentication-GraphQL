import { User } from '../../../entity/User';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class isEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
    validate(email: string, _args: ValidationArguments) {
        return User.findOne({ where: { email } }).then(user => {
            if (user) return false;
            return true;
        });
    }

    public defaultMessage(_args: ValidationArguments) {
        return `Email is already is use.`;
    }
}

export function isEmailAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: isEmailAlreadyExistConstraint,
        });
    };
}