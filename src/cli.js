import arg from "arg";
import inquirer from "inquirer";
import chalk from 'chalk';
import {
  createProject
} from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg({
    "--git": Boolean,
    "--install": Boolean,
    '--yes': Boolean,
    "--seperate": Boolean,
    "-y": '--yes',
    "-i": "--install",
    "-s": '--seperate'
  }, {
    argv: rawArgs.slice(2)
  });
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    rootFolder: args._[0],
    product: '',
    seperate: args["--seperate"] || false,
    runInstall: args["--install"] || false
  };
}
async function promptForMissingOptions(options) {

  const defaultName = "Veeva-project_1.0";

  if (options.skipPrompts) {
    return {
      ...options,
      presentation: defaultName,
      slide: 10,
      product: 'Veeva-product',
      seperate: true,
      git: false,
      rootFolder: 'Veeva-Project'
    }
  }
  const questions = [];

  questions.push({
    type: "input",
    name: "presentation",
    message: "Name of Veeva root Presentation",
    validate: function (value) {
      if (!value) {
        console.log("\n %s Please enter the presentation", chalk.redBright.bold("ERROR"))
      } else {
        return true;
      }
    }
  });

  questions.push({
    type: "number",
    name: "slide",
    message: "Total number of Slide?",
    validate: function (value) {
      var valid = !isNaN(parseFloat(value));
      if (!valid) {
        console.log("\n %s Please enter number", chalk.redBright.bold("ERROR"))
        process.exit(1);
      } else {
        return true
      }
    }
  });
  questions.push({
    type: "input",
    name: "product",
    message: "Name of Veeva Product",
    validate: function (value) {
      if (!value) {
        console.log("\n %s Please enter the Veeva Product", chalk.redBright.bold("ERROR"))
      } else {
        return true;
      }
    }
  });
  questions.push({
    type: "confirm",
    name: "seperate",
    message: "Do you want to seperate Main and Add?",
    default: false
  });
  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initalize a git repository?",
      default: false
    });
  }
  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    ...answers,
    git: options.git || answers.git,
    rootFolder: options.rootFolder || answers.rootFolder,
    presentation: options.presentation || answers.presentation,
  };
}
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
  console.log(options);
}