import chalk from "chalk";
import inquirer from "inquirer";
import { VERSION } from "./version";

function isLatest() {
    const clientVersion = VERSION;
    const [one, two, three] = clientVersion.split(".").map(x => parseInt(x));
    const [latest_one, latest_two, latest_three] = [1, 0, 1];

    if (one === latest_one) {
        if (two === latest_two) {
            if (three === latest_three) {
                return true;
            }

            return false;
        }

        return false;
    }

    return false;
}

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

function promptForMissingOptions(options) {
    const additionalQuestions = [];

    if (!options.initializeGitRepository) {
        additionalQuestions.push({
            type: "confirm",
            name: "initializeGitRepository",
            default: false,
            message: "Do you want to initialize a git repository?",
        });
    }

    return additionalQuestions;
}

export async function provideAllOptions(options) {
    const questions = [
        {
            type: "list",
            name: "graphqlSchemaGenerator",
            // v1 -> only NexusJS
            choices: ["nexus", "type-graphql"],
            default: "nexus",
            message: "Generate GraphQL schema with (v1 supports only NexusJS)",
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
    ];

    if (!isLatest()) {
        questions.push({
            type: "confirm",
            name: "installLatestVersion",
            default: true,
            message: "Do you want to install the latest version of this CLI?",
        });
    }

    const additionalQuestions = promptForMissingOptions(options);

    questions.push(...additionalQuestions);

    const answers = await inquirer.prompt(questions);

    const template = await getTemplate(answers.graphqlSchemaGenerator);

    return {
        ...options,
        ...answers,
        template,
    };
}
