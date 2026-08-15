# Portfolio — Ronak Dutta

Cinematic dark-luxury personal site. Black is the material, champagne gold is
the jewellery, and the typography carries the identity: Cormorant Garamond for
display, Inter for everything else.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
npm run lint
```

## Where things are

| Path                             | What it holds                                              |
| -------------------------------- | ---------------------------------------------------------- |
| `src/data/content.js`            | Every word on the page, and the project schema.             |
| `src/sections/`                  | One file per section, presentation only.                    |
| `src/components/work/`           | The project showcase: `ProjectCase` + `ProjectFrame`.        |
| `src/components/media/Portrait`  | The hero portrait treatment.                                 |
| `src/components/Atmosphere.jsx`  | The fixed lighting, vignette and grain layers.               |
| `src/lib/store.js`               | Nav model and the scroll-spy channel, outside React.         |
| `index.html`                     | The curtain: the black panels that cover a cold load.        |
| `404.html`                       | Built as a second entry, no bundle attached.                 |

## Adding project screenshots

This is the one thing the site is waiting on. Each project in
`src/data/content.js` carries an `image` path:

```js
{
  slug: "ats-workplace",
  name: "ATS Workplace",
  category: "AI Recruitment Platform",
  featured: true,
  image: "/projects/ats-workplace.png",
  imageAlt: "ATS Workplace dashboard showing ranked candidates",
  secondaryImage: null,
  liveUrl: "https://…",
  githubUrl: null,        // set a URL and a GitHub link appears
}
```

Drop the file into `public/projects/` under that name and it appears. Until
then the plate renders a labelled placeholder at the same ratio, so the layout
is already final and nothing shifts when the real asset lands.

Guidance for the captures:

- **The featured project renders at 16:9, the others at 16:10.** Supply at
  least 2000×1125 for the flagship — it fills the full measure, up to ~1650 CSS
  px on a wide screen.
- **WebP or AVIF** where possible; PNG is fine under ~400 KB.
- Capture the **most legible screen**, not a login page. These plates are the
  main visual anchor of the site.
- Only the featured image loads eagerly. The rest are lazy with
  `fetchpriority="low"`, so adding projects does not slow the first paint.

## The portrait

`public/portrait.jpg` is a composite — the subject stands in front of a painted
fantasy landscape. The treatment in `src/components/media/Portrait.jsx` crops
hard to head and shoulders and takes the plate to monochrome, which is both the
house style for this kind of campaign portrait and what makes the remaining
background read as a dark studio.

Two dials, derived from the source geometry (1000×1250, head at ~30–68% of
frame height):

```js
const CROP = 1.30;            // scale about ORIGIN
const ORIGIN = "50% 91%";     // lands a window on y 262-1225 / x 115-885
```

The radial vignette in the same file is centred at 37% of the plate height to
sit on the face — **if you change `CROP`, move the vignette with it**, or the
falloff will eat the subject.

With a clean studio photograph: drop `CROP` towards 1, cut the `grayscale(1)`,
and re-centre the vignette.

## Contact channels

`identity.linkedin` is empty because no LinkedIn URL exists anywhere in this
repository, and guessing one would send people to the wrong person. Set it and
the LinkedIn row appears automatically — rows with an empty `href` are filtered
out rather than rendered as dead links.

## Before deploying

Set `VITE_SITE_URL` in `.env` to the real origin. It is substituted into the
canonical link, the Open Graph tags and the JSON-LD at build time, and all
three need an absolute URL.

## Icons

`public/favicon.svg` was redrawn for this identity (black field, hairline gold
rule, RD monogram). The raster icons — `favicon.ico`, `icon-192.png`,
`icon-512.png`, `apple-touch-icon.png` — and `og.jpg` were **not** regenerated;
that needs `sharp`, which is not installed here. Re-run the generation script
so they match.

## Art direction rules this build follows

- **Gold is jewellery, not paint.** It appears on hairlines, eyebrow labels,
  the active nav indicator, one solid CTA per screen, and the word "Together".
  Nowhere else.
- **One gradient headline** — the hero name, and it is ivory falling into
  shadow rather than a colour ramp.
- **Two effects per component, maximum.** The plate has a 1.5% zoom and a
  cursor highlight; the button has a magnetic pull capped at 6px. That is the
  whole interaction vocabulary.
- **Four keyframe animations exist** in `index.css`. If a fifth is needed,
  something else should probably go.
- **No hover-dependent information.** Everything needing a cursor is gated on
  `env.pointerFx` or `env.coarsePointer`.

## Things that look like mistakes and are not

- **The curtain lives in `index.html`, not in a component.** It has to be
  painted by the parser; mounting it from React would put the flash it exists
  to remove in front of it. It also holds until `document.fonts.ready`, so the
  display serif never swaps in view.
- **There is no WebGL.** The previous build ran a three.js scene; it was
  specific to an art direction that no longer exists, and removing it took
  233 kB gzip off the bundle. `Atmosphere.jsx` does the same job in three
  composited layers.
- **Recognition has no nav entry.** The scroll spy holds on Experience through
  it, which is where it belongs in the reading order.
- **There is no contact form.** A form with no backend looks like it sent and
  did not.

Reduced motion is a first-class path: the curtain is dismissed rather than
performed, every GSAP timeline is skipped, the key light stops drifting, and
each section renders at rest.
