import arg from "arg";
import chalk from "chalk";
import execa from "execa";
import Listr from "listr";
import ncp from "ncp";
import path from "path";
import { projectInstall } from "pkg-install";
import { promisify } from "util";
import { writeEnvFile } from "./env";

const copy = promisify(ncp);

export function getTemplateUrl(...additionalArgs) {
    const currentFileUrl = import.meta.url;

    return path.resolve(
        new URL(currentFileUrl).pathname.substring(1),
        "../../templates",
        ...additionalArgs
    );
}

export function getOptions(rawArgs) {
    const options = arg(
        {
            "--git": Boolean,
            "-g": "--git",
            "--version": Boolean,
            "-v": "--version",
        },
        { argv: rawArgs.slice(2) }
    );

    return {
        initializeGitRepository: options["--git"] || false,
        projectFolder: options._[0] || ".",
        showVersion: options["--version"] || false,
    };
}

async function initializeGitRepository() {
    const results = await execa("git", ["init"], {
        cwd: options.targetDirectory,
    });

    if (results.failed) {
        return Promise.reject(new Error("Failed to initialize git repository"));
    }

    return;
}

function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}

export async function createProject(options) {
    const templateDirectory = getTemplateUrl(options.template);
    options.templateDirectory = templateDirectory;

    const tasks = new Listr([
        {
            title: "Writing environment variables",
            task: () => writeEnvFile(options),
        },
        {
            title: "Copying template files",
            task: () => copyTemplateFiles(options),
        },
        {
            title: "Initializing git repository",
            task: () => initializeGitRepository(),
            enabled: () => options.initializeGitRepository,
        },
        {
            title: "Installing dependencies",
            task: () =>
                projectInstall({
                    cwd: options.targetDirectory,
                    prefer: "yarn",
                }),
        },
    ]);

    await tasks.run();

    console.log("\n%s Project ready", chalk.bgGreen(" DONE "));

    if (options.template.includes("ts")) {
        console.log("\nTo build, run \n%s", chalk.yellow.bold("npm run build"));
        console.log("\nTo run a live build, run \n%s", chalk.yellow.bold("npm run build:watch"));
    }

    console.log("\nTo start your dev server, run \n%s", chalk.yellow.bold("npm run dev"));

    return true;
}
