# Portfolio — Ronak Dutta

Cinematic black-and-gold personal brand site. Deep black is the stage, a full
gold spectrum is the light, and the identity is carried by the RD monogram
rather than by a name set in 200px type.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
npm run lint
```

## Where things are

| Path                              | What it holds                                          |
| --------------------------------- | ------------------------------------------------------ |
| `src/data/content.js`             | Every word on the page, and the project schema.         |
| `src/sections/`                   | One file per section, presentation only.                |
| `src/components/atmosphere/`      | Aurora, ribbons, dust, geometry, and the stack that composes them. |
| `src/components/brand/`           | The RD monogram and the nav.                            |
| `src/components/projects/`        | `ProjectShowcase` + `ProjectPlate`.                     |
| `src/components/media/`           | The hero portrait treatment.                            |
| `src/lib/store.js`                | Nav model and the scroll-spy channel, outside React.    |
| `index.html`                      | The curtain that covers a cold load.                    |
| `404.html`                        | Built as a second entry, no bundle attached.            |

## The atmosphere

`components/atmosphere/Atmosphere.jsx` is one fixed stack behind every
section, so the page reads as a single continuous room rather than as a run
of sections that each brought their own background. Bottom to top: near-black
foundation, off-centre graphite depth, a blurred key light, the aurora, light
ribbons, metallic dust, a low bloom, then vignette and grain.

Everything is CSS, SVG or a 2D canvas — **there is no WebGL**. The aurora is
three very large blurred gradient fields on independent cycles, composited
with `screen`; the ribbons are four SVG beziers with a gradient stroke on a
slow shear; the dust is ~46 motes on a canvas that suspends itself when the
tab is hidden or the field scrolls out of view.

Degradation is explicit in `Atmosphere.jsx`:

- **reduced motion** — every layer still renders, all of them stop. The room
  stays lit, it stops moving.
- **`env.lightweight`** (≤4 cores or ≤4 GB) — ribbons and dust are dropped,
  aurora drops to 70%. Those are the only two layers with a real cost.
- **mobile** — dust halves to 22 motes.

## The hero

Role first, name second, per the brief. The name appears in the monogram, the
document title, the `sr-only` sentence inside the `h1`, and one line of
metadata in the footer rail — nowhere at display size. `hero.lead` renders in
`text-ivory-lit` and `hero.accent` in `text-foil`; that two-tone split is the
house move and every section masthead repeats it.

## Adding project screenshots

Each project in `src/data/content.js`:

```js
{
  slug: "ats-workplace",
  name: "ATS Workplace",
  category: "AI Recruitment Platform",
  featured: true,
  image: "/projects/ats-workplace.png",
  imageAlt: "…",
  secondaryImage: null,
  liveUrl: "https://…",
  githubUrl: null,        // set a URL and a GitHub link appears
}
```

The three current captures are in place. Guidance for replacing them:

- **The plate is 2.104:1 on `sm` and up**, matching the ratio of the supplied
  browser captures so nothing is cropped. Phones drop to 4:3 with a centre
  crop, since a 2:1 band is too short to read as a product shot. If you swap
  in captures at a different ratio, change `aspect-[2.104/1]` in
  `ProjectPlate` to match — otherwise `object-cover` will crop them.
- Supply at least 1900px wide for the flagship; it fills the full measure.
- Capture the most legible screen, not a login page.
- Only the featured image loads eagerly; the rest are lazy with
  `fetchpriority="low"`.

A missing file renders a labelled placeholder at the same ratio, so the
layout is already final and nothing shifts when the asset lands.

## The portrait

`public/portrait.jpg` is a composite — the subject stands in front of a
painted fantasy landscape. `PortraitPlate.jsx` crops hard to head and
shoulders, desaturates to near-monochrome, then relights: champagne rim from
the upper right, cold bounce from the lower left, studio falloff to black.
What survives of the background reads as a dark set.

```js
const CROP = 1.3;           // scale about ORIGIN
const ORIGIN = "50% 91%";   // window on y 262-1225 / x 115-885
```

The radial falloff is centred at 36% of the plate height because that is
where the face lands under this crop. **Change `CROP` and you must move the
falloff with it**, or it will eat the subject. With a clean studio photograph:
drop `CROP` towards 1, cut the grayscale, recentre.

## Contact channels

`identity.linkedin` is empty because no LinkedIn URL exists anywhere in this
repository, and guessing one would send people to the wrong person. Set it and
the row appears — rows with an empty `href` are filtered rather than rendered
as dead links.

## Before deploying

Set `VITE_SITE_URL` in `.env` to the real origin. It is substituted into the
canonical link, the Open Graph tags and the JSON-LD at build time.

## Icons

`public/favicon.svg` still carries the previous mark. The RD monogram now
lives in `components/brand/Monogram.jsx`; the favicon and the raster set
(`favicon.ico`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) and
`og.jpg` have **not** been regenerated from it — that needs `sharp`, which is
not installed here.

## Art direction rules

- **Gold is light and metal, not paint.** It appears as aurora, ribbons, foil
  type, rim light on the portrait and the project bezels, the nav filament,
  and one solid CTA per screen. Large fields stay black.
- **Two tones per masthead**: one line ivory, one line foil. Never both, never
  neither.
- **Two interactions per component, maximum.** The plate has a 1.5% zoom and a
  cursor highlight; the button has a light sweep and a 7px magnetic pull.
- **Nothing pointer-dependent carries information.** All of it is gated on
  `env.pointerFx` / `env.coarsePointer`.

## Things that look like mistakes and are not

- **The curtain lives in `index.html`, not in a component.** It has to be
  painted by the parser; mounting it from React would put the flash it exists
  to remove in front of it. It holds until `document.fonts.ready`, so the
  display serif never swaps in view.
- **Achievements has no nav entry.** The spy holds on Experience while it is
  on screen, which is where it belongs in the reading order.
- **`SectionTitle` has a `{" "}` between its two lines.** They are block
  spans; without it the accessible name reads "TechnicalIndex".
- **There is no contact form.** A form with no backend looks like it sent and
  did not.
