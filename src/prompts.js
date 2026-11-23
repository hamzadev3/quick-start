import inquirer from 'inquirer';

// Folder-safe project name: letters, numbers, ".", "_" or "-",
// starting with a letter or number. Blocks "../x", "a/b" and spaces.
export const VALID_NAME = /^[a-z0-9][a-z0-9._-]*$/i;

export async function askSetup() {
  const { appName, description, template } = await inquirer.prompt([
    {
      name: 'appName',
      message: 'Project name:',
      default: 'my-app',
      validate: (v) => VALID_NAME.test(v) || 'Use letters, numbers, ".", "_" or "-" (no spaces or slashes).',
    },
    { name: 'description', message: 'Description:', default: 'A new project' },
    { name: 'template', message: 'Template:', type: 'list', choices: ['basic'], default: 'basic' },
  ]);
  return { appName, description, template };
}
