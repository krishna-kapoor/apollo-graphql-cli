import chalk from "chalk";
import inquirer from "inquirer";

async function getTemplate(schemaGenerator) {
    if (schemaGenerator === "type-graphql") {
        console.log(chalk.bgYellow("Your project will be in TypeScript"));

        return "ts_type-graphql";
    }
    const furtherAnswers = await inquirer.prompt([
        {
            type: "list",
            name: "template",
            choices: ["TypeScript", "JavaScript"],
            default: "TypeScript",
            message: "Project template",
        },
    ]);

    return furtherAnswers.template === "TypeScript" ? "ts_nexus" : "js_nexus";
}

export async function askQuestions() {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "graphqlSchemaGenerator",
            // v1.0.0 -> only NexusJS
            choices: ["nexus", "type-graphql"],
            default: "nexus",
            message: "Generate GraphQL schema with (v1.0.0 supports only NexusJS)",
        },
        {
            type: "number",
            name: "devPort",
            default: 8080,
            message: "Run dev server on port",
        },
        {
            type: "input",
            name: "graphqlPath",
            default: "/graphql",
            message: "Path to GraphQL schema",
        },
        {
            type: "input",
            name: "deployedServerUrl",
            message: "Server URL after deployment",
        },
        {
            type: "input",
            name: "databaseUrl",
            message: "Database URL",
        },
    ]);

    const template = await getTemplate(answers.graphqlSchemaGenerator);

    return { ...answers, template };
}
