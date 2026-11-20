# Typegrid

The website for Typegrid: a 12-column grid system without the bells and whistles, first
released in 2013 and featured on
[Best of Behance](https://www.behance.net/gallery/9386529/Typegrid) on September 13, 2013.

The page is a portfolio archive, designed in a minimal Swiss style: one typeface, three
weights and one text colour, all set on the grid the page documents. There are no borders,
boxes or filled buttons; structure comes from the columns, whitespace and type size, and red
is the only accent. It opens with
the 2013 poster (large type under translucent red bars that fade out toward the top and
bottom), followed by five numbered sections: Get started, Playground, Ranges, Documentation
and About.

## Stack

- [Vite](https://vite.dev) with plain HTML, CSS and a small ES module. No framework, no preprocessor.
- `public/typegrid.css` is the grid itself: CSS Grid driven by four custom properties
  (`--column-width`, `--columns`, `--gutter-width`, `--column-width-widescreen`). The site links
  this exact file, and the Download links serve it.
- Inter (variable) for text, in weights 400, 500 and 600 only, and JetBrains Mono for code.
  Both are self-hosted through Fontsource.
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

With Workers Builds connected to this repository, use `npm run build` as the build command and
`npx wrangler deploy` as the deploy command. The Worker name in the dashboard must match `name`
in `wrangler.jsonc`, which points Workers static assets at `dist/`.

## Things to know

- Press `G`, or use the Grid toggle in the header, to overlay the page's own 12 columns.
- On desktop the poster bars are the page's real columns. On smaller screens they switch to
  five bars and four gaps of equal width, as on the original poster.
- The footer links to park.is. The 2013 footer listed an email address and typebig.com; both
  were left out.
