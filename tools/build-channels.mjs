// Builds data/channels.json from the Internet Archive's search + metadata APIs.
//
// Usage (from the project folder):
//   node tools/build-channels.mjs              rebuild every channel
//   node tools/build-channels.mjs drivein tv   rebuild only these channels, keep the rest as they are
//   node tools/assemble.mjs                    then bake the data into index.html
//
// A channel either searches (q: an archive.org query) or lists hand-picked items (items: [...]).
// Searched channels pull in junk, so always read the titles after a rebuild and add rejects to DROP.
// hours: [start, end] makes a channel broadcast only between those local hours.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DEST = 'data/channels.json';

// Hand-picked items: [archive.org identifier, display title, year].
const AFTER_DARK = [
  ['SoundieM', 'Soundie: Ten Pretty Girls', '1940s'],
  ['Teaserama', 'Teaserama, with Bettie Page & Tempest Storm', '1955'],
  ['SoundieF', 'Soundie: Reg Kehoe and His Marimba Queens', '1940'],
  ['sex_madness', 'Sex Madness', '1938'],
  ['ReeferMadnessTrailer', 'Trailer: Reefer Madness', ''],
  ['reefer_madness1938', 'Reefer Madness', '1936'],
  ['soundie_11', 'Soundie: Jiveroo', '1940s'],
  ['varietease-1954', 'Varietease, with Lili St. Cyr', '1954'],
  ['soundie_12', 'Soundie: Hollywood Boogie', '1946'],
  ['SheShouldaSaidNo', 'She Shoulda Said ‘No’!', '1949'],
  ['LampOfMemory', 'Soundie: Lamp of Memory', '1944'],
  ['The_Cocaine_Fiends', 'The Cocaine Fiends', '1935'],
  ['soundie_1', 'Soundie: The Hut Sut Song', '1941'],
  ['Test_Tube_Babies_1948', 'Test Tube Babies', '1948'],
  ['SoundieB', 'Soundie: Sweet Sue (Just You)', '1940s'],
  ['Damaged_Lives', 'Damaged Lives', '1933'],
  ['AssassinOfYouth_423', 'Assassin of Youth', '1937'],
];
const DRIVE_IN = [
  ['Plan9FromOuterSpaceTrailer', 'Trailer: Plan 9 from Outer Space', ''],
  ['plan-9-from-outer-space', 'Plan 9 from Outer Space', '1959'],
  ['RobotMonster-Trailer', 'Trailer: Robot Monster', ''],
  ['robot-monster-1953', 'Robot Monster', '1953'],
  ['ManosTheHandsofFate', 'Manos: The Hands of Fate', '1966'],
  ['KillerShrews-Trailer', 'Trailer: The Killer Shrews', ''],
  ['The_Killer_Shrews', 'The Killer Shrews', '1959'],
  ['teenagers_from_outerspace', 'Teenagers from Outer Space', '1959'],
  ['BrideOfTheMonster-Trailer', 'Trailer: Bride of the Monster', ''],
  ['bride-of-the-monster-1955', 'Bride of the Monster', '1955'],
  ['Beast_of_Yucca_Flats_movie', 'The Beast of Yucca Flats', '1961'],
  ['Cat-womenOfTheMoon-Trailer', 'Trailer: Cat-Women of the Moon', ''],
  ['CatWomenOfTheMoon', 'Cat-Women of the Moon', '1953'],
  ['cco_attackofthegiantleeches', 'Attack of the Giant Leeches', '1959'],
  ['TheWildWomenOfWongoTrailer', 'Trailer: The Wild Women of Wongo', ''],
  ['The_Wild_Women_Of_Wongo', 'The Wild Women of Wongo', '1958'],
  ['giant_gila_monster', 'The Giant Gila Monster', '1959'],
  ['MesaOfLostWomenTrailer', 'Trailer: Mesa of Lost Women', ''],
  ['MesaOfLostWomen', 'Mesa of Lost Women', '1953'],
  ['The_Amazing_Transparent_Man', 'The Amazing Transparent Man', '1960'],
  ['SantaClausConquerstheMartians1964', 'Santa Claus Conquers the Martians', '1964'],
];
const CHEAP_TV = [
  ['1949-RollerDerby-NewYorkVsPhiladelphia', 'Roller Derby: New York vs. Philadelphia', '1949'],
  ['space-patrol-s-01e-01-low-480x-360p', 'Space Patrol: Web of Arachna', '1950s'],
  ['RacketSquadTheSaltedMine1951', 'Racket Squad: The Salted Mine', '1951'],
  ['YulieBrynnerVsRoseRoman', 'Chicago Wrestling: Yulie Brynner vs. Rose Roman', '1950'],
  ['commandocodyskymarshaloftheuniverses01e03cosmicvengeance', 'Commando Cody: Enemies of the Universe', '1955'],
  ['You_Bet_Your_Life_Groucho', 'You Bet Your Life, with Groucho Marx', '1950s'],
  ['1950-RollerDerby-NewJerseyVsPhiladelphia', 'Roller Derby: New Jersey vs. Philadelphia', '1950'],
  ['rockyJonesSpaceRangerBeyondTheCurtainOfSpace1954', 'Rocky Jones, Space Ranger: Beyond the Curtain of Space', '1954'],
  ['RacketSquadTheCaseOfTheTwoLittleCountryGirls', 'Racket Squad: The Two Little Country Girls', '1951'],
  ['GracieAllenSpaceGirls', 'Burns and Allen: The Space Patrol Kids Visit', '1951'],
  ['SpacePatrolS03e28MysteriousOceansInSpace', 'Space Patrol: Mysterious Oceans in Space', '1953'],
  ['1952-RollerDerby-TheChiefsVsTheRedDevils_383', 'Roller Derby: The Chiefs vs. the Red Devils', '1952'],
  ['TheSpaceAdventuresOfFlashGordon_981', 'The Space Adventures of Flash Gordon', '1954'],
  ['RacketSquadKiteHigh', 'Racket Squad: Kite High', '1951'],
  ['rockyJonesSpaceRangerRockysOdyssey1954', 'Rocky Jones, Space Ranger: Rocky’s Odyssey', '1954'],
  ['Space-Patrol-TheDeadlyRayGun', 'Space Patrol: The Deadly Ray Gun', '1951'],
  ['1950-RollerDerby-NewJerseyVsBrooklyn', 'Roller Derby: New Jersey vs. Brooklyn', '1950'],
  ['RacketSquadAccidentallyOnPurpose', 'Racket Squad: Accidentally on Purpose', '1951'],
  ['CommandoCodySkyMarshallOfTheUniversePart1_458', 'Commando Cody: Sky Marshal of the Universe, Part 1', '1955'],
  ['RacketSquadTheBillOfSaleRacket', 'Racket Squad: The Bill of Sale Racket', '1951'],
];

const CHANNELS = [
  { num: 3,  slug: 'toons',     name: 'Inkwell',          tag: 'Public-domain cartoons',        q: 'collection:classic_cartoons OR collection:vintage_cartoons', n: 50, max: 1800 },
  { num: 7,  slug: 'classroom', name: 'Classroom',        tag: 'Educational & industrial films', q: 'collection:prelinger AND mediatype:movies', n: 30, max: 2400 },
  { num: 13, slug: 'creature',  name: 'Creature Feature', tag: 'Sci-fi & horror B-movies',      q: 'collection:SciFi_Horror', n: 20, max: 7200 },
  { num: 21, slug: 'noir',      name: 'Night Streets',    tag: 'Film noir',                     q: 'collection:Film_Noir', n: 20, max: 7200 },
  { num: 29, slug: 'ads',       name: 'Ad Break',         tag: 'Vintage commercials',           q: 'collection:classic_tv_commercials', n: 40, max: 1800 },
  { num: 42, slug: 'homemovies',name: 'Kodachrome',       tag: 'Strangers’ home movies',   q: 'collection:home_movies AND mediatype:movies', n: 30, max: 3600 },
  { num: 55, slug: 'comedy',    name: 'Laugh Track',      tag: 'Old comedy shorts & features',  q: 'collection:Comedy_Films', n: 25, max: 7200 },
  { num: 61, slug: 'drivein',   name: 'Drive-In',         tag: 'So bad they’re good',      items: DRIVE_IN },
  { num: 64, slug: 'cheaptv',   name: 'Cheap TV',         tag: 'Roller derby, wrestling & tin-foil space operas', items: CHEAP_TV },
  { num: 99, slug: 'afterdark', name: 'After Dark',       tag: 'Burlesque & vice films, 10 PM to 4 AM', items: AFTER_DARK, hours: [22, 4] },
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
async function resolveItem(id, title, year, max = 4 * 3600) {
  const md = await getJSON(`https://archive.org/metadata/${encodeURIComponent(id)}`);
  if (!md?.files || md.is_dark) { console.error(`  missing: ${id}`); return null; }
  const f = pickFile(md.files);
  if (!f || f.len < 20 || f.len > max) { console.error(`  no playable file: ${id}`); return null; }
  if (!(await reachable(id, f.name))) { console.error(`  offline, skipped: ${id}`); return null; }
  return { id, file: f.name, dur: f.len, title, year };
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
    for (const [id, title, year] of ch.items) {
      const it = await resolveItem(id, title, year);
      if (it) items.push(it);
    }
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
  const { q, n, max, items: _, ...meta } = ch;
  return { ...meta, items };
}

const only = process.argv.slice(2);
const old = existsSync(DEST) ? JSON.parse(readFileSync(DEST, 'utf8')) : [];
const out = [];
for (const ch of CHANNELS) {
  const prev = old.find((c) => c.slug === ch.slug);
  if (only.length && !only.includes(ch.slug) && prev) {
    const { q, n, max, items: _, ...meta } = ch;
    out.push({ ...meta, items: prev.items });   // keep the existing line-up, refresh name/tag/hours
  } else {
    out.push(await buildChannel(ch));
  }
}
writeFileSync(DEST, JSON.stringify(out));
console.error('wrote', DEST);
