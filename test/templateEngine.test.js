import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyDirWithTokens } from '../lib/templateEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const TEMPLATES  = path.resolve(__dirname, '..', 'templates', 'basic');

async function exists(p){ try { await fs.access(p); return true; } catch { return false; } }

test('copies template, renames files, replaces tokens', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'qs-'));
  const tokens = { '{{APP_NAME}}': 'demo', '__APP_NAME__': 'demo' };

  await copyDirWithTokens(TEMPLATES, tmp, tokens);

  assert.equal(await exists(path.join(tmp, '.gitignore')), true);
  const pkg = JSON.parse(await fs.readFile(path.join(tmp, 'package.json'), 'utf8'));
  assert.equal(pkg.name, 'demo');

  const idx = await fs.readFile(path.join(tmp, 'src', 'index.js'), 'utf8');
  assert.match(idx, /demo/);
});