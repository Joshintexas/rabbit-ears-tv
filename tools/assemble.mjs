// Injects data/channels.json into src/template.html and writes index.html.
// Usage (from the project folder): node tools/assemble.mjs [--private]
// --private bakes private/channels.json into private/index.html (git-ignored, for your own computer).
import { readFileSync, writeFileSync } from 'node:fs';

const PRIVATE = process.argv.includes('--private');
const SRC = PRIVATE ? 'private/channels.json' : 'data/channels.json';
const OUT = PRIVATE ? 'private/index.html' : 'index.html';
const data = readFileSync(SRC, 'utf8').trim();
JSON.parse(data); // fail loudly on bad JSON
// Escape "</" so a title can never close the <script> tag early.
const safe = data.replace(/<\//g, '<\\/');
const html = readFileSync('src/template.html', 'utf8').replace('__DATA__', () => safe);
writeFileSync(OUT, html);
console.log(`${OUT} written (${(html.length / 1024).toFixed(0)} KB)`);
