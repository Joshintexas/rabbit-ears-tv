# Rabbit Ears TV

**Watch it:** https://joshintexas.github.io/rabbit-ears-tv/

Always-on "cable TV" built from public-domain videos on the Internet Archive.
Every viewer sees the same thing at the same moment. There's no server: each
browser works out what's on from the clock.

## Channels

| Ch | Name | What's on |
|---|---|---|
| 13 | Creature Feature | Sci-fi and horror B-movies |
| 17 | Juvie | Girl-gang and delinquent movies, 1950s teen guidance films |
| 29 | Ad Break | Vintage commercials |
| 31 | Space Cadets | Space Patrol, Commando Cody, Flash Gordon |
| 33 | Ringside | 1949–52 roller derby, women's wrestling, luchadora movies |
| 35 | Prime Time Trash | Queen for a Day, Racket Squad, You Bet Your Life |
| 61 | Drive-In | Monster movies so bad they're good, with trailers |
| 63 | Space Babes | Cat-women, cave girls and B-movie bombshells |
| 66 | Vice Squad | Reefer, cocaine and "sex hygiene" scare films |
| 88 | Burlesque | Strip-tease revues and cheesecake Soundies. 10 PM–4 AM only |
| 99 | After Dark | 18+. Bettie Page / Irving Klaw fetish reels, early-60s nudie films, shockers. 10 PM–4 AM only, with an age check |

Late-night channels show a test card outside their hours. Creature Feature and Ad
Break come from Archive searches; the rest are hand-picked lists in
`tools/lineup.mjs`. After Dark tops out at R-rated: GitHub Pages allows
non-pornographic nudity but not pornography, so nothing explicit goes on, and
nothing where a performer or character could be a minor.

## Files

| File | What it is |
|---|---|
| `index.html` | The finished site. One file; the channel data is baked in. |
| `src/template.html` | The page source. Edit this, not `index.html`. |
| `data/channels.json` | The channel line-ups: Archive item ID, file, length, title, year. |
| `tools/lineup.mjs` | The channel line-up: numbers, names, hours and every hand-picked video. |
| `tools/build-channels.mjs` | Looks the line-up up on the Archive and writes `data/channels.json`. |
| `tools/assemble.mjs` | Bakes `data/channels.json` into `src/template.html` → `index.html`. |

## Run it locally

Browsers won't play it from a double-clicked file reliably, so serve the folder:

```
python -m http.server 8765
```

Then open http://localhost:8765.

## Change the channels

1. Edit `tools/lineup.mjs`. Hand-picked channels list Archive item IDs; searched
   channels take an archive.org query, e.g. `collection:prelinger AND subject:space`.
2. `node tools/build-channels.mjs` (takes a few minutes; it checks each video).
   To rebuild only some channels, name them: `node tools/build-channels.mjs drivein afterdark`.
3. **Read through the titles it picked.** Search results include mislabeled,
   adult and still-copyrighted uploads. Add any rejects to `DROP` and rerun.
4. `node tools/assemble.mjs`

## Put it online

`index.html` is a static file, so any static host works: GitHub Pages, Netlify,
Cloudflare Pages, Render. Video streams come straight from archive.org, so
hosting costs nothing.

## How "live" works

Each channel's playlist loops forever from a fixed start (1 Jan 2025 UTC).
`(now − start) mod playlist length` gives the current video and how far into it
to seek. If an Archive file won't load, that viewer skips to the next one and
remembers the dead file for 12 hours.
