import { ApolloServerPluginLandingPageDisabled } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import chalk from "chalk";
import "dotenv/config";
import express from "express";
import path from "path";
import {
    DEV_CORS_PATHS,
    getServedUrl,
    GRAPHQL_PATH,
    PORT,
    PROD_CORS_PATH,
    __prod__,
} from "./constants";
import { getContext } from "./ctx";
import schema from "./schema";

export default async function main() {
    console.clear();

    const app = express();

    app.use("/public", express.static(path.join(process.cwd(), "public")));

    app.get("/", (_req, res, next) => {
        if (__prod__) {
            res.sendFile(path.join(process.cwd(), "public", "index.html"));
        } else next();
    });

    const server = new ApolloServer({
        schema,
        context: getContext,
        plugins: __prod__ ? [ApolloServerPluginLandingPageDisabled()] : undefined,
        cache: "bounded",
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: GRAPHQL_PATH,
        cors: {
            origin: !__prod__ ? DEV_CORS_PATHS : PROD_CORS_PATH,
            credentials: true,
        },
    });

    app.listen(PORT, () =>
        console.log(
            chalk.greenBright("🚀 Server listening on ") +
                chalk.greenBright.underline(`${getServedUrl(server.graphqlPath)}`)
        )
    );
}
