#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const targetDir = path.join(projectRoot, 'src', 'api', 'gen');

const args = process.argv.slice(2);
const doDelete = args.includes('--yes') || args.includes('-y');
const verbose = args.includes('--verbose') || args.includes('-v');
const help = args.includes('--help') || args.includes('-h');

if (help) {
  console.log('Usage: node scripts/deleteGenFiles.js [--yes|-y] [--verbose|-v]');
  console.log('Default: dry-run (lists files). Use --yes to actually delete everything inside src/api/gen');
  process.exit(0);
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function listContents(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(p);
      out.push(...(await listContents(p)));
    } else {
      out.push(p);
    }
  }
  return out;
}

async function removeEntry(p) {
  const stat = await fs.lstat(p);
  if (stat.isDirectory()) {
    const children = await fs.readdir(p);
    for (const c of children) {
      await removeEntry(path.join(p, c));
    }
    await fs.rmdir(p);
    if (verbose) console.log('Removed dir:', path.relative(projectRoot, p));
  } else {
    await fs.unlink(p);
    if (verbose) console.log('Removed file:', path.relative(projectRoot, p));
  }
}

(async function main(){
  if (!await exists(targetDir)) {
    console.error('Docelowy katalog nie istnieje:', targetDir);
    process.exit(1);
  }

  // safety: ensure path ends with src/api/gen
  const rel = path.relative(projectRoot, targetDir);
  if (!rel.replace(/\\/g, '/').endsWith('src/api/gen')) {
    console.error('Błąd bezpieczeństwa: oczekiwano katalogu kończącego się na src/api/gen, otrzymano:', rel);
    process.exit(1);
  }

  const contents = await listContents(targetDir);
  if (contents.length === 0) {
    console.log('Brak zawartości do usunięcia w', rel);
    return;
  }

  console.log('Znaleziono', contents.length, 'pozycji w', rel);
  for (const p of contents) console.log('-', path.relative(projectRoot, p));

  if (!doDelete) {
    console.log('\nTryb: DRY-RUN. Uruchom z --yes zeby rzeczywiście usunąć zawartość.');
    return;
  }

  // wykonaj usuwanie — usuwamy każdy wpis wewnątrz katalogu gen
  try {
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(targetDir, e.name);
      await removeEntry(p);
    }
    console.log('Gotowe. Usunięto zawartość', rel);
  } catch (err) {
    console.error('Błąd podczas usuwania:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
