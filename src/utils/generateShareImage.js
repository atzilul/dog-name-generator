// ════════════════════════════════════════════════════════
//  Share Image Generator — Canvas API
//  Produces a 1080×1080 PNG ready for social sharing
// ════════════════════════════════════════════════════════

const S = 1080          // canvas size
const GREEN  = '#b6d267'
const PINK   = '#e04792'
const DARK   = '#8B1D5E'
const WHITE  = '#ffffff'
const DKTEXT = '#1a1a2e'

// ── Helpers ──────────────────────────────────────────────

function rrect(ctx, x, y, w, h, r) {
  const m = Math.min(w, h) / 2
  r = Math.min(r, m)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y,     x + w, y + r,     r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x,     y + h, x,     y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x,     y,     x + r, y,         r)
  ctx.closePath()
}

function loadImg(src) {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload  = () => res(img)
    img.onerror = () => rej(new Error('img load failed'))
    img.src = src
  })
}

// ── Background ───────────────────────────────────────────

function drawBackground(ctx) {
  // Solid green fill
  ctx.fillStyle = GREEN
  ctx.fillRect(0, 0, S, S)

  // Polka dots
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  const sp = 54
  for (let c = 0; c * sp < S + sp; c++) {
    for (let r = 0; r * sp < S + sp; r++) {
      ctx.beginPath()
      ctx.arc(c * sp, r * sp, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // White outer border
  ctx.strokeStyle = WHITE
  ctx.lineWidth = 20
  ctx.strokeRect(18, 18, S - 36, S - 36)

  // Pink inner border
  ctx.strokeStyle = PINK
  ctx.lineWidth = 7
  ctx.strokeRect(36, 36, S - 72, S - 72)
}

// ── Logo ─────────────────────────────────────────────────

async function drawLogo(ctx, logoSrc, y, maxW) {
  try {
    const img = await loadImg(logoSrc)
    const w   = Math.min(maxW, img.width)
    const h   = (img.height / img.width) * w
    ctx.drawImage(img, (S - w) / 2, y, w, h)
    return h
  } catch {
    // Fallback text
    ctx.font      = `900 70px Rubik, Arial, sans-serif`
    ctx.fillStyle = PINK
    ctx.textAlign = 'center'
    ctx.fillText('ANIPET 🐾', S / 2, y + 80)
    return 90
  }
}

// ── Name box ─────────────────────────────────────────────

function drawNameBox(ctx, name, cx, cy, boxW, boxH, fontSize) {
  ctx.fillStyle = PINK
  rrect(ctx, cx - boxW / 2, cy, boxW, boxH, boxH / 2)
  ctx.fill()

  ctx.strokeStyle = WHITE
  ctx.lineWidth = 4
  rrect(ctx, cx - boxW / 2, cy, boxW, boxH, boxH / 2)
  ctx.stroke()

  ctx.font      = `900 ${fontSize}px Rubik, Arial, sans-serif`
  ctx.fillStyle = WHITE
  ctx.textAlign = 'center'
  ctx.direction = 'rtl'
  ctx.fillText(name, cx, cy + boxH / 2 + fontSize * 0.36)
}

// ── CTA bar ──────────────────────────────────────────────

function drawCTA(ctx, y) {
  const pad = 60
  const h   = 100
  ctx.fillStyle = WHITE
  rrect(ctx, pad, y, S - pad * 2, h, h / 2)
  ctx.fill()

  ctx.strokeStyle = PINK
  ctx.lineWidth   = 5
  rrect(ctx, pad, y, S - pad * 2, h, h / 2)
  ctx.stroke()

  ctx.font      = `900 40px Rubik, Arial, sans-serif`
  ctx.fillStyle = PINK
  ctx.textAlign = 'center'
  ctx.direction = 'rtl'
  ctx.fillText('גם לכלב שלך מגיע שם מושלם! 🐾', S / 2, y + 66)
}

// ── URL line ─────────────────────────────────────────────

function drawURL(ctx, y) {
  ctx.font      = `bold 30px Rubik, Arial, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.textAlign = 'center'
  ctx.direction = 'ltr'
  const host = window.location.hostname || 'anipet.co.il'
  ctx.fillText(`🔗 ${host}`, S / 2, y)
}

// ── Dog preset color palettes ─────────────────────────────
// index: 0=golden, 1=brown, 2=black, 3=cream
export const DOG_PRESETS = [
  { head: '#e8a020', ear: '#c8860a', muzzle: '#f5c060', brow: '#c8860a' },
  { head: '#7b3f10', ear: '#5a2e0a', muzzle: '#a0602a', brow: '#5a2e0a' },
  { head: '#2e2e2e', ear: '#1a1a1a', muzzle: '#4a4040', brow: '#888'    },
  { head: '#f0e8d0', ear: '#d4c090', muzzle: '#fff8ea', brow: '#b8a060' },
]

// ── Dog face illustration ─────────────────────────────────

function drawDogFace(ctx, cx, cy, size, presetIndex = 0) {
  const r = size / 2
  const c = DOG_PRESETS[presetIndex] || DOG_PRESETS[0]

  // --- Floppy ears (behind head) ---
  ctx.fillStyle = c.ear
  ctx.beginPath()
  ctx.ellipse(cx - r * 0.72, cy + r * 0.1, r * 0.42, r * 0.62, -0.28, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + r * 0.72, cy + r * 0.1, r * 0.42, r * 0.62, 0.28, 0, Math.PI * 2)
  ctx.fill()

  // Inner ear pink
  ctx.fillStyle = '#f4a0c0'
  ctx.beginPath()
  ctx.ellipse(cx - r * 0.72, cy + r * 0.15, r * 0.24, r * 0.40, -0.28, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + r * 0.72, cy + r * 0.15, r * 0.24, r * 0.40, 0.28, 0, Math.PI * 2)
  ctx.fill()

  // --- Head circle ---
  ctx.fillStyle = c.head
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()

  // Head outline
  ctx.strokeStyle = WHITE
  ctx.lineWidth = size * 0.045
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  // --- Muzzle ---
  ctx.fillStyle = c.muzzle
  ctx.beginPath()
  ctx.ellipse(cx, cy + r * 0.28, r * 0.52, r * 0.38, 0, 0, Math.PI * 2)
  ctx.fill()

  // --- Eyes ---
  ctx.fillStyle = WHITE
  ctx.beginPath()
  ctx.arc(cx - r * 0.32, cy - r * 0.18, r * 0.18, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + r * 0.32, cy - r * 0.18, r * 0.18, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1a1a2e'
  ctx.beginPath()
  ctx.arc(cx - r * 0.30, cy - r * 0.17, r * 0.11, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + r * 0.30, cy - r * 0.17, r * 0.11, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = WHITE
  ctx.beginPath()
  ctx.arc(cx - r * 0.26, cy - r * 0.22, r * 0.045, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + r * 0.34, cy - r * 0.22, r * 0.045, 0, Math.PI * 2)
  ctx.fill()

  // --- Nose ---
  ctx.fillStyle = '#1a1a2e'
  ctx.beginPath()
  ctx.ellipse(cx, cy + r * 0.10, r * 0.155, r * 0.105, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.beginPath()
  ctx.ellipse(cx - r * 0.055, cy + r * 0.07, r * 0.065, r * 0.045, 0, 0, Math.PI * 2)
  ctx.fill()

  // --- Smile ---
  ctx.strokeStyle = '#1a1a2e'
  ctx.lineWidth = size * 0.038
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - r * 0.22, cy + r * 0.25)
  ctx.quadraticCurveTo(cx, cy + r * 0.50, cx + r * 0.22, cy + r * 0.25)
  ctx.stroke()

  // --- Cheek blush ---
  ctx.fillStyle = 'rgba(240,100,160,0.30)'
  ctx.beginPath()
  ctx.ellipse(cx - r * 0.54, cy + r * 0.22, r * 0.20, r * 0.12, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + r * 0.54, cy + r * 0.22, r * 0.20, r * 0.12, 0, 0, Math.PI * 2)
  ctx.fill()

  // --- Eyebrows ---
  ctx.strokeStyle = c.brow
  ctx.lineWidth = size * 0.032
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - r * 0.46, cy - r * 0.42)
  ctx.quadraticCurveTo(cx - r * 0.30, cy - r * 0.50, cx - r * 0.14, cy - r * 0.42)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + r * 0.14, cy - r * 0.42)
  ctx.quadraticCurveTo(cx + r * 0.30, cy - r * 0.50, cx + r * 0.46, cy - r * 0.42)
  ctx.stroke()
}

// ── Dog photo in circle ───────────────────────────────────

async function drawDogPhoto(ctx, src, cx, cy, size) {
  const r = size / 2
  try {
    const img = await loadImg(src)
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.clip()
    // Cover-fit inside circle
    const s = Math.max(size / img.width, size / img.height)
    const dw = img.width * s
    const dh = img.height * s
    ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh)
    ctx.restore()
    // Circle border
    ctx.strokeStyle = WHITE
    ctx.lineWidth = size * 0.05
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.strokeStyle = PINK
    ctx.lineWidth = size * 0.025
    ctx.beginPath()
    ctx.arc(cx, cy, r - size * 0.04, 0, Math.PI * 2)
    ctx.stroke()
  } catch {
    drawDogFace(ctx, cx, cy, size, 0)
  }
}

// ── Stars decoration ─────────────────────────────────────

function drawStars(ctx, mid) {
  const items = ['⭐', '✨', '⭐', '✨']
  const pos   = [[85, mid - 60], [S - 85, mid - 60], [85, mid + 60], [S - 85, mid + 60]]
  ctx.font = '44px serif'
  ctx.textAlign = 'center'
  pos.forEach(([x, y], i) => ctx.fillText(items[i], x, y))
}

// ════════════════════════════════════════════════════════
//  Main export
// ════════════════════════════════════════════════════════

export async function generateShareImage({ favoriteNames, gender, logoSrc = '/anipet.png', dogOption = { type: 'preset', index: 0 } }) {
  await document.fonts.ready

  const canvas = document.createElement('canvas')
  canvas.width  = S
  canvas.height = S
  const ctx = canvas.getContext('2d')

  // --- Background ---
  drawBackground(ctx)

  const single = favoriteNames.length === 1

  // --- Logo ---
  const logoH = await drawLogo(ctx, logoSrc, 65, single ? 360 : 300)

  // --- Dog face / photo ---
  const dogY    = 65 + logoH + 20
  const dogSize = single ? 180 : 150
  if (dogOption.type === 'photo' && dogOption.src) {
    await drawDogPhoto(ctx, dogOption.src, S / 2, dogY + dogSize / 2, dogSize)
  } else {
    drawDogFace(ctx, S / 2, dogY + dogSize / 2, dogSize, dogOption.index ?? 0)
  }

  // --- Title ---
  const titleY = dogY + dogSize + 55
  ctx.font      = `900 ${single ? 50 : 46}px Rubik, Arial, sans-serif`
  ctx.fillStyle = DKTEXT
  ctx.textAlign = 'center'
  ctx.direction = 'rtl'
  const suffix  = gender === 'female' ? 'ה' : ''
  const title   = single
    ? `קראנו לכלב${suffix} שלנו:`
    : `השמות שאהבנו לכלב${suffix} שלנו:`
  ctx.fillText(title, S / 2, titleY)

  // --- Name boxes ---
  const MAX    = Math.min(favoriteNames.length, 5)
  const boxW   = single ? 500 : 420
  const boxH   = single ? 120 : 76
  const gap    = single ? 0   : 90
  const namesY = titleY + 30

  for (let i = 0; i < MAX; i++) {
    drawNameBox(ctx, favoriteNames[i], S / 2, namesY + i * gap, boxW, boxH, single ? 72 : 46)
  }

  // Stars beside the single name box
  if (single) drawStars(ctx, namesY + boxH / 2)

  if (favoriteNames.length > MAX) {
    const moreY = namesY + MAX * gap + 40
    ctx.font      = '32px Rubik, Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.textAlign = 'center'
    ctx.fillText(`ועוד ${favoriteNames.length - MAX} שמות...`, S / 2, moreY)
  }

  // --- CTA ---
  const ctaY = namesY + MAX * (single ? boxH : gap) + (single ? 40 : 20) + (favoriteNames.length > MAX ? 50 : 0)
  drawCTA(ctx, ctaY)

  // --- URL ---
  drawURL(ctx, ctaY + 140)

  // --- Stars (multi) ---
  if (!single) drawStars(ctx, namesY + (MAX * gap) / 2)

  // --- Convert to blob ---
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve({ blob, objectUrl: URL.createObjectURL(blob) })
    }, 'image/png', 0.95)
  })
}
