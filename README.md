# Vishnu Lal Archive

React/Vite application for the public marble experience of the Vishnu Lal Archive.

## Content boundary

- `src/data/artworks/` contains public-safe structured records only.
- `src/data/internal/` contains local research and registrar material; it must never be imported by the frontend.
- `src/data/artworks-index.json` is the lightweight known/public record index.

## Artwork images

Archival masters live in `archive-masters/Flagships/` and are ignored by Git. Public WebP derivatives are generated into `public/artworks/<VL-B-ID>/` at 480, 900, 1440, and 2400 pixels wide.

```powershell
python scripts/generate-artwork-web-assets.py
```

The generator requires Pillow and never overwrites the masters.

## Commands

```powershell
npm.cmd run validate
npm.cmd run lint
npm.cmd run build
```

`npm run build` validates the archive before Vite builds the static site.

## Deployment

This application uses browser-history routing. Configure the production host to rewrite unknown application routes to `index.html`; otherwise direct visits to `/series-i`, `/series-ii`, or `/artwork/:id` will return a server 404 before React can render the appropriate Archive state.
