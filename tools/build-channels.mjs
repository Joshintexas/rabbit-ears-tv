// Builds channels.json from Internet Archive search + metadata APIs.
// Usage (from the project folder): node tools/build-channels.mjs && node tools/assemble.mjs
// Edit CHANNELS below to add or change channels; q is an archive.org search query.
import { writeFileSync } from 'node:fs';

const CHANNELS = [
  { num: 3,  slug: 'toons',     name: 'Inkwell',          tag: 'Public-domain cartoons',        color: '#ffd400', q: 'collection:classic_cartoons OR collection:vintage_cartoons', n: 50, max: 1800 },
  { num: 7,  slug: 'classroom', name: 'Classroom',        tag: 'Educational & industrial films', color: '#00e5ff', q: 'collection:prelinger AND mediatype:movies', n: 30, max: 2400 },
  { num: 13, slug: 'creature',  name: 'Creature Feature', tag: 'Sci-fi & horror B-movies',      color: '#39ff14', q: 'collection:SciFi_Horror', n: 20, max: 7200 },
  { num: 21, slug: 'noir',      name: 'Night Streets',    tag: 'Film noir',                     color: '#ff3bd4', q: 'collection:Film_Noir', n: 20, max: 7200 },
  { num: 29, slug: 'ads',       name: 'Ad Break',         tag: 'Vintage commercials',           color: '#ff5f1f', q: 'collection:classic_tv_commercials', n: 40, max: 1800 },
  { num: 42, slug: 'homemovies',name: 'Kodachrome',       tag: 'Strangers’ home movies',   color: '#b388ff', q: 'collection:home_movies AND mediatype:movies', n: 30, max: 3600 },
  { num: 55, slug: 'comedy',    name: 'Laugh Track',      tag: 'Old comedy shorts & features',  color: '#ff4d4d', q: 'collection:Comedy_Films', n: 25, max: 7200 },
];

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

const EXCLUDE = /sex|molester|naked|nude|kirby|hogan|doblaje|espa[nñ]ol|full ?movie|trailer|teaserama|burlesque|strip/i;
// The Archive's storage nodes go offline now and then; skip files that don't answer.
async function reachable(id, file) {
  const u = `https://archive.org/download/${encodeURIComponent(id)}/${file.split('/').map(encodeURIComponent).join('/')}`;
  try {
    const r = await fetch(u, { headers: { Range: 'bytes=0-0', 'User-Agent': 'rabbit-ears-builder/1.0' }, signal: AbortSignal.timeout(20000) });
    r.body?.cancel();
    return r.ok;
  } catch { return false; }
}

// Hand-reviewed rejects: adult, graphic, still under copyright, mislabeled, or off-theme.
// Search results change over time, so review new titles after every rebuild and add to this list.
export const DROP = new Set([
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
  const seen = new Set();
  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(ch.q)}&fl[]=identifier&fl[]=title&fl[]=year&fl[]=date&sort[]=downloads+desc&rows=${ch.n * 3}&output=json`;
  const res = await getJSON(url);
  const docs = res?.response?.docs || [];
  const items = [];
  for (const d of docs) {
    if (items.length >= ch.n) break;
    const t0 = String(Array.isArray(d.title) ? d.title[0] : d.title);
    const y0 = parseInt(String(d.year || d.date || '').slice(0, 4)) || 0;
    if (dropped(d.identifier, ch.slug) || EXCLUDE.test(t0) || EXCLUDE.test(d.identifier) || y0 > 1999 || seen.has(norm(t0))) continue;
    seen.add(norm(t0));
    const md = await getJSON(`https://archive.org/metadata/${encodeURIComponent(d.identifier)}`);
    if (!md?.files || md.is_dark) continue;
    const f = pickFile(md.files);
    if (!f || f.len < 20 || f.len > ch.max) continue;
    if (!(await reachable(d.identifier, f.name))) { console.error(`  offline, skipped: ${d.identifier}`); continue; }
    const year = String(d.year || (d.date || '').slice(0, 4) || '').replace(/[^0-9]/g, '').slice(0, 4);
    items.push({ id: d.identifier, file: f.name, dur: f.len, title: String(Array.isArray(d.title) ? d.title[0] : d.title).trim(), year });
  }
  const total = items.reduce((a, b) => a + b.dur, 0);
  console.error(`${ch.name}: ${items.length} items, ${(total / 3600).toFixed(1)} h`);
  const { q, n, max, ...meta } = ch;
  return { ...meta, items };
}

const out = [];
for (const ch of CHANNELS) out.push(await buildChannel(ch));
const dest = process.argv[2] || 'data/channels.json';
writeFileSync(dest, JSON.stringify(out));
console.error('wrote', dest);
