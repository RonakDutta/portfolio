# Descent

Ronak Dutta's portfolio. Six chambers and one continuous fall, with scroll
position driving every layer of the scene at once.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
npm run lint
```

## Where things are

| Path                       | What it holds                                                 |
| -------------------------- | ------------------------------------------------------------- |
| `src/data/content.js`      | Every word on the page. Sections are presentation only.        |
| `src/sections/`            | The six chambers, one file each.                               |
| `src/three/`               | Everything inside the canvas. Lazy-loaded as its own chunk.    |
| `src/lib/store.js`         | Scroll and pointer state, deliberately outside React.          |
| `src/lib/infernalAudio.js` | The ambience, synthesised at runtime. No audio files.          |
| `index.html`               | The threshold: the gate that covers the page on a cold load.   |
| `404.html`                 | Built as a second entry, no bundle attached.                   |

Editing your details should never mean touching a component. The projects and
timeline arrays render at any length, and the roman numerals renumber
themselves.

## Before deploying

Set `VITE_SITE_URL` in `.env` to the real origin. It is substituted into the
canonical link, the Open Graph tags and the JSON-LD at build time, and all
three need an absolute URL. A canonical pointing at the wrong host is worse
than having none.

## Regenerating images

`public/` holds derived files: the portrait in two widths, the icon set, and
the 1200×630 social card. They are generated rather than hand-exported, so
replacing the photo means re-running the script rather than opening an editor.
It needs `sharp`, and the card needs Cinzel available to fontconfig.

The source of the mark is `public/favicon.svg`. Everything else — the icons,
the `.ico`, the sigil inlined into the threshold by the `inline-sigil` plugin
in `vite.config.js` — is cut from that one file. The React copy in
`src/components/ui/Sigil.jsx` is separate on purpose: it scopes its gradient
ids per instance, which a shared document-level copy cannot do.

## Things that look like mistakes and are not

- **The threshold lives in `index.html`, not in a component.** It has to be
  painted by the HTML parser. Mounting it from React would put the black flash
  it exists to remove in front of it.
- **Scroll and pointer state are not React state.** They are read from a plain
  object in an animation loop. Scrolling never costs a render.
- **Fonts load without blocking the render.** The swap happens while the gate
  is still shut, so nobody sees it.
- **There is no contact form.** A form with no backend looks like it sent and
  did not.

Reduced motion is a first-class path, not a switch that disables things: the
canvas is never mounted, the gate is dismissed rather than performed, and every
section renders at rest.
