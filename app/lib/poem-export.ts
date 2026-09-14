import type { Word } from '../poem-state'

const POEM_FONT = '"Zhuque Fangsong", "Songti SC", "STFangsong", "FangSong", "Noto Serif CJK SC", serif'
const UI_FONT = 'system-ui, -apple-system, "PingFang SC", "Hiragino Sans GB", sans-serif'

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

export async function downloadPoem(lines: Word[][]) {
  const poemLines = poemText(lines)
  const width = 1080
  const padding = 112
  const fontSize = 50
  const poemLetterSpacing = '3px'
  const lineHeight = 96
  const poemStartY = padding + fontSize
  const canvas = document.createElement('canvas')
  canvas.width = width
  const context = canvas.getContext('2d')
  if (!context) return

  try {
    await document.fonts.load(`${fontSize}px "Zhuque Fangsong"`, poemLines.join(''))
  } catch {
    // 字体加载失败时退回系统字体
  }

  context.font = `${fontSize}px ${POEM_FONT}`
  context.letterSpacing = poemLetterSpacing
  const renderedLines = poemLines.flatMap((line) => wrapText(context, line, width - padding * 2))
  context.letterSpacing = '0px'
  const footerFont = `32px ${UI_FONT}`
  const footerWidth = (width - padding * 2) * 0.8
  const footerLineHeight = 52
  context.font = footerFont
  const footerText = poemSourceText(lines)
  const footerLines = wrapText(context, footerText, footerWidth)
  const footerHeight = 52 + (footerLines.length - 1) * footerLineHeight + 72
  const height = Math.max(1080, poemStartY + renderedLines.length * lineHeight + lineHeight + footerHeight)
  canvas.height = height

  // 纸底 + 淡蓝晕染
  context.fillStyle = '#fdfcf8'
  context.fillRect(0, 0, width, height)
  const wash = context.createLinearGradient(0, 0, 0, height * 0.5)
  wash.addColorStop(0, 'rgba(220, 236, 242, 0.95)')
  wash.addColorStop(1, 'rgba(220, 236, 242, 0)')
  context.fillStyle = wash
  context.fillRect(0, 0, width, height)
  const glow = context.createRadialGradient(width, 0, 0, width, 0, width * 0.9)
  glow.addColorStop(0, 'rgba(207, 227, 239, 0.9)')
  glow.addColorStop(1, 'rgba(207, 227, 239, 0)')
  context.fillStyle = glow
  context.fillRect(0, 0, width, height)

  // 诗句
  context.fillStyle = '#1c2126'
  context.font = `${fontSize}px ${POEM_FONT}`
  context.letterSpacing = poemLetterSpacing
  renderedLines.forEach((line, index) => context.fillText(line, padding, poemStartY + index * lineHeight))
  context.letterSpacing = '0px'

  // 页脚
  const footerTop = height - footerHeight
  context.strokeStyle = 'rgba(28, 33, 38, 0.12)'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(padding, footerTop)
  context.lineTo(width - padding, footerTop)
  context.stroke()
  context.fillStyle = '#b0b5ba'
  context.font = footerFont
  context.textAlign = 'right'
  footerLines.forEach((line, index) => context.fillText(line, width - padding, footerTop + 52 + index * footerLineHeight))

  const link = document.createElement('a')
  link.download = 'mayday-repoem.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function copyPoem(lines: Word[][]) {
  const text = `${poemText(lines).join('\n')}\n\n${poemSourceText(lines)}`
  await navigator.clipboard.writeText(text)
}
