import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';
import { ErrorFormatter } from './formatter/ErrorFormatter';
import session from 'express-session';
import { RedisClient } from "redis";
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import { LoginResolver } from './modules/user/Login';
import { MyInfoResolver } from './modules/user/MyInfo';


const main = async () => {

    await createConnection();

    const schema = await buildSchema({
        resolvers: [MyInfoResolver, RegisterResolver, LoginResolver],
        authChecker: (
            { context: { req } },
            _roles,
        ) => {
            return !!req.session.userId;
        }
    });

    const apolloServer = new ApolloServer({
        schema,
        formatError: ErrorFormatter,
        context: ({ req }: any) => ({ req })
    });

    const app = Express();

    const RedisStore = connectRedis(session);

    app.use(cors({
        credentials: true,
        origin: 'http://localhost:3000',
    }));

    const sessionOption: session.SessionOptions = {
        store: new RedisStore({
            client: (redis as unknown) as RedisClient,
        }),
        name: "qid",
        secret: "my_test_secrets",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        },
    };

    app.use(session(sessionOption));


    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("Server Started on http://localhost:4000/graphql");
    });

}

main();