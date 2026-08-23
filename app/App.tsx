import { useMemo, useState } from 'react'
import songSlugMap from './dict/songSlugMap.json'
import wordMap from './dict/wordMap.json'

type Word = { id: string; text: string; song: string }

const allWords: Word[] = Object.entries(wordMap).flatMap(([song, words]) =>
  words.map((text, index) => ({
    id: `${(songSlugMap as Record<string, string>)[song] ?? 'unknown'}:${index}`,
    text,
    song,
  })),
)

const sample = (items: Word[], count = 36) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

const splitLines = (selected: Word[]) => {
  const lines: Word[][] = [[]]
  selected.forEach((word) => {
    if (word.id.startsWith('break:')) lines.push([])
    else lines.at(-1)?.push(word)
  })
  return lines
}

export default function App() {
  const [suggestions, setSuggestions] = useState(() => sample(allWords))
  const [selected, setSelected] = useState<Word[]>([])
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState(false)

  const candidates = useMemo(() => {
    const keyword = query.trim()
    if (!keyword) return suggestions
    return allWords.filter((word) => word.text.includes(keyword) || word.song.includes(keyword)).slice(0, 80)
  }, [query, suggestions])

  const lines = splitLines(selected)
  const selectedIds = new Set(selected.map((word) => word.id))
  const songs = [...new Set(selected.filter((word) => !word.id.startsWith('break:')).map((word) => word.song))]

  const addWord = (word: Word) => {
    if (!selectedIds.has(word.id)) setSelected((current) => [...current, word])
  }

  const addBreak = () => {
    if (selected.length && !selected.at(-1)?.id.startsWith('break:')) {
      setSelected((current) => [...current, { id: `break:${crypto.randomUUID()}`, text: '', song: '' }])
    }
  }

  const removeWord = (index: number) => {
    setSelected((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const reset = () => {
    setSelected([])
    setPreview(false)
  }

  const download = () => {
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

  const share = async () => {
    const text = lines.filter((line) => line.length).map((line) => line.map((word) => word.text).join('')).join('\n')
    if (navigator.share) await navigator.share({ title: 'Mayday Re.Poem', text })
    else await navigator.clipboard.writeText(text)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Mayday</p>
          <h1><span>Re.</span>Poem 拼贴诗</h1>
        </div>
        {selected.length > 0 && <button className="text-button danger" onClick={reset}>清空</button>}
      </header>

      {preview ? (
        <section className="preview-screen">
          <article className="poem-card" aria-label="诗歌预览">
            <p className="card-label">你的摇滚诗</p>
            <div className="poem-lines">
              {lines.filter((line) => line.length).map((line, index) => <p key={index}>{line.map((word) => word.text).join('')}</p>)}
            </div>
            <footer>
              <span>Mayday Re.Poem</span>
              <small>来自五月天 {songs.slice(0, 3).map((song) => `《${song}》`).join('')}{songs.length > 3 && `等 ${songs.length} 首歌`}</small>
            </footer>
          </article>
          <div className="action-row">
            <button className="secondary-button" onClick={() => setPreview(false)}>继续编辑</button>
            <button className="secondary-button" onClick={share}>分享文字</button>
            <button className="primary-button" onClick={download}>保存图片</button>
          </div>
        </section>
      ) : (
        <>
          <section className="editor" aria-label="诗歌编辑区">
            <div className="section-heading">
              <div><b>我的诗</b><small>点击词片可移除</small></div>
              <button className="text-button" onClick={addBreak} disabled={!selected.length}>换行</button>
            </div>
            <div className="canvas">
              {!selected.length && <p className="empty">从下方挑选词片，拼出你的诗。</p>}
              {selected.map((word, index) => word.id.startsWith('break:') ? (
                <button key={word.id} className="line-break" onClick={() => removeWord(index)} aria-label="移除换行">换行 ×</button>
              ) : (
                <button key={word.id} className="word selected-word" onClick={() => removeWord(index)}>{word.text}</button>
              ))}
            </div>
          </section>

          <section className="word-bank" aria-label="词片库">
            <div className="section-heading">
              <div><b>挑选词片</b><small>{query ? `找到 ${candidates.length} 个` : '每次随机出现一组'}</small></div>
              <button className="text-button" onClick={() => { setQuery(''); setSuggestions(sample(allWords)) }}>换一组</button>
            </div>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索歌词或歌名" aria-label="搜索歌词或歌名" />
            <div className="words">
              {candidates.map((word) => (
                <button key={word.id} className="word" disabled={selectedIds.has(word.id)} onClick={() => addWord(word)}>{word.text}</button>
              ))}
            </div>
          </section>
          <div className="bottom-bar">
            <span>{selected.filter((word) => !word.id.startsWith('break:')).length} 个词片</span>
            <button className="primary-button" disabled={!selected.some((word) => !word.id.startsWith('break:'))} onClick={() => setPreview(true)}>完成</button>
          </div>
        </>
      )}
    </main>
  )
}
