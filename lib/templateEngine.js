import fs from 'fs/promises';
import path from 'path';

const TEXT_LIKE = new Set(['.js', '.ts', '.json', '.md', '.txt', '.gitignore', '.env', '.mjs', '.cjs']);
function isTextLike(p) {
  const bn = path.basename(p);
  const ext = path.extname(p);
  return TEXT_LIKE.has(ext) || TEXT_LIKE.has(bn);
}

function replaceTokens(str, map) {
  let out = String(str);
  for (const [k, v] of Object.entries(map)) {
    if (!k) continue;
    const rx = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    out = out.replace(rx, v);
  }
  return out;
}

function transformName(raw, tokens) {
  let name = raw;
  if (name.endsWith('.tmpl')) name = name.slice(0, -5);
  if (name.startsWith('_')) name = '.' + name.slice(1);
  name = replaceTokens(name, tokens);
  return name;
}

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function copyFileWithTokens(src, dest, tokens) {
  // Decide text vs. binary from the OUTPUT name (after ".tmpl" is stripped).
  // Checking `src` never worked: every template ends in ".tmpl", which is not
  // in TEXT_LIKE, so tokens were never replaced.
  if (isTextLike(dest)) {
    const data = await fs.readFile(src, 'utf8');
    await fs.writeFile(dest, replaceTokens(data, tokens), 'utf8');
  } else {
    const buf = await fs.readFile(src);
    await fs.writeFile(dest, buf);
  }
}

export async function copyDirWithTokens(srcDir, destDir, tokens = {}) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  await ensureDir(destDir);

  for (const e of entries) {
    if (e.name === '.DS_Store' || e.name.startsWith('._')) continue;

    const src = path.join(srcDir, e.name);
    const name = transformName(e.name, tokens);
    const dest = path.join(destDir, name);

    if (e.isDirectory()) {
      await copyDirWithTokens(src, dest, tokens);
    } else {
      await copyFileWithTokens(src, dest, tokens);
    }
  }
}
