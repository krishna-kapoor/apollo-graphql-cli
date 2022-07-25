export const __prod__ = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT;
export const DEV_CORS_PATHS = [process.env.DEV_CORS_PATH, "https://studio.apollographql.com"];
export const PROD_CORS_PATH = process.env.PROD_CORS_PATH;
export const GRAPHQL_PATH = process.env.GRAPHQL_PATH;

export function getServedUrl(graphqlPath) {
    if (__prod__) {
        return `${process.env.SERVER_URL}${graphqlPath} on port ${PORT}`;
    }

    return `http://localhost:${PORT}${graphqlPath}`;
}
