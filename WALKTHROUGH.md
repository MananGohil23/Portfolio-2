# Portfolio — Developer Walkthrough

A hand-collaged, torn-paper portfolio for **Manan Gohil**. Built with **React 19 + Vite + Tailwind CSS v4**, no other runtime dependencies.

This document explains the architecture, every file, how the "paper craft" visual system works, and how to change content safely. It assumes you know React and basic CSS, but not this codebase.

---

## 1. Quick start

```bash
npm install      # install dependencies
npm run dev      # start dev server (Vite, http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

There is **no test suite**. "Verification" means `npm run lint` + `npm run build` both pass, and the page renders.

---

## 2. Mental model

Three ideas carry the whole project:

1. **One data file, dumb components.** All text, links, images and accent colours live in `src/data/resume.js`. Section components just read from it and render. To change the site's content you almost never touch a `.jsx` file.

2. **A reusable "paper craft" CSS layer.** Torn edges, grain, tape and stickers are plain CSS classes (defined in `src/index.css`) plus three shared SVG filters (defined once in `SvgDefs.jsx`). Components compose those classes rather than inventing their own styling.

3. **Content is placed on layered sheets.** Most visual elements are a `PaperCard`: an absolutely-positioned torn-paper background with a crisp content layer on top. The displacement filter that makes edges ragged is applied **only to the background layer**, so text is never warped.

```
resume.js  ──►  Section component  ──►  PaperCard / Carousel / Marquee
 (data)          (structure)              (visual primitives)
                                          ▲
                              index.css + SvgDefs  (paper craft system)
```

---

## 3. Project structure

```
Portfolio/
├─ index.html                 # HTML shell: fonts, <title>, meta, #root
├─ vite.config.js             # Vite + React + Tailwind plugins
├─ package.json               # scripts + deps
├─ WALKTHROUGH.md             # this file
├─ public/                    # static assets served at "/" (NOT bundled/hashed)
│  ├─ MananGohil.jpg          #   portrait (1000x1250, 4:5)
│  ├─ Manan_Gohil_Resume.pdf  #   downloadable résumé
│  ├─ favicon.svg
│  ├─ edudash1..4.png         #   project screenshots (carousels)
│  ├─ sugar1..4.png
│  └─ express1..2.png
└─ src/
   ├─ main.jsx                # React entry -> renders <App/> in StrictMode
   ├─ App.jsx                 # page composition (order of sections)
   ├─ index.css               # THE design system (tokens + paper utilities)
   ├─ data/
   │  └─ resume.js            # single source of truth for all content
   └─ components/
      ├─ SvgDefs.jsx          # torn-edge filters + doodle icons
      ├─ PaperCard.jsx        # torn sheet of paper w/ crisp content
      ├─ Reveal.jsx           # scroll-in animation wrapper
      ├─ Slot.jsx             # "add your input" placeholder renderer
      ├─ SectionHeading.jsx    # shared section title block
      ├─ Marquee.jsx          # full-bleed scrolling torn-paper band
      ├─ Carousel.jsx         # project image carousel
      ├─ Nav.jsx              # fixed top nav + mobile menu
      ├─ Hero.jsx             # landing section
      ├─ About.jsx            # bio + education
      ├─ Projects.jsx         # project collage w/ carousels
      ├─ Experience.jsx       # hand-drawn timeline
      ├─ Skills.jsx           # skill group cards
      ├─ Contact.jsx          # CTA + social links
      └─ Footer.jsx           # footer note + links
```

> **`public/` vs imports:** everything in `public/` is copied verbatim to the site root and referenced by URL string (e.g. `'/MananGohil.jpg'`). It is **not** hashed or optimised by Vite, and it **is** shipped even if unused — keep it lean.

---

## 4. Entry points

### `index.html`
The HTML shell. It loads three Google Fonts and sets `<title>` and meta. Fonts map to CSS tokens:

| Font | Token | Used for |
|---|---|---|
| **Anton** | `--font-display` | huge uppercase headlines (`font-display`) |
| **Caveat** | `--font-hand` | handwritten accents (`font-hand`) |
| **Space Grotesk** | `--font-sans` | body text (default) |

### `src/main.jsx`
Standard React 19 entry. Mounts `<App/>` into `#root` inside `<StrictMode>` and imports `./index.css` (which is what pulls in Tailwind).

### `vite.config.js`
Registers `@vitejs/plugin-react` and `@tailwindcss/vite`. Tailwind v4 needs **no** `tailwind.config.js` — configuration is done in CSS via `@theme` (see §6).

---

## 5. The data layer — `src/data/resume.js`

This is the only file you normally edit. It exports plain objects/arrays plus two helpers.

### The `TODO` placeholder system

```js
export const TODO = 'TODO'
const isPlaceholder = (value) =>
  value === TODO || (typeof value === 'string' && value.startsWith(TODO))
export { isPlaceholder }
```

Any value set to `TODO` (or a string starting with `"TODO"`) is treated as "waiting for input". The `<Slot>` component renders a dashed `✎ add your input` chip instead of the value. Fill the value in and the chip disappears — **no component changes needed**.

Currently every field is filled, so no slots render, but the mechanism remains for future edits.

### Exports

| Export | Shape | Consumed by |
|---|---|---|
| `profile` | `{ name, initials, firstName, lastName, location, tagline, role, photo, resumeFile, available, bio[] }` | Nav, Hero, About, Contact, Footer |
| `contact` | `{ email, phone, phoneHref, linkedin, linkedinLabel, github, githubLabel, twitter, twitterLabel }` | Contact, Footer |
| `stats` | `[{ label, value }]` | Hero (CGPA / Graduating / JEE) |
| `projects` | `[{ id, title, subtitle, context, accent, year, images[], live, repo, tags[], points[] }]` | Projects → Carousel |
| `experience` | `[{ role, org, period, accent, points[] }]` | Experience |
| `education` | `[{ degree, school, period, detail }]` | About |
| `skillGroups` | `[{ label, accent, items[] }]` | Skills |
| `marqueeSkills` | `string[]` | App (top marquee) |
| `nav` | `[{ label, href }]` | Nav |

### `accent`
`accent` is a **key**, not a class: one of `mustard`, `coral`, `cobalt`, `teal`, `plum`. Each component maps the key to concrete Tailwind classes via a local `ACCENT` / `DOT` lookup object (e.g. `Projects.jsx`, `Carousel.jsx`, `Skills.jsx`).

> **Why lookup objects instead of string interpolation?** Tailwind scans source code for *complete* class names. Building `bg-${accent}` at runtime produces classes Tailwind can't see, so they get purged. Always list full class strings in a map.

### `images` (per project)
An array of URL strings. In `Projects.jsx` it is defensively normalised:

```js
const images = Array.isArray(project.images)
  ? project.images.filter((src) => typeof src === 'string' && !src.startsWith(TODO))
  : []
```

If the result is empty, the project shows a `<Slot>` placeholder instead of a carousel.

---

## 6. The design system — `src/index.css`

This file is the visual heart of the project. It has four parts.

### 6.1 Design tokens (`@theme`)
Tailwind v4's `@theme` block turns CSS custom properties into real utilities. Defining `--color-coral: #e4572e` gives you `bg-coral`, `text-coral`, `border-coral`, `bg-coral/50`, etc. **automatically**. Same for fonts (`--font-display` → `font-display`).

Palette: `paper`, `paper-2`, `paper-3` (cream), `ink`, `ink-soft` (near-black), and five accents `coral`, `mustard`, `cobalt`, `teal`, `plum`.

To restyle the whole site, change these tokens here — not the components.

### 6.2 Base styles (`@layer base`)
- Body gets the paper colour plus three soft radial "ink wash" gradients (`background-attachment: fixed` so they don't scroll).
- `overflow-x: hidden` on `<body>` is important — several decorative elements intentionally overflow horizontally.
- `section[id] { scroll-margin-top: 5.5rem }` keeps anchor links clear of the fixed nav.
- `::selection` uses the coral/paper palette.

### 6.3 Paper-craft utilities
These are the composable classes used everywhere:

| Class | Effect |
|---|---|
| `.paper` | the sheet: paper colour + fine turbulence-grain background |
| `.paper-2` | a slightly darker sheet tone |
| `.grain::after` | paints grain **on top** of an element (multiply blend, low opacity) |
| `.torn-sm` / `.torn-md` / `.torn-lg` | applies an SVG displacement filter + drop shadow (ragged edges) |
| `.torn-flat` | torn filter with **no** shadow (for inline stickers/stamps) |
| `.tape` | translucent yellow washi tape with soft ends (CSS mask) |
| `.sticker` | inline torn label (paper bg, small shadow) |
| `.stamp` | bold bordered button with a hard offset shadow |
| `.ink-underline` | coral scribble underline drawn with a background SVG |
| `.stitch-border` | dashed "stitched" border |

The grain and paper textures are inline **data-URI SVGs** using `feTurbulence` noise — no image files required.

### 6.4 Motion
Keyframes + utility classes: `.animate-marquee`, `.animate-floaty`, `.animate-drift`, `.animate-wiggle`, and the scroll-reveal classes `.reveal` / `.reveal.is-visible`.

The reveal uses two CSS variables so each element can have its own timing/tilt:
- `--reveal-delay` — transition delay
- `--reveal-tilt` / `--reveal-tilt-rest` — rotation before/after reveal

A `@media (prefers-reduced-motion: reduce)` block disables all looping animations and makes reveals instant. Respect it when adding new motion.

---

## 7. SVG filters & doodles — `src/components/SvgDefs.jsx`

Rendered once in `App.jsx`. It contains:

- **Three filters** with `<feTurbulence>` + `<feDisplacementMap>`: `#torn-sm`, `#torn-md`, `#torn-lg`. Each filter randomly displaces pixels, which turns a straight rectangle edge into a ragged tear. Increasing `scale` and lowering `baseFrequency` = bigger, more dramatic tears. To make a new tear size, add a filter here **and** a matching `.torn-*` class in `index.css`.
- **Doodle components**: `DoodleArrow`, `DoodleStar`, `DoodleSquiggle`, `DoodleSplash`, `Scribble`. All are `currentColor` SVGs, so you colour them with a normal `text-*` class and size with `w-*`.

> **Key technique:** the filter is only ever applied to a *background layer*, never to a container holding text. A displacement filter on text would make it wavy/blurry. This is why `PaperCard` separates background from content.

---

## 8. Reusable building blocks

### `PaperCard.jsx`
The core visual primitive: a sheet of torn paper with crisp content on top.

```jsx
<PaperCard torn="md" tone="soft" tilt={-1.5} tapes={[{ top: '-1rem', left: '2rem', rotate: -5 }]}>
  ...content...
</PaperCard>
```

Structure it renders:
1. Outer `<Tag>` — `relative`, optional `rotate(tilt)`.
2. **Background layer** — `absolute inset-0` with `.paper` + a `.torn-*` class. This is the only thing that gets the displacement filter (and its drop shadow).
3. **Tape spans** — absolutely positioned from the `tapes` array.
4. **Content layer** — `relative z-10`, so it always sits above the paper and tape.

Props: `torn` (`sm|md|lg|flat`), `tone` (`base|soft`), `tilt` (deg), `tapes[]`, `as` (element type), plus passthrough `className`/`style`/rest.

### `Reveal.jsx`
Scroll-in wrapper using `IntersectionObserver` (threshold `0.15`, unobserve after firing so it animates once).

- Initial `visible` state is derived lazily: `useState(() => typeof IntersectionObserver === 'undefined')` — SSR/old-browser safe and avoids `setState` inside the effect (which the linter flags).
- Writes `--reveal-delay` and the two tilt variables consumed by `.reveal` in CSS.
- Props: `tilt`, `delay`, `as`, `className`.

### `Slot.jsx`
Renders its `value` normally, or a dashed **"✎ add your input"** chip when the value is a `TODO` placeholder. Uses `isPlaceholder` from `resume.js`. Used for photos, images, links and résumé file.

### `SectionHeading.jsx`
Shared section title: an angled accent bar, an index label (e.g. `"02 — Work"`), the big `font-display` title, and a handwritten kicker. Props: `index`, `title`, `kicker`, `accent`, `align` (`left|center`).

### `Marquee.jsx`
Full-bleed torn-paper band of endlessly scrolling words.

Two-layer trick:
- The track renders the item list **twice** (`[...items, ...items]`) and `@keyframes marquee` translates it `-50%`. Because the second copy exactly follows the first, the loop is seamless.
- The outer wrapper uses `overflow-x: clip; overflow-y: visible`, and the band itself is `w-[112%] -mx-[6%]`, rotated by `tilt`. The overhang ensures the tilt never reveals gaps at the screen edges; clipping only horizontally ensures the rotated band's **full height** stays visible.

Props: `items`, `tilt` (deg), `tone` (`ink|coral`), `className`.

> **Two bugs fixed here, don't reintroduce them:** (1) never combine Tailwind `-translate-x-1/2` with an inline `transform: translateX(-50%)` — in Tailwind v4 translate uses the separate `translate` property, so both apply and the band shifts 100% instead of 50%; (2) never use `overflow-hidden` on the wrapper — transforms don't add layout height, so it clips the tilted band's corners and the strip looks broken.

### `Carousel.jsx`
Project image carousel, styled to match the paper theme.

- **Sliding track:** images sit in a flex row, each `min-w-full`; the track is translated `translateX(-index * 100%)` with a 500ms ease.
- **Controls:** prev/next "stamp" buttons, diamond dot indicators, and an `n / count` counter sticker.
- **Interaction:** autoplay (default 5000ms, disabled when there's only one image), paused on hover/focus; pointer drag swipes; left/right arrow keys work; the region is keyboard-focusable.
- **Accessibility:** `role="region"`, `aria-roledescription="carousel"`, `aria-label`, per-image alt text, labelled buttons, `aria-current` on the active dot.
- First image loads `eager`, the rest `lazy`; images are `draggable={false}` so drag-swipe doesn't ghost-drag.
- Props: `images`, `alt`, `accent`, `autoplay`, `interval`.

---

## 9. Section components

Order of sections is defined in `App.jsx`, not in each component.

### `Nav.jsx`
Fixed header over a paper strip (`.paper .torn-flat`). Adds a shadow/pacity shift after scrolling `>24px` (passive scroll listener, cleaned up on unmount). Shows the `MG` stamp logo, desktop links from `nav`, a Résumé download button (or Slot if the file is `TODO`), and a mobile `≡` toggle that opens a torn paper menu.

### `Hero.jsx`
Landing section. Background doodles (`DoodleSplash`, `DoodleStar`) float/drift; the name is huge `font-display` with a `Scribble` underline; `stats` render as rotated stickers. The portrait uses `profile.photo` inside a `PaperCard` polaroid; if `photo` is a placeholder it shows a `<Slot>`.

### `About.jsx`
Bio paragraphs from `profile.bio` on a large torn sheet, plus location/class/availability stickers and an education list from `education`. A decorative `DoodleStar` sits at the top-left; the bio text is `relative z-10` so it renders **above** the star (the star peeks out from behind the text).

### `Projects.jsx`
Maps `projects` to `ProjectCard`. Each card alternates tilt/tape side (`index % 2`), renders the `Carousel` (or a Slot when there are no images) inside a bordered `aspect-[16/10]` frame, then the title/subtitle, bullet points, tag stickers, and conditional `live` / `repo` links (only rendered when the value exists). Accent classes come from the local `ACCENT` map.

### `Experience.jsx`
Vertical timeline. A dashed spine runs down the centre on desktop; each entry alternates left/right (`index % 2`) with a rotated diamond node coloured by `accent`, and on the left column the bullets mirror to right-aligned.

### `Skills.jsx`
Maps `skillGroups` to `PaperCard`s; each group has an accent bar, a `DoodleSquiggle`, and a wrap of sticker items.

### `Contact.jsx`
Centered `SectionHeading` plus a taped `PaperCard` with the email/phone CTA stamps and LinkedIn / GitHub / X sticker links, with doodles in the corners. The X link falls back to a `Slot` if `contact.twitter` is `TODO`.

### `Footer.jsx`
Paper footer with the name in `font-hand`, a short note, quick links, and a dynamic copyright year.

---

## 10. App composition & layering

`App.jsx` assembles everything:

```
<div relative min-h-screen>
  <SvgDefs />                                  # filters + doodles (invisible)
  <div fixed inset-0 z-[60] grain />           # page-wide paper grain overlay
  <Nav />                                      # fixed, z-50
  <main relative>
    <Hero/>
    <Marquee items={marqueeSkills}    tilt={-1.6} tone="ink"   />
    <About/>
    <Marquee items={[…taglines…]}     tilt={1.4}  tone="coral" />
    <Projects/><Experience/><Skills/><Contact/>
  </main>
  <Footer/>
</div>
```

**Z-index model** (low → high):
- page background — body gradients
- content layers — `z-10` inside PaperCards
- **fixed page grain** — `z-[60]`, `pointer-events-none`
- fixed Nav — `z-50`

> Note: the global grain is intentionally above the Nav (`60 > 50`) so grain sits over everything; it's `pointer-events-none` so it never blocks clicks. If you add UI that must sit above the grain, use `z-[70]+`.

---

## 11. Accessibility

- **Motion:** `prefers-reduced-motion` disables marquees, floats and reveals.
- **Carousel:** keyboard arrows, focusable region, labelled controls, `aria-current`, alt text per slide.
- **Decorative art:** doodles and background layers are `aria-hidden`.
- **Nav:** hamburger has `aria-expanded` + `aria-label`.
- **Contrast:** near-black `ink` on cream `paper`; accent colours are used for decoration/emphasis, not long body text.

When adding interactive elements, follow these patterns (real `<button>`, labels, reduced-motion).

---

## 12. Recipes (common changes)

**Change any text/link/date** → edit `src/data/resume.js`.

**Add a project**
1. Append an object to `projects` (copy an existing one; keep a unique `id`).
2. Set `images: ['/your1.png', '/your2.png']` after dropping the files in `public/`.
3. Pick an `accent` key.

**Swap the portrait** → replace `public/MananGohil.jpg` (keep it ~4:5, e.g. 1000×1250) or point `profile.photo` elsewhere.

**Update the résumé** → replace `public/Manan_Gohil_Resume.pdf` (or change `profile.resumeFile`).

**Add a skill / experience / education entry** → append to the matching array; `accent` is optional but should be one of the five keys.

**Recolour the site** → change the `--color-*` tokens in `src/index.css` (`@theme`).

**Change marquee speed / direction** → `.animate-marquee` duration in `index.css`; direction via `tilt` in `App.jsx`.

**Remove a placeholder slot** → just fill the value. To add a new one, set the value to `TODO`.

**Make a marquee level** → pass `tilt={0}` from `App.jsx`.

---

## 13. Build & deploy

`npm run build` emits a static `dist/` (HTML + hashed CSS/JS + copied `public/`). It's fully static — deploy to Netlify, Vercel, GitHub Pages, any static host. There is no server, router or API. All assets use root-absolute paths (`/foo.png`), so deploying to a **sub-path** (e.g. `user.github.io/repo/`) requires setting Vite's `base` in `vite.config.js`.

---

## 14. Performance notes

- The portrait was originally 7.6 MB; the shipped `public/MananGohil.jpg` is an optimised 0.28–0.54 MB. The untouched original is kept in `_originals/` (outside `public/`, so it is **not** shipped).
- Everything under `public/` ships as-is — compress new images before adding them. Project screenshots are the biggest assets.
- No runtime dependencies beyond React; total JS is ~250 kB raw / ~78 kB gzip, mostly React itself.
- Animations use `transform`/`opacity` only (compositor-friendly). `will-change` is set on reveal elements.
