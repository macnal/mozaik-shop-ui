// explanation: Skrypt filtruje spec OpenAPI zostawiając tylko ścieżki związane z weblinker (path zawiera '/weblinker' lub tag zaczyna się od 'weblinker')
// zapisuje wynik do `.orval/openapi.filtered.json` i generuje prosty plik konfiguracyjny `.orval/orval.temp.config.js`
const fs = require('fs');
const path = require('path');

const INPUT = process.env.OPENAPI || path.resolve(__dirname, '..', 'openapi', 'api.guildmage.eu.json');
const OUT_DIR = path.resolve(__dirname, '..', 'openapi');
const OUT_SPEC = path.join(OUT_DIR, 'api.guildmage.eu.filtered.json');
const ORVAL_CONFIG = path.join(OUT_DIR, 'orval.temp.config.js');

function looksLikeWeblinkerPath(p) {
  return typeof p === 'string' && p.toLowerCase().includes('/weblinker');
}

function hasWeblinkerTag(op) {
  return Array.isArray(op.tags) && op.tags.some(t => typeof t === 'string' && t.toLowerCase().startsWith('weblinker'));
}

function shouldKeepPath(methods) {
  for (const op of Object.values(methods)) {
    if (!op || typeof op !== 'object') continue;
    if (hasWeblinkerTag(op)) return true;
    // fallback: operationId or summary containing weblinker
    if ((op.operationId && String(op.operationId).toLowerCase().includes('weblinker')) || (op.summary && String(op.summary).toLowerCase().includes('weblinker'))) {
      return true;
    }
  }
  return false;
}

if (!fs.existsSync(INPUT)) {
  console.error('OpenAPI input not found:', INPUT);
  process.exit(2);
}

const raw = fs.readFileSync(INPUT, 'utf8');
let spec;
try {
  spec = JSON.parse(raw);
} catch (err) {
  console.error('Failed to parse OpenAPI JSON:', err.message);
  process.exit(2);
}

const newSpec = Object.assign({}, spec);
newSpec.paths = {};

for (const [p, methods] of Object.entries(spec.paths || {})) {
  if (looksLikeWeblinkerPath(p) || shouldKeepPath(methods)) {
    newSpec.paths[p] = methods;
  }
}

// keep components (schemas, responses, parameters, requestBodies) to avoid broken $ref
if (spec.components) {
  newSpec.components = spec.components;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_SPEC, JSON.stringify(newSpec, null, 2), 'utf8');

// Prosty config orval — dostosuj 'output.target' jeśli chcesz inny katalog
// zamiast hardcodowanego 'gen' ustawiamy docelowy katalog generowanych plików
const OUTPUT_TARGET = path.join('src', 'api', 'gen');
const configInput = path.basename(OUT_SPEC); // 'openapi.filtered.json'
const config = `module.exports = {
  api: {
    input: '${configInput}',
    output: {
      // orval target: katalog, do którego będą zapisywane pliki.
      target: '${OUTPUT_TARGET.replace(/\\\\/g, '/')}',
      client: 'fetch'
    }
  }
};
`;
fs.writeFileSync(ORVAL_CONFIG, config, 'utf8');

console.log('Filtered spec written to', OUT_SPEC);
console.log('Orval temp config written to', ORVAL_CONFIG);
