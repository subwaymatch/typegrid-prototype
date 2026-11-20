import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/site.css'

document.documentElement.classList.add('js')

const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]

/* Code blocks: line numbers, light highlighting, copy button ----------------- */

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function highlightLine(line) {
  const html = escapeHtml(line)
  if (/^\s*(\/\*.*\*\/|&lt;!--.*--&gt;)\s*$/.test(html)) return `<span class="tok-comment">${html}</span>`
  // The value of a custom property declaration, e.g. `--columns: 12;`
  return html.replace(/^(\s*--[\w-]+:\s*)([^;]+)(;?)$/, '$1<span class="tok-value">$2</span>$3')
}

function renderCode(block, source) {
  block.dataset.source = source
  $('code', block).innerHTML = source
    .split('\n')
    .map((line) => `<span class="line">${highlightLine(line)}</span>`)
    .join('')
}

for (const block of $$('.code')) {
  renderCode(block, $('code', block).textContent.replace(/\s+$/, ''))

  const copy = document.createElement('button')
  copy.type = 'button'
  copy.className = 'code__copy'
  copy.textContent = 'Copy'
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(block.dataset.source)
      copy.textContent = 'Copied'
      setTimeout(() => (copy.textContent = 'Copy'), 1400)
    } catch {
      /* Clipboard unavailable (insecure context or denied): leave the button as is. */
    }
  })
  block.append(copy)
}

/* Documentation tabs ---------------------------------------------------------- */

function showDoc(name, { reveal = false } = {}) {
  const pane = $(`[data-doc-pane="${name}"]`)
  if (!pane) return
  for (const link of $$('.docs__nav a')) {
    const active = link.dataset.doc === name
    link.classList.toggle('is-active', active)
    if (active) link.setAttribute('aria-current', 'true')
    else link.removeAttribute('aria-current')
  }
  for (const other of $$('[data-doc-pane]')) other.classList.toggle('is-active', other === pane)
  if (reveal) {
    // Keep the chosen tab in view when the nav scrolls sideways on small screens.
    const nav = $('.docs__nav')
    const link = $('.docs__nav a.is-active')
    if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: link.offsetLeft - nav.offsetLeft - 24 })
  }
}

for (const link of $$('a[data-doc]')) {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    showDoc(link.dataset.doc, { reveal: true })
  })
}

const hashDoc = location.hash.match(/^#doc-(\w+)$/)
if (hashDoc) showDoc(hashDoc[1])

/* Playground ------------------------------------------------------------------ */

const form = $('.controls')
const liveCode = $('[data-live="config"]')
const px = (value) => `${Math.round(value * 10) / 10}px`

function renderPlayground() {
  const value = (name) => Number(form.elements[name].value)
  const cw = value('cw')
  const n = value('n')
  const gw = value('gw')
  const cww = value('cww')

  const desktop = (cw + gw) * n
  const widescreen = (cww + gw) * n
  const widest = Math.max(desktop, widescreen)

  const set = (name, text) => $$(`[data-out="${name}"]`).forEach((el) => (el.textContent = text))
  set('cw', cw)
  set('n', n)
  set('gw', gw)
  set('cww', cww)
  set('desktop-width', desktop)
  set('widescreen-width', widescreen)
  set('desktop-math', `${n} × (${cw} + ${gw})`)
  set('widescreen-math', `${n} × (${cww} + ${gw})`)

  // The ranges table follows the same numbers.
  set('desktop-width-px', px(desktop))
  set('widescreen-width-px', px(widescreen))
  set('gutter-mobile', px(gw * 0.4))
  set('gutter-tablet', px(gw * 0.6))
  set('gutter-desktop', px(gw))

  const draw = (name, total) => {
    const grid = $(`[data-preview="${name}"] .gauge__grid`)
    if (grid.children.length !== n) grid.innerHTML = '<i></i>'.repeat(n)
    grid.style.setProperty('--w', `${(total / widest) * 100}%`)
    // Half a gutter on each side of a column, as a share of the whole grid.
    grid.style.setProperty('--pad', `${(gw / 2 / total) * 100}%`)
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
