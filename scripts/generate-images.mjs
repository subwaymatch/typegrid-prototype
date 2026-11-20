// Generates the photographic assets for the site with the OpenAI Images API.
// Usage: OPENAI_API_KEY=... node scripts/generate-images.mjs [name ...]
// Output goes to scripts/.generated/ as PNG (git-ignored). The site uses WebP copies
// at 1536px and 900px wide in src/assets/ (hero-*.webp, desk-*.webp).
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const MODEL = 'gpt-image-2.6-sunburst'
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '.generated')

const IMAGES = {
  hero: {
    size: '1536x1024',
    background: 'opaque',
    prompt:
      'Documentary close-up photograph of a craftsman\'s weathered hand gripping a bright red carpenter pencil, ' +
      'ruling a straight line along a steel square on a sheet of white drafting paper. Worn wooden workbench, ' +
      'rolled paper plans and a few curled wood shavings softly out of focus in the background. ' +
      'The hand and pencil sit slightly right of centre; the red pencil runs diagonally from upper left to lower right. ' +
      'Natural window light from the left, muted desaturated warm-grey tones, the red pencil is the only saturated colour. ' +
      'Shallow depth of field, 50mm lens, subtle film grain. No text, no logos, no watermark.',
  },
  desk: {
    size: '1536x1024',
    background: 'opaque',
    prompt:
      'Top-down photograph of a designer\'s desk: a large sheet of paper with faint hand-ruled vertical column guides ' +
      'drawn in pencil, a steel ruler, a set square and one bright red pencil resting on the paper. ' +
      'Dark charcoal desk surface around the paper, low-key moody lighting, muted desaturated tones, ' +
      'the red pencil is the only saturated colour. Lots of empty dark space. No text, no logos, no watermark.',
  },
}

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(IMAGES)
await mkdir(OUT, { recursive: true })

for (const name of names) {
  const spec = IMAGES[name]
  if (!spec) throw new Error(`Unknown image "${name}"`)
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: spec.prompt,
      size: spec.size,
      quality: 'low',
      background: spec.background,
      output_format: 'png',
      n: 1,
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`${name}: ${res.status} ${JSON.stringify(json.error ?? json)}`)
  const file = path.join(OUT, `${name}.png`)
  await writeFile(file, Buffer.from(json.data[0].b64_json, 'base64'))
  console.log(`${name} -> ${file}`, JSON.stringify(json.usage ?? {}))
}
