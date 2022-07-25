import chalk from "chalk";
import { askQuestions } from "./askQuestions";
import { createProject, getOptions } from "./main";

export async function cli(rawArgs) {
    const initialOptions = getOptions(rawArgs);

    console.log(chalk.bold("Welcome to apollo-server-boilerplate CLI!"));
    console.log(
        chalk("Create your server-side project with ApolloServer, GraphQL, Nexus, and Prisma!")
    );

    const answers = await askQuestions();

    const allOptions = { ...initialOptions, ...answers };

    await createProject(allOptions);
}
