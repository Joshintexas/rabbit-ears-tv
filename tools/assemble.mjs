// Injects data/channels.json into src/template.html and writes index.html.
// Usage (from the project folder): node tools/assemble.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const data = readFileSync('data/channels.json', 'utf8').trim();
JSON.parse(data); // fail loudly on bad JSON
// Escape "</" so a title can never close the <script> tag early.
const safe = data.replace(/<\//g, '<\\/');
const html = readFileSync('src/template.html', 'utf8').replace('__DATA__', () => safe);
writeFileSync('index.html', html);
console.log(`index.html written (${(html.length / 1024).toFixed(0)} KB)`);
