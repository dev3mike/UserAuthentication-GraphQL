import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { createConnection } from 'typeorm';
import { ErrorFormatter } from './formatter/ErrorFormatter';
import session from 'express-session';
import { RedisClient } from "redis";
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import { createSchema } from './utils/createSchema';
import queryComplexity, {
    fieldExtensionsEstimator,
    simpleEstimator
} from 'graphql-query-complexity';

const main = async () => {

    await createConnection();

    const schema = await createSchema();

    const apolloServer = new ApolloServer({
        schema,
        formatError: ErrorFormatter,
        context: ({ req, res }: any) => ({ req, res }),
        validationRules: [
            queryComplexity({
                // The maximum allowed query complexity, queries above this threshold will be rejected
                maximumComplexity: 13,
                // The query variables. This is needed because the variables are not available
                // in the visitor of the graphql-js library
                variables: {},
                // Optional callback function to retrieve the determined query complexity
                // Will be invoked weather the query is rejected or not
                // This can be used for logging or to implement rate limiting
                onComplete: (complexity: number) => {
                    console.log("Query Complexity:", complexity);
                },
                estimators: [
                    // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql
                    fieldExtensionsEstimator(),
                    // This will assign each field a complexity of 1 if no other estimator
                    // returned a value. We can define the default value for field not explicitly annotated
                    simpleEstimator({
                        defaultComplexity: 1
                    })
                ]
            }) as any
        ]
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