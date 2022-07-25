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
        },
        { argv: rawArgs.slice(2) }
    );

    return {
        initializeGitRepository: options["--git"] || false,
        projectFolder: options._[0] || ".",
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

function copyTemplateFiles(templateOptions) {
    return copy(templateOptions.templateDirectory, templateOptions.targetDirectory, {
        clobber: false,
    });
}

export async function createProject(options) {
    const targetDirectory = path.resolve(process.cwd(), options.projectFolder);
    options.targetDirectory = targetDirectory;

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
            enabled: () => options.git,
        },
        {
            title: "Installing dependencies",
            task: () =>
                projectInstall({
                    cwd: options.targetDirectory,
                }),
        },
    ]);

    await tasks.run();

    console.log("%s Project ready", chalk.green.bold("DONE"));

    return true;
}
