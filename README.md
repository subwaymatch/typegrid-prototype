# Typegrid

A rebuild of the Typegrid website: a 12-column grid system without the bells and whistles,
first released in 2013 and featured on
[Best of Behance](https://www.behance.net/gallery/9386529/Typegrid) on September 13, 2013.

The page is a portfolio archive. It recreates the original design (header, hero, the
Ready / Set / Go steps, documentation and footer) from the Behance screenshots, makes it
responsive, and adds a few sections: a live grid playground, the four responsive ranges,
the 2013 poster and a short history.

## Stack

- [Vite](https://vite.dev) with plain HTML, CSS and a small ES module. No framework, no preprocessor.
- `public/typegrid.css` is the grid itself: CSS Grid driven by four custom properties
  (`--column-width`, `--columns`, `--gutter-width`, `--column-width-widescreen`). The site links
  this exact file, and the "Download (Beta)" button serves it.
- Inter (variable) for text, capped at weight 600, and JetBrains Mono for code. Both are
  self-hosted through Fontsource.
- The logo is an inline SVG drawn on an 11 × 11 unit grid (`public/favicon.svg`).

## Develop

```bash
npm install
```

```bash
npm run dev
```

## Build

```bash
npm run build
```

The static site is written to `dist/`. Asset paths are relative, so it can be served from a
domain root or from a sub-path.

## Deploy to Cloudflare

With Workers Builds or Pages connected to this repository, use `npm run build` as the build
command and `dist` as the output directory. To deploy from the command line instead:

```bash
npm run build
```

```bash
npx wrangler deploy
```

`wrangler.jsonc` points Workers static assets at `dist/`.

## Images

The hero and desk photographs are AI-generated with the OpenAI Images API
(`gpt-image-2.6-sunburst`, `quality: low`). The prompts live in `scripts/generate-images.mjs`:

```bash
OPENAI_API_KEY=... node scripts/generate-images.mjs
```

The script writes PNGs to `scripts/.generated/`; the site uses WebP copies in `src/assets/`.

## Things to know

- Press `G` on the page to overlay its own 12 columns.
- The sign-up form is a demo. Nothing is sent or stored.
- The footer links to park.is. The 2013 footer listed an email address and typebig.com; both
  were left out of this rebuild.
