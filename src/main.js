import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/site.css'

document.documentElement.classList.add('js')

const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]

/* Code blocks: one span per line, with the grid's own numbers picked out -------- */

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// The value of a custom property declaration, e.g. `--columns: 12;`
const highlightLine = (line) =>
  escapeHtml(line).replace(/^(\s*--[\w-]+:\s*)([^;]+)(;?)$/, '$1<span class="tok-value">$2</span>$3')

function renderCode(block, source) {
  $('code', block).innerHTML = source
    .split('\n')
    .map((line) => `<span class="line">${highlightLine(line)}</span>`)
    .join('')
}

for (const block of $$('.code')) renderCode(block, $('code', block).textContent.replace(/\s+$/, ''))

/* Documentation tabs ---------------------------------------------------------- */

function showDoc(name) {
  const pane = $(`[data-doc-pane="${name}"]`)
  if (!pane) return
  for (const link of $$('.docs__nav a')) {
    const active = link.dataset.doc === name
    link.classList.toggle('is-active', active)
    if (active) link.setAttribute('aria-current', 'true')
    else link.removeAttribute('aria-current')
  }
  for (const other of $$('[data-doc-pane]')) other.classList.toggle('is-active', other === pane)
}

for (const link of $$('a[data-doc]')) {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    showDoc(link.dataset.doc)
  })
}

const hashDoc = location.hash.match(/^#doc-(\w+)$/)
if (hashDoc) showDoc(hashDoc[1])

/* Playground ------------------------------------------------------------------ */

const form = $('.controls')
const liveCode = $('[data-live="config"]')

function renderPlayground() {
  const value = (name) => Number(form.elements[name].value)
  const cw = value('cw')
  const n = value('n')
  const gw = value('gw')
  const cww = value('cww')

  const desktop = (cw + gw) * n
  const widescreen = (cww + gw) * n
  const widest = Math.max(desktop, widescreen)

  // The same numbers feed the sliders, the strips and the ranges table.
  const set = (name, text) => $$(`[data-out="${name}"]`).forEach((el) => (el.textContent = text))
  set('cw', cw)
  set('n', n)
  set('gw', gw)
  set('cww', cww)
  set('desktop-width', `${desktop}px`)
  set('widescreen-width', `${widescreen}px`)
  set('desktop-math', `${n} × (${cw} + ${gw})`)
  set('widescreen-math', `${n} × (${cww} + ${gw})`)

  // The strips show columns and the gutters between them, so they start flush on the grid line.
  const draw = (name, total) => {
    const grid = $(`[data-preview="${name}"] .gauge__grid`)
    if (grid.children.length !== n) grid.innerHTML = '<i></i>'.repeat(n)
    grid.style.setProperty('--w', `${((total - gw) / (widest - gw)) * 100}%`)
    grid.style.setProperty('--gap', `${(gw / (total - gw)) * 100}%`)
  }
  draw('desktop', desktop)
  draw('widescreen', widescreen)

  renderCode(
    liveCode,
    [
      ':root {',
      '  /* Desktop - Default */',
      `  --column-width: ${cw};`,
      `  --columns: ${n};`,
      `  --gutter-width: ${gw};`,
      '',
      '  /* Widescreen */',
      `  --column-width-widescreen: ${cww};`,
      '}',
    ].join('\n'),
  )
}

form.addEventListener('input', renderPlayground)
form.addEventListener('reset', () => requestAnimationFrame(renderPlayground))
renderPlayground()

/* Grid overlay: the page's own 12 columns ---------------------------------------- */

const overlay = document.createElement('div')
overlay.className = 'grid-overlay'
overlay.setAttribute('aria-hidden', 'true')
overlay.innerHTML = `<div class="container"><div class="row">${'<i class="col-1 tablet-1 mobile-1"></i>'.repeat(12)}</div></div>`
document.body.append(overlay)

const overlayButton = $('[data-action="overlay"]')

function toggleOverlay() {
  const on = overlay.classList.toggle('is-on')
  overlayButton.setAttribute('aria-pressed', String(on))
}

overlayButton.addEventListener('click', toggleOverlay)
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() !== 'g' || event.metaKey || event.ctrlKey || event.altKey) return
  if (event.target.closest('input:not([type="range"]), textarea, select, [contenteditable]')) return
  toggleOverlay()
})
