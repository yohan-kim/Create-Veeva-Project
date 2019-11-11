import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--install": Boolean,
      "-i": "--install"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false
  };
}
async function promptForMissingOptions(options) {
  const defaultTemplate = "JavaScript";
  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["JavaScript", "TypeScript"],
      default: defaultTemplate
    });
  }
  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initalize a git repository?",
      default: false
    });
  }
  questions.push({
    type: "number",
    name: "slide",
    message: "Total number of Slide?",
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || "Please enter a number";
    }
  });
  questions.push({
    type: "input",
    name: "product",
    message: "Name of Veeva Product"
  });
  questions.push({
    type: "confirm",
    name: "seperate",
    message: "Do you want Seperate Main and Add?",
    default: false
  });
  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    git: options.git || answers.git,
    template: options.template || answers.template,
    ...answers
  };
}
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
  console.log(options);
}
