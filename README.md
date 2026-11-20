# Typegrid

The website for Typegrid: a 12-column grid system without the bells and whistles, first
released in 2013 and featured on
[Best of Behance](https://www.behance.net/gallery/9386529/Typegrid) on September 13, 2013.

The page is a portfolio archive, designed in a minimal Swiss style and set on the grid it
documents. It follows a few strict rules:

- Two type sizes: display (the poster) and one text size for everything else.
- Two weights, regular and semibold. Semibold is only for titles and the first line of a
  text column.
- Three vertical axes: content starts at column 1, 5 or 9 and is set flush left. Every row
  holds one size of type, so its columns start on the same line.
- Vertical space comes in 24px units, the height of one line of text.
- One text colour, with red as the only accent. No borders, boxes or filled buttons.

It opens with the 2013 poster (large type under translucent red bars that fade out toward the
top and bottom), followed by five sections: Get started, Playground, Ranges, Documentation
and About. Each section puts its title and introduction in the first four columns and its
content in the other eight.

## Stack

- [Vite](https://vite.dev) with plain HTML, CSS and a small ES module. No framework, no preprocessor.
- `public/typegrid.css` is the grid itself: CSS Grid driven by four custom properties
  (`--column-width`, `--columns`, `--gutter-width`, `--column-width-widescreen`). The site links
  this exact file, and the Download links serve it.
- Inter (variable) for text, in weights 400 and 600 only, and JetBrains Mono for code.
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
