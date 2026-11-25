// Builds data/channels.json from the Internet Archive's search + metadata APIs.
// The channel line-up lives in tools/lineup.mjs.
//
// Usage (from the project folder):
//   node tools/build-channels.mjs              rebuild every channel
//   node tools/build-channels.mjs drivein vice rebuild only these channels, keep the rest as they are
//   node tools/build-channels.mjs --refresh    look every video up again instead of reusing earlier lookups
//   node tools/assemble.mjs                    then bake the data into index.html
//   add --private to either one to use tools/lineup-private.mjs and the private/ folder
//   (both are git-ignored: that copy is for running on your own computer only)
//
// Searched channels pull in junk, so always read the titles after a rebuild and add rejects to DROP.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
const PRIVATE = process.argv.includes('--private');
const { CHANNELS } = await import(PRIVATE ? './lineup-private.mjs' : './lineup.mjs');
const DEST = PRIVATE ? 'private/channels.json' : 'data/channels.json';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJSON(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'rabbit-ears-builder/1.0' } });
      if (r.ok) return await r.json();
    } catch {}
    await sleep(800 * (i + 1));
  }
  return null;
}

function parseLen(v) {
  if (v == null) return 0;
  const s = String(v).trim();
  if (s.includes(':')) return s.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
  return Math.round(parseFloat(s)) || 0;
}

const RANK = { 'h.264 ia': 4, 'h.264': 3, 'mpeg4': 2, '512kb mpeg4': 1 };
function pickFile(files) {
  let best = null;
  for (const f of files) {
    if (!f.name?.toLowerCase().endsWith('.mp4')) continue;
    const r = RANK[(f.format || '').toLowerCase()];
    if (!r) continue; // skip MPEG2, Ogg and other formats browsers can't play
    const len = parseLen(f.length);
    if (!len) continue;
    if (!best || r > best.r) best = { r, name: f.name, len };
  }
  return best;
}

// The Archive's storage nodes go offline now and then; skip files that don't answer.
async function reachable(id, file) {
  const u = `https://archive.org/download/${encodeURIComponent(id)}/${file.split('/').map(encodeURIComponent).join('/')}`;
  try {
    const r = await fetch(u, { headers: { Range: 'bytes=0-0', 'User-Agent': 'rabbit-ears-builder/1.0' }, signal: AbortSignal.timeout(20000) });
    r.body?.cancel();
    return r.ok;
  } catch { return false; }
}

// Looks up one item and returns a playlist entry, or null if it has no playable, reachable file.
// `want` names one file when an item holds several videos (bonus features, other cuts).
async function resolveItem(id, title, year, max = 4 * 3600, want) {
  const md = await getJSON(`https://archive.org/metadata/${encodeURIComponent(id)}`);
  if (!md?.files || md.is_dark) { console.error(`  missing: ${id}`); return null; }
  const f = pickFile(want ? md.files.filter((x) => x.name === want) : md.files);
  if (!f || f.len < 20 || f.len > max) { console.error(`  no playable file: ${id}`); return null; }
  if (!(await reachable(id, f.name))) { console.error(`  offline, skipped: ${id}`); return null; }
  return { id, file: f.name, dur: f.len, title, year };
}

// An item holding a whole season: one playlist entry per playable video, in name order.
async function expandItem(id, title, year, limit = 999) {
  const md = await getJSON(`https://archive.org/metadata/${encodeURIComponent(id)}`);
  if (!md?.files) { console.error(`  missing: ${id}`); return []; }
  const best = new Map();
  for (const f of md.files) {
    if (!f.name?.toLowerCase().endsWith('.mp4')) continue;
    const r = RANK[(f.format || '').toLowerCase()], len = parseLen(f.length);
    if (!r || len < 60 || len > 4 * 3600) continue;
    const k = f.name.replace(/(\.ia)?\.mp4$/i, '').replace(/_512kb$/i, '');
    if (!best.has(k) || r > best.get(k).r) best.set(k, { r, name: f.name, len });
  }
  const files = [...best.values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })).slice(0, limit);
  if (!files.length || !(await reachable(id, files[0].name))) { console.error(`  offline or empty: ${id}`); return []; }
  return files.map((f) => ({ id, file: f.name, dur: f.len, title: `${title}: ${f.name.split('/').pop().replace(/(\.ia)?\.mp4$/i, '').replace(/[_]+/g, ' ')}`, year }));
}

// Searched channels only. Hand-reviewed rejects: adult, graphic, still under copyright, mislabeled, or off-theme.
const EXCLUDE = /sex|molester|naked|nude|kirby|hogan|doblaje|espa[nñ]ol|full ?movie|trailer|teaserama|burlesque|strip/i;
const DROP = new Set([
  'EvereadyHartonInBuriedTreasureSD', 'ThePinkPanther-cartoons', 'the_new_three_stooges_dinopoodi',
  'the_new_three_stooges_the_noisy_silent_movie', 'SteamboatWillie',
  'Experime1940',
  'Nosferatu_DVD_quality', 'House_On_Haunted_Hill.avi',
  'nightmare_castle@noir', 'Double.Indemnity.1944.720p.BrRip.x265.HEVCBay.com.mkv', 'Kill.or.Cure',
  'KablamTVSeries', 'Collectionof90sCommercials', 'The_Brady_Bunch_Variety_Hour_1976-1977', 'finalcurtainedwood',
  '02HipWaders2', 'Game_Show_Lucille_Ball', 'quranarabicfrenchmp4', 'Promo_Jetsons_ABC-TV_1963',
  'TAMIS_23',
  'ColorCrazinessTheThreeStooges', 'cco_thegunandthepulpit', 'penny_serenade', 'TheOvertheHillGang',
  'tarzan_and_the_green_goddess',
]);
const dropped = (id, slug) => DROP.has(id) || DROP.has(`${id}@${slug}`);
const norm = (t) => t.toLowerCase().replace(/\(.*?\)/g, '').replace(/\bthe\b/g, '').replace(/[^a-z0-9]/g, '');

async function buildChannel(ch) {
  const items = [];
  if (ch.items) {
    const groups = [];
    for (const [id, title, year, want, limit] of ch.items) {
      if (want === '*') { groups.push(await expandItem(id, title, year, limit)); continue; }
      const known = !REFRESH && CACHE.get(want ? `${id}/${want}` : id);
      const it = known ? { ...known, title, year } : await resolveItem(id, title, year, undefined, want);
      if (it) groups.push([it]);
    }
    // mix: deal shows out in turn (one episode of each) instead of a whole season in a row
    if (ch.mix) { for (let i = 0; groups.some((g) => g.length > i); i++) for (const g of groups) if (g[i]) items.push(g[i]); }
    else items.push(...groups.flat());
  } else {
    const seen = new Set();
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(ch.q)}&fl[]=identifier&fl[]=title&fl[]=year&fl[]=date&sort[]=downloads+desc&rows=${ch.n * 3}&output=json`;
    const docs = (await getJSON(url))?.response?.docs || [];
    for (const d of docs) {
      if (items.length >= ch.n) break;
      const t0 = String(Array.isArray(d.title) ? d.title[0] : d.title).trim();
      const y0 = parseInt(String(d.year || d.date || '').slice(0, 4)) || 0;
      if (dropped(d.identifier, ch.slug) || EXCLUDE.test(t0) || EXCLUDE.test(d.identifier) || y0 > 1999 || seen.has(norm(t0))) continue;
      seen.add(norm(t0));
      const year = String(d.year || (d.date || '').slice(0, 4) || '').replace(/[^0-9]/g, '').slice(0, 4);
      const it = await resolveItem(d.identifier, t0, year, ch.max);
      if (it) items.push(it);
    }
  }
  const total = items.reduce((a, b) => a + b.dur, 0);
  console.error(`${ch.name}: ${items.length} items, ${(total / 3600).toFixed(1)} h`);
  const { q, n, max, mix, items: _, ...meta } = ch;
  return { ...meta, items };
}

const REFRESH = process.argv.includes('--refresh');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const old = existsSync(DEST) ? JSON.parse(readFileSync(DEST, 'utf8')) : [];
// Earlier lookups, by item id and by id/file (for items that hold several videos).
const seen = [...old, ...(PRIVATE && existsSync('data/channels.json') ? JSON.parse(readFileSync('data/channels.json', 'utf8')) : [])];
const CACHE = new Map(seen.flatMap((c) => c.items.flatMap((i) => [[i.id, i], [`${i.id}/${i.file}`, i]])));
const out = [];
for (const ch of CHANNELS) {
  const prev = old.find((c) => c.slug === ch.slug);
  if (only.length && !only.includes(ch.slug) && prev) {
    const { q, n, max, mix, items: _, ...meta } = ch;
    out.push({ ...meta, items: prev.items });   // keep the existing line-up, refresh name/tag/hours
  } else {
    out.push(await buildChannel(ch));
  }
}
mkdirSync(DEST.split('/')[0], { recursive: true });
writeFileSync(DEST, JSON.stringify(out));
console.error('wrote', DEST);
