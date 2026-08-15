# Portfolio — Ronak Dutta

A software engineering portfolio with a dark, Diablo-inspired art direction.
Obsidian and blackened iron carry the surfaces; bronze carries the accents;
fire is only ever a light source.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
npm run lint
```

## Where things are

| Path                         | What it holds                                                  |
| ---------------------------- | -------------------------------------------------------------- |
| `src/data/content.js`        | Every word on the page, and the project schema.                 |
| `src/sections/`              | One file per section, presentation only.                        |
| `src/components/work/`       | The project showcase: `ProjectCase` + `ProjectFrame`.            |
| `src/three/`                 | Everything inside the canvas. Lazy-loaded as its own chunk.      |
| `src/lib/store.js`           | Scroll and pointer state, deliberately outside React.            |
| `index.html`                 | The threshold: the gate that covers the page on a cold load.     |
| `404.html`                   | Built as a second entry, no bundle attached.                     |

## Adding project screenshots

This is the one thing the site is waiting on. Each project in
`src/data/content.js` has an `image` path:

```js
{
  slug: "ats-workplace",
  name: "ATS Workplace",
  image: "/projects/ats-workplace.png",
  imageAlt: "ATS Workplace dashboard showing ranked candidates",
  image2: null,        // optional second capture
  thumb: null,         // optional small crop
  live: "https://…",
  github: null,        // set a URL and a GitHub button appears
}
```

Drop the file into `public/projects/` under that name and it appears. Until
then the frame renders a labelled placeholder at the same 16:10 ratio, so the
layout is already final and nothing shifts when the real asset lands.

Guidance for the captures:

- **16:10, at least 1600×1000.** The featured project renders up to ~1100 CSS
  px wide, so anything smaller will look soft on a retina display.
- **WebP or AVIF** if you can. PNG is fine; just keep it under ~400 KB.
- Capture the **most legible screen**, not the login page. These are the main
  visual anchor of the page.
- Only the featured project's image loads eagerly. The rest are lazy-loaded,
  so adding more projects does not slow the first paint.

## Contact channels

`identity.linkedin` in `content.js` is empty because no LinkedIn URL exists
anywhere in this repository, and guessing one would send people to the wrong
person. Set it and the LinkedIn row appears in the contact section
automatically — rows with an empty `href` are filtered out rather than
rendered as dead links.

## Before deploying

Set `VITE_SITE_URL` in `.env` to the real origin. It is substituted into the
canonical link, the Open Graph tags and the JSON-LD at build time, and all
three need an absolute URL. A canonical pointing at the wrong host is worse
than having none.

## Regenerating images

`public/` holds derived files: the portrait in two widths, the icon set, and
the 1200×630 social card, generated from `public/favicon.svg` and the source
photo rather than hand-exported.

The favicon SVG was recoloured from ember to bronze as part of the revamp.
The raster icons (`favicon.ico`, `icon-192.png`, `icon-512.png`,
`apple-touch-icon.png`) were **not** regenerated — that needs `sharp`, which
is not installed here. Re-run the generation script when convenient so the
PNG icons match the SVG.

The React copy of the mark in `src/components/ui/Sigil.jsx` is separate on
purpose: it scopes its gradient ids per instance, which a shared
document-level copy cannot do.

## Design rules this build follows

- **Fire is lighting, not decoration.** The lava shader keeps most of its
  surface black; only narrow cracks reach ember, and the whole output is
  dimmed by half at the end of the fragment shader.
- **One gradient headline on the page** — the name in the hero. Every other
  heading is flat bone on stone.
- **One effect per component.** The button has a torchlight wash and nothing
  else; the project frame has a cursor spotlight and nothing else.
- **No hover-dependent information.** Every effect that needs a cursor is
  gated on `pointer: fine` or `env.coarsePointer`.

## Things that look like mistakes and are not

- **The threshold lives in `index.html`, not in a component.** It has to be
  painted by the HTML parser. Mounting it from React would put the black flash
  it exists to remove in front of it.
- **Scroll and pointer state are not React state.** They are read from a plain
  object in an animation loop. Scrolling never costs a render.
- **The portrait is cropped to 1.5× and largely desaturated.** The source photo
  is a composite with a painted hellscape behind the subject; at full frame it
  competes with the rest of the page. `CROP` in `PortraitNiche.jsx` can go back
  towards 1 if a cleaner photo replaces it.
- **There is no contact form.** A form with no backend looks like it sent and
  did not.

Reduced motion is a first-class path, not a switch that disables things: the
canvas is never mounted, the gate is dismissed rather than performed, embers
do not render, and every section renders at rest.
