import fs from 'fs/promises';
import path from 'path';

const TEXT_EXT = new Set(['.js','.ts','.json','.md','.txt','.gitignore','.env','.mjs','.cjs']);

function replaceTokens(str, map){
  return Object.entries(map).reduce((s,[k,v]) => s.replaceAll(new RegExp(k,'g'), v), str);
}
async function ensureDir(p){ await fs.mkdir(p, { recursive: true }); }

async function copyFileWithTokens(src, dest, tokens){
  const ext = path.extname(src);
  if (TEXT_EXT.has(ext) || TEXT_EXT.has(path.basename(src))) {
    const data = await fs.readFile(src, 'utf8');
    await fs.writeFile(dest, replaceTokens(data, tokens), 'utf8');
  } else {
    const buf = await fs.readFile(src);
    await fs.writeFile(dest, buf);
  }
}

export async function copyDirWithTokens(srcDir, destDir, tokens, renames={}){
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  await ensureDir(destDir);
  for (const e of entries){
    const src = path.join(srcDir, e.name);
    const rawName = renames[e.name] ?? e.name;
    const name = replaceTokens(rawName, tokens);
    const dest = path.join(destDir, name);
    if (e.isDirectory()){
      await copyDirWithTokens(src, dest, tokens, renames);
    } else {
      await copyFileWithTokens(src, dest, tokens);
    }
  }
}
