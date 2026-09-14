import type { Word } from '../poem-state'

const POEM_FONT = '"Zhuque Fangsong", "Songti SC", "STFangsong", "FangSong", "Noto Serif CJK SC", serif'
const UI_FONT = 'system-ui, -apple-system, "PingFang SC", "Hiragino Sans GB", sans-serif'

const poemText = (lines: Word[][]) => lines.filter((line) => line.length).map((line) => line.map((word) => word.text).join(''))

export async function downloadPoem(lines: Word[][]) {
  const songs = [...new Set(lines.flat().map((word) => word.song))]
  const poemLines = poemText(lines)
  const width = 1080
  const padding = 112
  const fontSize = 50
  const lineHeight = 96
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
  const renderedLines = poemLines.flatMap((line) => {
    const wrapped: string[] = []
    let current = ''
    for (const character of line) {
      if (context.measureText(current + character).width > width - padding * 2 && current) {
        wrapped.push(current)
        current = character
      } else current += character
    }
    if (current) wrapped.push(current)
    return wrapped
  })
  const height = Math.max(1080, padding * 2 + renderedLines.length * lineHeight + 300)
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

  // 标签
  context.fillStyle = '#2a7f9e'
  context.font = `500 22px ${UI_FONT}`
  context.letterSpacing = '6px'
  context.fillText('你的摇滚诗', padding, padding + 8)
  context.letterSpacing = '0px'

  // 诗句
  context.fillStyle = '#1c2126'
  context.font = `${fontSize}px ${POEM_FONT}`
  context.letterSpacing = '3px'
  renderedLines.forEach((line, index) => context.fillText(line, padding, padding + 150 + index * lineHeight))
  context.letterSpacing = '0px'

  // 页脚
  context.strokeStyle = 'rgba(28, 33, 38, 0.12)'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(padding, height - 170)
  context.lineTo(width - padding, height - 170)
  context.stroke()
  context.fillStyle = '#4a5158'
  context.font = `30px ${POEM_FONT}`
  context.fillText('Mayday Re.Poem', padding, height - 118)
  context.fillStyle = '#7b838b'
  context.font = `26px ${UI_FONT}`
  context.fillText(`来自五月天 ${songs.slice(0, 4).map((song) => `《${song}》`).join('')}${songs.length > 4 ? `等 ${songs.length} 首歌` : ''}`, padding, height - 72)

  const link = document.createElement('a')
  link.download = 'mayday-repoem.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function sharePoem(lines: Word[][]) {
  const text = poemText(lines).join('\n')
  if (navigator.share) await navigator.share({ title: 'Mayday Re.Poem', text })
  else await navigator.clipboard.writeText(text)
}
