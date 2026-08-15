# Portfolio — Ronak Dutta

A warm near-black stage, brass rather than bullion, and one paper-white sheet
cut into the middle of the scroll. Type does the work: Fraunces for display,
Ephesis for the cursive accents, Instrument Sans for reading, JetBrains Mono
for the micro-labels.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
npm run lint
```

## Where things are

| Path                         | What it holds                                                    |
| ---------------------------- | ---------------------------------------------------------------- |
| `src/data/content.js`        | Every word on the page, and the project schema.                   |
| `src/sections/`              | One file per section, presentation only.                          |
| `src/components/atmosphere/` | Aurora, ribbons, dust, geometry, and the stack that composes them. |
| `src/components/fx/`         | Cursor, sparkle field, magnetic hover.                            |
| `src/components/brand/`      | The RD monogram and the nav.                                      |
| `src/components/projects/`   | `ProjectShowcase` + `ProjectPlate`.                               |
| `src/components/media/`      | The hero portrait treatment.                                      |
| `src/lib/store.js`           | Nav model and the scroll-spy channel, outside React.              |
| `public/fonts/`              | The four self-hosted variable faces.                              |
| `index.html`                 | The overture that covers a cold load.                             |
| `404.html`                   | Built as a second entry, no bundle attached.                      |

## Type

Four variable faces, latin subsets, self-hosted from `public/fonts` — 164 kB
total. They used to come from Google Fonts, which cost a preconnect, a
render-blocking stylesheet and a second origin on the critical path. The
`@font-face` block is at the top of `src/index.css`; `index.html` preloads the
three the first screen sets type in.

There is no italic face. `font-style: italic` anywhere in this project would
be synthesised by the browser, so nothing asks for it.

| Token            | Face            | Used for                                    |
| ---------------- | --------------- | ------------------------------------------- |
| `--font-display` | Fraunces        | Every heading, the ledger values, the ticker |
| `--font-script`  | Ephesis         | Accent words only — never a whole line       |
| `--font-sans`    | Instrument Sans | Body copy, form fields                       |
| `--font-mono`    | JetBrains Mono  | Eyebrows, indices, counters, errors          |

Ephesis sets a very narrow word space; the `script` utility widens it, or two
words run together and read as one.

## The atmosphere

`components/atmosphere/Atmosphere.jsx` is one fixed stack behind every section,
so the page reads as a single continuous room rather than as a run of sections
that each brought their own background. Bottom to top: warm near-black
foundation, off-centre graphite depth, a blurred key light, the aurora, light
ribbons at a quarter strength, metallic dust and glints, a low bloom, then
vignette and grain.

Everything is CSS, SVG or a 2D canvas — **there is no WebGL**. Reduced motion
keeps every layer and stops all of them; phones get a thinner dust field, which
is the only layer with a real per-frame cost.

## The paper section

Skills is the one light section, and it is deliberate: a dark portfolio that
stays dark for six screens reads as one long gradient. It is an opaque sheet
(`paper` utility) sitting above the fixed atmosphere at `z-10`, with a
multiply-blended noise overlay for tooth and a shadow on both edges so it
reads as laid on the page rather than punched through it.

`SectionTitle` takes `tone="paper"` to flip its colours for it.

## The portrait

Two earlier treatments of `public/portrait.jpg` failed the same way. A
bordered, vignetted, gold-washed plate put a second dark edge inside a dark
edge and laid a warm cast over one side of the face. Dissolving all four edges
into the page instead only moved the problem: the set it was shot on is a
different black from the one this page is lit in, so a rectangle stayed visible
whichever way the values fell.

So the edge is deliberate. An arch, a single brass hairline along it, and the
foot of it dissolving into the page. The only grade left is a touch of
contrast — no tint over skin. Swapping the photograph needs nothing changed
unless the crop moves the head far off centre, in which case adjust
`object-top`.

## The custom cursor

`components/fx/Cursor.jsx` — a brass bead, a ring that lags, a label taken from
`data-cursor` on whatever is under it, a spark burst on click, and a sparkle
trail. Hover state is resolved from the event target, so anything added later
is picked up for free.

It only mounts for `env.pointerFx` (fine pointer, no reduced-motion request),
and `has-cursor` is only put on `<html>` once it is actually running, so a
failure can never leave a visitor with no pointer at all. Inputs keep the text
caret.

## Adding project screenshots

Each project in `src/data/content.js`:

```js
{
  slug: "ats-workplace",
  name: "ATS Workplace",
  category: "AI Recruitment Platform",
  year: "2026",
  featured: true,          // adds the "Featured" tag; layout is unchanged
  image: "/projects/ats-workplace.png",
  imageAlt: "…",
  liveUrl: "https://…",    // also makes the capture itself a link
  githubUrl: null,         // set a URL and a Source button appears
}
```

- **The plate is 2.104:1 on `sm` and up**, matching the ratio of the supplied
  browser captures so nothing is cropped. Phones drop to 4:3 with a centre
  crop, since a 2:1 band is too short to read as a product shot. If you swap in
  captures at a different ratio, change `aspect-[2.104/1]` in `ProjectPlate`.
- Supply at least 1900px wide for the flagship; it fills the full measure.
- Capture the most legible screen, not a login page.
- Only the featured image loads eagerly; the rest are lazy with
  `fetchpriority="low"`.

A missing file renders a labelled placeholder at the same ratio, so the layout
is already final and nothing shifts when the asset lands.

## The contact form

There is no backend, so the form does not pretend to have one. It validates in
the page, then hands a composed message to the visitor's own mail client, and
the success panel shows the exact text it sent with a copy button — so a
blocked `mailto:` is a visible fallback rather than a silent failure. The note
under the button says so before anyone types.

## Before deploying

Set `VITE_SITE_URL` in `.env` to the real origin. It is substituted into the
canonical link, the Open Graph tags and the JSON-LD at build time.

## Icons

`public/favicon.svg` still carries the previous mark. The RD monogram lives in
`components/brand/Monogram.jsx`; the favicon and the raster set
(`favicon.ico`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) and
`og.jpg` have **not** been regenerated from it.

## Art direction rules

- **Brass is light and metal, not paint.** It appears as aurora, rim light,
  hairlines, the nav marker and one solid CTA per screen. Large fields stay
  near-black or paper.
- **Ember is for state, never decoration** — the availability dot, form errors.
- **Nothing animates its own fill.** The old build swept a gradient across
  every heading on a timer; a page of shimmering type is the most recognisable
  generated-portfolio tell there is.
- **Rules are a last resort.** Sections used to open with a hairline and
  separate every row with another, and the page read as ruled rather than
  designed. Experience hangs off one vertical line; About, Achievements and the
  channel list use space instead.
- **Two interactions per component, maximum.**
- **Nothing pointer-dependent carries information.** All of it is gated on
  `env.pointerFx` / `env.coarsePointer`.

## Things that look like mistakes and are not

- **The overture lives in `index.html`, not in a component.** It has to be
  painted by the parser; mounting it from React would put the flash it exists
  to remove in front of it. It holds until `document.fonts.ready`, so the
  display faces never swap in view, and it performs once per session.
- **Achievements has no nav entry.** The spy holds on Experience while it is on
  screen, which is where it belongs in the reading order.
- **`Words` splits headings into per-word spans but keeps the spaces as real
  text nodes.** The line still wraps, and it still copies as a sentence.
- **Every project uses the same layout.** Mirroring image and text on
  alternating rows is the most recognisable portfolio template there is; the
  variety comes from which side the sheet is inset on instead.
- **Contact's left column carries `min-w-0`.** Without it the email row sets
  the grid track's width and the whole column grows past a phone viewport.
