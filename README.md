# ROOFCRAFT — Built Above Expectations

A cinematic fictional roofing studio built with **React + Vite + TypeScript**, GSAP 3 / ScrollTrigger, Lenis, Framer Motion, modern CSS, and Lucide React. Static, backend-free, and ready to build for Render Static Sites. No environment variables or paid APIs are required to run the demo.

## Local development

Use **Node.js 22 LTS** (Node 24 is also supported).

```sh
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173). The dev server binds to `0.0.0.0` and accepts Arena preview hosts. No browser-facing code references localhost or a dev server.

## Production

```sh
npm run typecheck
npm run build
npm run preview
```

The build first checks TypeScript, then emits the deployable site to **`dist`**. Preview serves that production output; it is not needed on Render.

## Deploy on Render using GitHub

### Blueprint (recommended)

1. Push this code to your GitHub repository.
2. In Render, choose **New → Blueprint** and connect the repository.
3. Select the branch containing this implementation (`arena/22257852-roofing-demo`, or your main branch after merging).
4. Render reads **`render.yaml`**, creates a Static Site, installs dependencies, and builds the application.
5. Open the public Render URL after deployment succeeds.

### Manual Static Site

Choose **New → Static Site**, connect GitHub, and use:

| Setting | Value |
| --- | --- |
| Branch | Branch containing this implementation |
| Root directory | Leave blank (repository root) |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |
| Node version | `22` (`NODE_VERSION` in Render build environment) |

Add a **Rewrite** in Render's Redirects/Rewrites panel:

| Source | Destination | Action |
| --- | --- | --- |
| `/*` | `/index.html` | Rewrite |

This is the Render-native equivalent of **`/* /index.html 200`**. The Blueprint already configures it. It serves the SPA for direct URL loads without a redirect. Navigation currently uses accessible section anchors, not client-side route pages. Fonts, images, and Vite bundles use root-relative asset URLs for domain-root hosting.

No Vercel/Netlify APIs, server runtime, secret keys, or external form endpoint are used. Deploying the site requires access to your Render account; adding the Blueprint alone does not create a deployed service.

## Cinematic experience

- Short SVG roof-logo intro, architectural grid, staged percentage, and clipped exit; a timeout prevents the overlay from lingering on slow devices. The percentage represents the intro sequence, **not network loading progress**.
- Character-by-character masked hero reveal, pointer-reactive image, scroll zoom/parallax, ambient lighting, and film grain.
- **Pinned section A — Roof anatomy:** zoomed architectural photography transitions into four exploded SVG roof layers; labels appear, then layers assemble. This is an illustrative diagram, not a construction specification.
- **Pinned section B — Our craft:** vertical scrolling drives a three-panel horizontal narrative, synchronized progress line, and clipped photographic reveals.
- Touch-scrollable project gallery with previous/next controls, progress, and project dialogs.
- Interactive range-based before/after simulation, animated counters, six-service accordion, testimonials, and why-ROOFCRAFT editorial section.
- GSAP timelines and ScrollTriggers are scoped to component lifecycle; media contexts revert on breakpoint changes. One Lenis RAF loop drives smooth scrolling and forwards scroll events to ScrollTrigger. Smooth scrolling pauses while menus/dialogs are open.

## Kinetic motion upgrade

The motion system now uses geometry and physical movement rather than opacity-only entrances:

- **Third pinned sequence — hero disassembly:** the image pushes toward the viewer, the two headline lines rotate and separate in opposite directions, and a rotating architectural seal assembles at the center.
- A full-width copper ribbon scrolls sideways while its nested wireframe emblems rotate and the band's edges shear.
- Headline characters rotate up in 3D; editorial headings unfold from clipped perspective planes.
- Roof layers fan apart with independent horizontal displacement, pitch, and rotation before precisely reassembling. The same assembly timeline runs on phones, with spacing adapted to the screen.
- Craft photographs rotate out of skewed polygon masks while their titles straighten in perspective and their oversized indices turn into place.
- Project panels unskew from sliced polygons; project imagery, service imagery, and approach panels respond to pointer position with restrained 3D tilt.
- Service imagery uses directional curtain wipes and zoom/rotation, testimonials slide and rotate through masks, and the navigation opens as a staggered clipping curtain.
- The comparison frame expands from an inset aperture, approach columns rise at different rates, and the footer wordmark hinges upward in perspective.

All three cross-device pins are ordered explicitly before ScrollTrigger refresh. GSAP and Lenis use real elapsed time. Film grain is a small static raster texture rather than a continuously rasterized SVG noise filter; the light sweep moves with transforms. Motion contexts, event listeners, and ScrollTriggers are cleaned up on unmount. No new runtime dependencies were introduced.

## Responsive and accessible behavior

All screen widths receive the same three pinned narratives: hero disassembly, roof anatomy, and horizontal craft storytelling. There is no desktop-only or user-agent gate. Smaller screens use a portrait composition, shorter layer spacing, and vertically arranged image/text within each horizontally moving craft panel. Vertical finger swipes drive the sequences using native touch scrolling; Lenis smooths mouse-wheel scrolling without intercepting touch. Pointer-based tilt is an optional enhancement, never a requirement to see the main animations. Navigation, inputs, and project controls remain touch-friendly.

Full cinematic motion is the fixed mode on every screen. There is no motion selector, no persisted preference, and no system-dependent animation gate. The shared provider sets `data-motion="full"`, and Framer Motion is configured with `reducedMotion="never"`. Old saved `roofcraft-motion` preferences are ignored. The hero's outgoing headline, buttons, and labels become invisible before the ABOVE ALL seal enters; reverse scrolling restores them without moving the buttons downward. Forms use native labels and validation, the range comparison supports keyboard input, dialogs close with Escape and contain Tab navigation, and visible focus styles are provided.

## Contact form — demonstration only

The form validates required fields, email format, and phone characters in the browser. On valid input it states **“Your details are validated. Nothing has been sent or stored.”** It does **not** fake a delivered estimate, store personal data, or make a network submission. Actual message delivery requires implementing a backend or connecting a form service, with appropriate consent, privacy policies, abuse protection, and error handling. The `.example` email address is intentionally not a real business inbox.

## Assets and fictional content

All images and fonts are bundled locally; there are no runtime image/font CDN dependencies. Three AI-generated architectural images are optimized to WebP, with smaller responsive variants. They are fictional project visualizations, not photographs of completed client work. The before image is a digitally weathered treatment of the same generated home image, labeled in the interface. Company statistics and client stories are fictional and labeled as illustrative.

DM Sans and Barlow Condensed font files are self-hosted under the SIL Open Font License. License notices are in `public/fonts/`. Lucide icons retain their upstream license.

## Browser tests

```sh
npx playwright install chromium
npm run dev
# In another terminal:
npm run test:e2e
```

Tests cover intro completion, character rendering, three active pins, measurable hero displacement and zoom, exploded layer labels, vertical-to-horizontal translation, Lenis activation, gallery controls/dialogs, comparison input, invalid/valid form behavior, console errors, mobile/tablet/desktop widths (320–1440px), fixed full-motion behavior, and direct URL loads. Additional cross-device tests measure the actual hero zoom, text displacement, roof-layer separation, and horizontal track translation at 320px, 390px, 768px, 900px, and 1366px. They also test native touch gestures, orientation changes, and fixed full motion even when the OS requests reduced motion, absence of the removed selector, and the hero handoff and reverse-scroll restoration. Run against a production preview with:

```sh
npm run build
npm run preview -- --port 4173
TEST_URL=http://localhost:4173 npm run test:e2e
```

Optional `CHROME_PATH` can point to an existing Chromium binary in constrained environments. Playwright and browser binaries are development-only and never included in the production bundle.

## Deployment freshness

Confirm Render is deploying the branch containing these changes and use **Deploy latest commit** if an existing site still shows the old motion selector. The Blueprint sends `no-cache` for root HTML while retaining immutable caching for hashed build assets. Desktop-site mode is never required for cinematic motion.
