import chalk from 'chalk';
import { askSetup } from './prompts.js';

export default (async function run() {
  console.log(chalk.bold('Quick-Start CLI'));
  const { appName, template } = await askSetup();
  console.log(chalk.green(`Scaffolding '${appName}' from '${template}' template...`));
  console.log(chalk.yellow('Template engine coming soon...'));
})();
