import { GraphQLError } from "graphql"

export const ErrorFormatter = (error: GraphQLError): GraphQLError => {
    return error;
}