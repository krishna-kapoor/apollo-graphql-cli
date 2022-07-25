import fs from "fs";
import path from "path";

function envKeyValue(key, value) {
    if (typeof value === "string") {
        return `${key}="${value}"\n`;
    }

    return `${key}=${value}\n`;
}

export async function writeEnvFile(options) {
    const PORT = envKeyValue("PORT", options.devPort);
    const DEPLOYED_SERVER_URL = envKeyValue("DEPLOYED_SERVER_URL", options.deployedServerUrl);
    const GRAPHQL_PATH = envKeyValue("GRAPHQL_PATH", options.graphqlPath);
    const DATABASE_URL = envKeyValue("DATABASE_URL", options.databasesPath);

    const stuffToWrite = [PORT, DEPLOYED_SERVER_URL, GRAPHQL_PATH, DATABASE_URL];

    fs.writeFileSync(
        path.join(options.templateDirectory, ".env"),
        stuffToWrite.reduce((acc, curr) => acc + curr, "")
    );

    return Promise.resolve();
}
