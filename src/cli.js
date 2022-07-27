import chalk from "chalk";
import path from "path";
import { createProject, getOptions } from "./main";
import { provideAllOptions } from "./provideAllOptions";
import { VERSION } from "./version";

export async function cli(rawArgs) {
    let initialOptions = getOptions(rawArgs);

    if (initialOptions.showVersion) {
        console.log("CLI version %s", chalk.green(VERSION));
        return true;
    }

    console.log(
        chalk.white(
            "\nCreate your server-side project with ApolloServer, GraphQL, Nexus, and Prisma!"
        )
    );

    const targetDirectory = path.resolve(process.cwd(), initialOptions.projectFolder);
    initialOptions.targetDirectory = targetDirectory;

    console.log(
        "\n" +
            chalk.bgGreen(" CREATE PROJECT ") +
            " Creating project in " +
            chalk.cyan(initialOptions.targetDirectory) +
            "\n"
    );

    const allOptions = await provideAllOptions(initialOptions);

    await createProject(allOptions);
}
