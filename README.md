# Rabbit Ears TV

Always-on "cable TV" built from public-domain videos on the Internet Archive.
Every viewer sees the same thing at the same moment. There's no server: each
browser works out what's on from the clock.

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
