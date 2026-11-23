import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyDirWithTokens } from '../lib/templateEngine.js';
import { VALID_NAME } from '../src/prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES = path.resolve(__dirname, '..', 'templates', 'basic');
const TOKENS = {
  '{{APP_NAME}}': 'demo',
  '__APP_NAME__': 'demo',
  '__DESCRIPTION__': 'A demo app',
};

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

async function scaffold() {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'qs-'));
  await copyDirWithTokens(TEMPLATES, tmp, TOKENS);
  return tmp;
}

// Recursively list every file under a directory.
async function listFiles(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await listFiles(p));
    else out.push(p);
  }
  return out;
}

test('renames files: strips .tmpl and turns leading _ into .', async () => {
  const tmp = await scaffold();
  assert.equal(await exists(path.join(tmp, '.gitignore')), true);
  assert.equal(await exists(path.join(tmp, 'package.json')), true);
  assert.equal(await exists(path.join(tmp, 'src', 'index.js')), true);
  assert.equal(await exists(path.join(tmp, 'package.json.tmpl')), false);
});

test('generated package.json is valid JSON with tokens replaced', async () => {
  const tmp = await scaffold();
  const pkg = JSON.parse(await fs.readFile(path.join(tmp, 'package.json'), 'utf8'));
  assert.equal(pkg.name, 'demo');
  assert.equal(pkg.description, 'A demo app');
});

test('no unreplaced tokens are left in any generated file', async () => {
  const tmp = await scaffold();
  for (const file of await listFiles(tmp)) {
    const text = await fs.readFile(file, 'utf8');
    assert.doesNotMatch(text, /\{\{|__[A-Z_]+__/, `leftover token in ${file}`);
  }
});

test('project name validation', () => {
  for (const ok of ['my-app', 'demo', 'app_2', 'v1.0']) assert.ok(VALID_NAME.test(ok), ok);
  for (const bad of ['../evil', 'a/b', 'my app', '', '-start']) assert.ok(!VALID_NAME.test(bad), bad);
});
