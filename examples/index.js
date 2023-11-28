const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const select = require("@inquirer/prompts").select;

const dirs = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter((f) => f.isDirectory());

select({
  message: "Which example do you want to run?",
  choices: dirs.map((d) => ({
    name: d.name,
    value: d.name,
  })),
}).then((answer) => {
  const cwd = path.join(__dirname, answer);
  spawn("pnpm", ["dev"], { cwd, stdio: "inherit" });
});
