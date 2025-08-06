import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { askSetup } from './prompts.js';
import { copyDirWithTokens } from '../lib/templateEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const TEMPLATE_ROOT = path.resolve(__dirname, '..', 'templates');

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

export default (async function run() {
  console.log(chalk.bold('Quick-Start CLI'));

  try {
    const { appName, template } = await askSetup();
    const srcTemplate = path.join(TEMPLATE_ROOT, template);
    const destDir = path.resolve(process.cwd(), appName);

    if (!await exists(srcTemplate)) {
      console.error(chalk.red(`Template '${template}' not found under ${srcTemplate}`));
      process.exitCode = 1; return;
    }
    if (await exists(destDir)) {
      console.error(chalk.red(`Destination '${destDir}' already exists.`));
      process.exitCode = 1; return;
    }

    console.log(chalk.cyan(`→ Scaffolding '${appName}' from '${template}' ...`));
    const tokens = { '{{APP_NAME}}': appName, '__APP_NAME__': appName };
    await copyDirWithTokens(srcTemplate, destDir, tokens);

    console.log(chalk.green(`✓ Done.`));
    console.log(`Next:
  cd ${appName}
  npm install
  npm run start  # (if the template defines it)`);
  } catch (err) {
    console.error(chalk.red('Build failed:'), err?.message || err);
    process.exitCode = 1;
  }
})();
