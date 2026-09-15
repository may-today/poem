import type { Word } from '../poem-state'
import { SLIP_INK, SLIP_PAPER, slipFor, type Slip } from './collage'

const POEM_FONT = '"Zhuque Fangsong", "Songti SC", "STFangsong", "FangSong", "Noto Serif CJK SC", serif'
const UI_FONT = 'system-ui, -apple-system, "PingFang SC", "Hiragino Sans GB", sans-serif'

const PAPER = '#fdfcf8'
const WIDTH = 1080
const PADDING = 96
const TOP = 132
const BASE_SIZE = 54
/** 同一行诗折行后的行距 / 两行诗之间的行距，都随字号走 */
const wrapGap = (size: number) => Math.round(size * 0.42)
const lineGap = (size: number) => Math.round(size * 1.15)
const MIN_HEIGHT = 1080

const poemText = (lines: Word[][]) => lines.filter((line) => line.length).map((line) => line.map((word) => word.text).join(''))

export function poemSourceText(lines: Word[][]) {
  const songs = [...new Set(lines.flat().map((word) => word.song))]
  return `来自五月天${songs.slice(0, 4).map((song) => `《${song}》`).join('')}等${songs.length}首歌的摇滚诗`
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const wrapped: string[] = []
  let current = ''
  for (const character of text) {
    if (context.measureText(current + character).width > maxWidth && current) {
      wrapped.push(current)
      current = character
    } else current += character
  }
  if (current) wrapped.push(current)
  return wrapped
}

type Piece = {
  /** 词片本身可能是一整句，放不下时在词片内部折行 */
  textLines: string[]
  slip: Slip
  size: number
  width: number
  height: number
  lineHeight: number
  padX: number
  padTop: number
  ascent: number
  gap: number
  x: number
}

type Row = { pieces: Piece[]; above: number; below: number; /** 是否是一行诗的起始行（非折行） */ first: boolean }

/** 词片排版：按诗的分行走，一行放不下就折行；字号统一，只有间距和错落不同。 */
function layout(lines: Word[][], context: CanvasRenderingContext2D, maxWidth: number, size: number) {
  const rows: Row[] = []
  const padX = Math.round(size * 0.3)
  const padTop = Math.round(size * 0.2)
  const padBottom = Math.round(size * 0.26)
  const ascent = size * 0.86
  const lineHeight = Math.round(size * 1.5)
  context.font = `${size}px ${POEM_FONT}`
  context.letterSpacing = `${Math.max(1, Math.round(size * 0.05))}px`

  for (const line of lines) {
    if (!line.length) continue
    let started = false
    let row: Row = { pieces: [], above: 0, below: 0, first: true }
    const flush = () => {
      if (row.pieces.length) {
        rows.push(row)
        started = true
      }
      row = { pieces: [], above: 0, below: 0, first: !started }
    }
    for (const word of line) {
      const slip = slipFor(word.id)
      const textLines = wrapText(context, word.text, maxWidth - padX * 2)
      const textWidth = Math.max(...textLines.map((text) => context.measureText(text).width))
      const piece: Piece = {
        textLines,
        slip,
        size,
        width: textWidth + padX * 2,
        height: (textLines.length - 1) * lineHeight + ascent + size * 0.2 + padTop + padBottom,
        lineHeight,
        padX,
        padTop,
        ascent,
        gap: Math.round(size * slip.gap),
        x: 0,
      }
      const last = row.pieces[row.pieces.length - 1]
      if (last && last.x + last.width + last.gap + piece.width > maxWidth) flush()
      const previous = row.pieces[row.pieces.length - 1]
      piece.x = previous ? previous.x + previous.width + previous.gap : 0
      row.pieces.push(piece)
      const shift = piece.slip.shift * size
      row.above = Math.max(row.above, ascent + padTop - shift)
      row.below = Math.max(row.below, piece.height - ascent - padTop + shift)
    }
    flush()
  }
  context.letterSpacing = '0px'
  return rows
}

function noisePattern(context: CanvasRenderingContext2D) {
  const tile = document.createElement('canvas')
  tile.width = 180
  tile.height = 180
  const tileContext = tile.getContext('2d')
  if (!tileContext) return null
  const image = tileContext.createImageData(tile.width, tile.height)
  for (let i = 0; i < image.data.length; i += 4) {
    const value = 120 + Math.random() * 135
    image.data[i] = value
    image.data[i + 1] = value
    image.data[i + 2] = value
    image.data[i + 3] = 26
  }
  tileContext.putImageData(image, 0, 0)
  return context.createPattern(tile, 'repeat')
}

/** 换行处该留多少竖直间距：两行诗之间要明显大于同一行的折行。 */
function gapBefore(row: Row) {
  const size = row.pieces[0]?.size ?? BASE_SIZE
  return row.first ? lineGap(size) : wrapGap(size)
}

/** 手剪的纸边：四角带一点抖动，而不是标准矩形。 */
function slipPath(context: CanvasRenderingContext2D, width: number, height: number, edge: Slip['edge']) {
  const j = edge.map((value) => value * 1.2)
  const left = -width / 2
  const top = -height / 2
  context.beginPath()
  context.moveTo(left + j[0], top - j[0])
  context.lineTo(-left - j[1], top + j[1])
  context.lineTo(-left + j[2], -top + j[2])
  context.lineTo(left - j[3], -top - j[3])
  context.closePath()
}

function drawSlip(context: CanvasRenderingContext2D, piece: Piece, baseline: number) {
  const { slip, size, height } = piece
  const shift = slip.shift * size
  const top = baseline + shift - piece.ascent - piece.padTop
  const centerX = piece.x + piece.width / 2
  const centerY = top + height / 2

  context.save()
  context.translate(centerX, centerY)
  context.rotate((slip.tilt * Math.PI) / 180)

  context.shadowColor = 'rgba(23, 44, 58, 0.16)'
  context.shadowBlur = 6
  context.shadowOffsetY = 2
  context.fillStyle = SLIP_PAPER
  slipPath(context, piece.width, height, slip.edge)
  context.fill()
  context.shadowColor = 'transparent'
  context.shadowBlur = 0
  context.shadowOffsetY = 0

  context.strokeStyle = 'rgba(28, 33, 38, 0.08)'
  context.lineWidth = 1
  context.stroke()

  context.fillStyle = SLIP_INK
  context.font = `${size}px ${POEM_FONT}`
  context.letterSpacing = `${Math.max(1, Math.round(size * 0.05))}px`
  context.textAlign = 'left'
  context.textBaseline = 'alphabetic'
  const firstBaseline = piece.ascent + piece.padTop - height / 2
  piece.textLines.forEach((text, index) => context.fillText(text, -piece.width / 2 + piece.padX, firstBaseline + index * piece.lineHeight))
  context.letterSpacing = '0px'

  context.restore()
}

/** 把诗渲染成一张拼贴分享图；返回 canvas，便于预览或下载。 */
export async function renderPoemCanvas(lines: Word[][]) {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  const context = canvas.getContext('2d')
  if (!context) return null

  try {
    await document.fonts.load(`${BASE_SIZE}px "Zhuque Fangsong"`, poemText(lines).join(''))
  } catch {
    // 字体加载失败时退回系统字体
  }

  const contentWidth = WIDTH - PADDING * 2

  // 页脚
  const footerFont = `30px ${UI_FONT}`
  context.font = footerFont
  const footerText = poemSourceText(lines)
  const footerLines = wrapText(context, footerText, contentWidth * 0.78)
  const footerLineHeight = 48
  const footerHeight = 50 + (footerLines.length - 1) * footerLineHeight + 70

  // 短诗把词片整体放大一点，别让方图空一大片（所有词片仍是同一个字号）
  const measure = (rows: Row[]) =>
    rows.reduce((total, row, index) => total + row.above + row.below + (index ? gapBefore(row) : 0), 0)
  const roomAtMin = MIN_HEIGHT - TOP - footerHeight - 96
  let rows = layout(lines, context, contentWidth, BASE_SIZE)
  let poemHeight = measure(rows)
  if (poemHeight < roomAtMin * 0.82) {
    for (const size of [60, 66, 72, 78, 84]) {
      const trial = layout(lines, context, contentWidth, size)
      const trialHeight = measure(trial)
      if (trialHeight > roomAtMin * 0.94) break
      rows = trial
      poemHeight = trialHeight
    }
  }

  const height = Math.max(MIN_HEIGHT, TOP + poemHeight + 96 + footerHeight)
  canvas.height = height

  // 纸底 + 淡蓝晕染 + 纸纹
  context.fillStyle = PAPER
  context.fillRect(0, 0, WIDTH, height)
  const wash = context.createLinearGradient(0, 0, 0, height * 0.55)
  wash.addColorStop(0, 'rgba(220, 236, 242, 0.95)')
  wash.addColorStop(1, 'rgba(220, 236, 242, 0)')
  context.fillStyle = wash
  context.fillRect(0, 0, WIDTH, height)
  const glow = context.createRadialGradient(WIDTH, 0, 0, WIDTH, 0, WIDTH * 0.9)
  glow.addColorStop(0, 'rgba(207, 227, 239, 0.9)')
  glow.addColorStop(1, 'rgba(207, 227, 239, 0)')
  context.fillStyle = glow
  context.fillRect(0, 0, WIDTH, height)
  const noise = noisePattern(context)
  if (noise) {
    context.save()
    context.globalCompositeOperation = 'multiply'
    context.fillStyle = noise
    context.fillRect(0, 0, WIDTH, height)
    context.restore()
  }

  // 词片
  const footerTop = height - footerHeight
  const available = footerTop - 56 - TOP
  let cursorY = TOP + Math.max(0, (available - poemHeight) / 2)
  context.save()
  context.translate(PADDING, 0)
  rows.forEach((row, index) => {
    if (index) cursorY += gapBefore(row)
    const baseline = cursorY + row.above
    for (const piece of row.pieces) drawSlip(context, piece, baseline)
    cursorY += row.above + row.below
  })
  context.restore()

  // 页脚
  context.strokeStyle = 'rgba(28, 33, 38, 0.12)'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(PADDING, footerTop)
  context.lineTo(WIDTH - PADDING, footerTop)
  context.stroke()
  context.fillStyle = '#b0b5ba'
  context.font = footerFont
  context.textAlign = 'right'
  footerLines.forEach((line, index) => context.fillText(line, WIDTH - PADDING, footerTop + 50 + index * footerLineHeight))
  context.textAlign = 'left'

  return canvas
}

export async function downloadPoem(lines: Word[][]) {
  const canvas = await renderPoemCanvas(lines)
  if (!canvas) return
  const link = document.createElement('a')
  link.download = 'mayday-repoem.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function copyPoem(lines: Word[][]) {
  const text = `${poemText(lines).join('\n')}\n\n${poemSourceText(lines)}`
  await navigator.clipboard.writeText(text)
}
