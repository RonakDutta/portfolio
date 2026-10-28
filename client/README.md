# Portfolio, Ronak Dutta

**Totality.** The golden aura of the old build, taken literally: the page is a
total solar eclipse. A live WebGL corona burns around a black moon on the first
screen, the visitor can pull the moon aside with the cursor and make the sun
break through, and the page closes on the same eclipse it opened with.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
npm run lint
```

## The arc of the page

| Section | What happens |
| --- | --- |
| Overture | While the faces load, a moon creeps across a bare sun. At totality the last bead of light flares on the limb, the room goes dark and the eclipse flies onto the hero, where the live corona erupts out of it. Once per session. |
| Hero | The name split around a total eclipse, a ring of the stack turning around the corona. Scrolling away, the halves of the name part and the eclipse holds still and swells until the moon is the whole screen. |
| About | Read inside the moon. The portrait is a sun of its own, in a ring of rays; the visitor lights the face with the pointer. |
| Work | Each capture opens out of a pinhole, rimmed with corona light, as it rises. |
| Skills | The one gold sheet: the sun's limb rising over the dark, flattening as it climbs. Rows eclipse under the pointer. |
| Experience | The dark comes back over the gold as the moon's limb, a lit arc. Years are cut in outline and fill with light. |
| Recognition | Three struck medals that tip toward the pointer. |
| Contact | The eclipse again, between LET'S and TALK. Reading progress in the nav is the same eclipse, reaching totality at the bottom of the page. |

## Where things are

| Path | What it holds |
| --- | --- |
| `src/data/content.js` | Every word on the page, and the project schema. |
| `src/sections/` | One file per section. |
| `src/components/eclipse/EclipseField.jsx` | The corona: one fixed canvas, one fragment shader. |
| `src/components/eclipse/Eclipse.jsx` | An eclipse anchor: the DOM moon, the diamond ring bead, the stack ring, pointer steering and the hero zoom. |
| `src/lib/eclipse.js` | The registry anchors join so the field knows where to draw. |
| `src/components/Curtain.jsx` | Drives the overture `index.html` paints. |
| `src/components/type/` | `Heading` (section titles) and `LitText` (paragraphs read into the light). |
| `src/components/work/ProjectCase.jsx` | One project and its aperture. |
| `src/components/media/LitPortrait.jsx` | The portrait and its aura. |
| `src/components/ui/` | `Button` and `Medal`. |
| `src/components/brand/` | Monogram, nav, and the `PhaseMark` progress eclipse. |
| `src/lib/store.js` | Nav model and the scroll-spy channel, outside React. |
| `404.html` | Built as a second entry, no bundle attached. |

## Type

Two variable families, both with a width axis, self-hosted from
`public/fonts` (Latin subsets, 137 kB together):

- **Mona Sans** for everything that is read. The width axis does the
  expression: section titles pair a condensed hairline word with an expanded
  black one, and the expanded word opens out from condensed as it is revealed
  (`data-reveal="stretch"`, a `font-stretch` transition, not a transform).
- **Martian Mono** for small labels only. Buttons and nav links are set in
  Mona Sans at reading size, in sentence case.

`foil` is the gold: a still raking-light gradient clipped to the type.

## The corona

`EclipseField` draws around whichever registered anchor is nearest the middle
of the screen, and skips the frame entirely when none is near or the moon has
swallowed the viewport. Measured in solar radii from the anchor:

- **Streamers** are simplex noise sampled on the unit circle, so there is no
  seam where the angle wraps, stretched along the radius and pushed outward
  over time. They lean toward the pointer.
- **The moon** is a DOM disc, so its limb is sharp at any pixel density. The
  shader only needs its position, to leave a hole and to expose the
  photosphere when the moon is pulled off centre.
- **The diamond ring** is a bloom and an anamorphic streak from the limb point
  furthest from the moon, plus a crisp DOM bead on the limb that spills over
  the moon's edge.
- **Clicking** near the sun sets off a flare.

The output is premultiplied with alpha equal to its brightest channel, so it
lays light over the page rather than a coloured sheet. Without WebGL the
anchors fall back to a still CSS corona.

## Performance

The rule: nothing that moves on the scroll may repaint. Measured with
Playwright tracing a full scroll in headless Chromium, desktop and a 4x
CPU-throttled phone.

- **The corona** renders at no more than 0.85 canvas pixels per CSS pixel
  (0.6 on a phone), drops resolution on its own if frames run long, skips
  noise far from the sun and inside the moon, and is not drawn at all while no
  eclipse is near the screen. The anchors' per-frame helpers stand down off
  screen too, and read sizes from observers rather than layout.
- **The project aperture** is three transforms: a circular window scaled up
  from a pinhole, the capture inside counter-scaled so it holds still, and the
  ring. The first version animated `clip-path` and the ring's size, which
  repainted the frame and forced a layout every scrolled frame.
- **The portrait light** is a fixed radial mask on a layer that slides with
  the pointer while the lit photograph inside slides back by the same amount.
  Animating the mask position repainted two large images every frame.
- **The Skills arc** is an ink cut-out flattened with `scaleY`, rather than an
  animated `border-radius` over a large textured gradient.
- **Gold foil is a still gradient.** Pinning it to the viewport made the light
  glide as the page moved, and cost about 60% of all paint time on the scroll.
- **The stack ring turns on a wrapper**, not on the `<svg>`, so the rotation
  stays on the compositor.

Reduced motion keeps every surface and stops all of it: no overture, a still
corona, no scrubs.

## Adding project screenshots

Each project in `src/data/content.js`:

```js
{
  slug: "ats-workplace",
  name: "ATS Workplace",
  category: "AI recruitment platform",
  year: "2026",
  featured: true,          // adds the "Featured" tag; layout is unchanged
  image: "/projects/ats-workplace",   // base path, no extension
  imageAlt: "…",
  liveUrl: "https://…",    // also makes the capture itself a link
  githubUrl: null,
}
```

`image` is a **base path with no extension**. `ProjectCase` appends
`-800.webp`, `-1600.webp` and `-fallback.png`, so a new capture has to be run
through the same three sizes. Drop the source PNG in `public/projects/` and:

```js
// one-off, sharp is already a devDependency
import sharp from "sharp";
for (const w of [800, 1600])
  await sharp(src).resize({ width: w }).webp({ quality: 78, effort: 6 })
    .toFile(`${base}-${w}.webp`);
await sharp(src).resize({ width: 1200 }).png({ palette: true })
  .toFile(`${base}-fallback.png`);
```

- **The frame is 2.104:1 at every size**, matching the ratio of the supplied
  browser captures so nothing is ever cropped. On a phone it reaches nearly to
  the screen edges to keep the band legible. If you swap in captures at a
  different ratio, change `aspect-[2.104/1]` in `ProjectCase`.
- Supply at least 1900px wide for the flagship; it fills the full measure.
- Capture the most legible screen, not a login page.
- Do not commit the multi-hundred-kilobyte source PNG. Only the three derived
  files are needed.
- Every capture loads lazily; none is on the first screen.

A missing file renders the project name in place of the capture at the same
ratio, so nothing shifts when the asset lands.

## The contact form

There is no backend, so the form does not pretend to have one. It validates in
the page, then hands a composed message to the visitor's own mail client, and
the success panel shows the exact text it sent with a copy button, so a
blocked `mailto:` is a visible fallback rather than a silent failure.

## Before deploying

Set `VITE_SITE_URL` in `.env` to the real origin. It is substituted into the
canonical link, the Open Graph tags and the JSON-LD at build time.

## Icons

`public/favicon.svg` still carries the previous mark. The RD monogram lives in
`components/brand/Monogram.jsx`; the favicon and the raster set
(`favicon.ico`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) and
`og.jpg` have **not** been regenerated from it.

## Art direction rules

- **Gold is light, not paint.** It is the corona, rims, foil on a word or two
  per screen, and the one gold sheet. Everything else is the dark of the moon.
- **Nothing pulses.** No breathing dots, no shimmering headings, no status
  pills. Motion answers the scroll or the pointer.
- **Nothing is a pill tag.** Stacks are set as text, divided by slashes.
- **No em dashes**, in copy or in comments.
- **Nothing pointer-dependent carries information.** All of it is gated on
  `env.pointerFx` / `env.coarsePointer`.

## Things that look like mistakes and are not

- **The overture lives in `index.html`, not in a component.** It has to be
  painted by the parser; mounting it from React would put the flash it exists
  to remove in front of it.
- **The hero eclipse's moon and ring are hidden by `html.ecl-pending`** until
  the overture's own eclipse has landed on them.
- **Achievements has no nav entry.** The spy holds on Experience while it is on
  screen, which is where it belongs in the reading order.
- **Contact's left column carries `min-w-0`**, and the stack list's items are
  `inline-block`. Without either, one long unbreakable row sets the grid
  track's width and the column runs off a phone screen.
