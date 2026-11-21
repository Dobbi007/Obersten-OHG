import { cp, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'public');
const output = join(root, 'dist');
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const all = await files(source);
const paths = new Set(all.map(path => '/' + path.slice(source.length + 1)));
paths.add('/');
for (const path of all) {
  const content = await readFile(path, 'utf8');
  if (path.endsWith('.html')) {
    if (!content.includes('lang="de"') || !content.includes('name="viewport"')) throw new Error(`Missing document metadata: ${path}`);
    const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    if (new Set(ids).size !== ids.length) throw new Error(`Duplicate HTML id: ${path}`);
    for (const [, attr, value] of content.matchAll(/\b(href|src)="([^"]+)"/g)) {
      if (value.startsWith('#')) { if (!ids.includes(value.slice(1))) throw new Error(`Broken fragment ${value}: ${path}`); }
      else if (value.startsWith('/') && !paths.has(value.split(/[?#]/)[0])) throw new Error(`Missing ${attr} ${value}: ${path}`);
    }
  }
  if (path.endsWith('.js')) {
    if (process.versions.bun) {
      const result = await Bun.build({ entrypoints:[path], target:'browser', write:false });
      if (!result.success) throw new Error(`JavaScript validation failed: ${path}`);
    } else {
      const check = spawnSync(process.execPath, ['--check', path], { encoding:'utf8' });
      if (check.status !== 0) throw new Error(check.stderr || `JavaScript validation failed: ${path}`);
    }
  }
}
await rm(output, { recursive:true, force:true });
await mkdir(output, { recursive:true });
await cp(source, output, { recursive:true });
console.log(`Build successful: ${all.length} files. German metadata, local links, fragment targets and JavaScript checked.`);
