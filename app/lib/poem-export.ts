import type { Word } from '../poem-state'

export function downloadPoem(lines: Word[][]) {
  const songs = [...new Set(lines.flat().map((word) => word.song))]
  const poemLines = lines.filter((line) => line.length).map((line) => line.map((word) => word.text).join(''))
  const width = 1080
  const padding = 104
  const lineHeight = 92
  const canvas = document.createElement('canvas')
  canvas.width = width
  const context = canvas.getContext('2d')
  if (!context) return

  context.font = '48px system-ui, sans-serif'
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
  const height = Math.max(1080, padding * 2 + renderedLines.length * lineHeight + 260)
  canvas.height = height

  context.fillStyle = '#f5f4f0'
  context.fillRect(0, 0, width, height)
  context.fillStyle = '#1e1e1c'
  context.font = '48px system-ui, sans-serif'
  renderedLines.forEach((line, index) => context.fillText(line, padding, padding + 100 + index * lineHeight))
  context.fillStyle = '#77756f'
  context.font = '28px system-ui, sans-serif'
  context.fillText('Mayday Re.Poem', padding, height - 126)
  context.fillText(`来自五月天 ${songs.slice(0, 4).map((song) => `《${song}》`).join('')}${songs.length > 4 ? `等 ${songs.length} 首歌` : ''}`, padding, height - 76)

  const link = document.createElement('a')
  link.download = 'mayday-repoem.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function sharePoem(lines: Word[][]) {
  const text = lines.filter((line) => line.length).map((line) => line.map((word) => word.text).join('')).join('\n')
  if (navigator.share) await navigator.share({ title: 'Mayday Re.Poem', text })
  else await navigator.clipboard.writeText(text)
}
