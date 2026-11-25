# Rabbit Ears TV

**Watch it:** https://joshintexas.github.io/rabbit-ears-tv/

Always-on "cable TV" built from public-domain videos on the Internet Archive.
Every viewer sees the same thing at the same moment. There's no server: each
browser works out what's on from the clock.

## Channels

| Ch | Name | What's on |
|---|---|---|
| 3 | Inkwell | Public-domain cartoons |
| 7 | Classroom | Educational and industrial films |
| 13 | Creature Feature | Sci-fi and horror B-movies |
| 21 | Night Streets | Film noir |
| 29 | Ad Break | Vintage commercials |
| 42 | Kodachrome | Strangers' home movies |
| 55 | Laugh Track | Old comedy shorts and features |
| 61 | Drive-In | So-bad-they're-good movies, with trailers between features |
| 64 | Cheap TV | Roller derby, wrestling, cheap space serials, Racket Squad, Groucho |
| 99 | After Dark | Burlesque reels and 1930s–50s vice films. On air 10 PM–4 AM local time; a test card the rest of the day |

Channels 3–55 come from Archive searches. Channels 61–99 are hand-picked lists in
`tools/build-channels.mjs`. After Dark deliberately leaves out anything with
nudity: GitHub Pages doesn't allow sexually explicit content.

## Files

| File | What it is |
|---|---|
| `index.html` | The finished site. One file; the channel data is baked in. |
| `src/template.html` | The page source. Edit this, not `index.html`. |
| `data/channels.json` | The channel line-ups: Archive item ID, file, length, title, year. |
| `tools/build-channels.mjs` | Searches the Archive and rebuilds `data/channels.json`. |
| `tools/assemble.mjs` | Bakes `data/channels.json` into `src/template.html` → `index.html`. |

## Run it locally

Browsers won't play it from a double-clicked file reliably, so serve the folder:

```
python -m http.server 8765
```

Then open http://localhost:8765.

## Change the channels

1. Edit the `CHANNELS` list at the top of `tools/build-channels.mjs`. Each `q` is
   an archive.org search query, e.g. `collection:prelinger AND subject:space`.
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
