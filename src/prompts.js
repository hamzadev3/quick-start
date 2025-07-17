import inquirer from 'inquirer';
export async function askSetup() {
  const { appName, template } = await inquirer.prompt([
    { name: 'appName', message: 'Project name:', default: 'my-app' },
    { name: 'template', message: 'Template:', type: 'list', choices: ['basic'], default: 'basic' }
  ]);
  return { appName, template };
}
