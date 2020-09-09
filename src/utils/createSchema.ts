import { buildSchema } from 'type-graphql';

export const createSchema = () =>
    buildSchema({
        resolvers: [__dirname + "/../modules/*/*.ts"],
        authChecker: (
            { context: { req } },
            _roles,
        ) => {
            return !!req.session.userId;
        }
    });