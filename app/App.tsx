import { useEffect, useMemo, useRef, useState, useReducer } from 'react'
import songSlugMap from './dict/songSlugMap.json'
import wordMap from './dict/wordMap.json'

import PoemEditor from './PoemEditor'
import { initialHistory, poemReducer, type Word } from './poem-state'

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

export default function App() {
  const [suggestions, setSuggestions] = useState(() => sample(allWords))
  const [history, dispatch] = useReducer(poemReducer, initialHistory)
  const lines = history.present.lines
  const selected = lines.flat()
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [libraryQuery, setLibraryQuery] = useState('')
  const [librarySong, setLibrarySong] = useState('')
  const libraryRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!libraryOpen) return
    const dialog = libraryRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [libraryOpen])

  const libraryGroups = useMemo(() => {
    const keyword = libraryQuery.trim()
    const groups = new Map<string, Word[]>()
    for (const word of allWords) {
      if (librarySong && word.song !== librarySong) continue
      if (keyword && !word.text.includes(keyword) && !word.song.includes(keyword)) continue
      const words = groups.get(word.song) ?? []
      words.push(word)
      groups.set(word.song, words)
    }
    return [...groups.entries()]
  }, [libraryQuery, librarySong])
  const libraryCount = libraryGroups.reduce((count, [, words]) => count + words.length, 0)

  const candidates = useMemo(() => {
    const keyword = query.trim()
    if (!keyword) return suggestions
    return allWords.filter((word) => word.text.includes(keyword) || word.song.includes(keyword)).slice(0, 80)
  }, [query, suggestions])

  const selectedIds = new Set(selected.map((word) => word.id))
  const songs = [...new Set(selected.map((word) => word.song))]

  const addWord = (word: Word) => dispatch({ type: 'add', word })

  const reset = () => {
    dispatch({ type: 'clear' })
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
          <PoemEditor history={history} dispatch={dispatch} />

          <section className="word-bank" aria-label="词片库">
            <div className="section-heading">
              <div><b>挑选词片</b><small>{query ? `找到 ${candidates.length} 个` : '每次随机出现一组'}</small></div>
              <div className="word-bank-actions">
                <button className="text-button" onClick={() => setLibraryOpen(true)}>全部词片</button>
                <button className="text-button" onClick={() => { setQuery(''); setSuggestions(sample(allWords)) }}>换一组</button>
              </div>
            </div>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索歌词或歌名" aria-label="搜索歌词或歌名" />
            <div className="words">
              {candidates.map((word) => (
                <button key={word.id} className="word" disabled={selectedIds.has(word.id)} onClick={() => addWord(word)}>{word.text}</button>
              ))}
            </div>
          </section>
          <div className="bottom-bar">
            <span>{selected.length} 个词片</span>
            <button className="primary-button" disabled={!selected.length} onClick={() => setPreview(true)}>完成</button>
          </div>
        </>
      )}
      <dialog ref={libraryRef} className="library-panel" aria-labelledby="library-title" onCancel={() => setLibraryOpen(false)} onClose={() => setLibraryOpen(false)}>
        {libraryOpen && <>
        <header className="library-header">
          <div>
            <h2 id="library-title">全部词片</h2>
            <p>{allWords.length.toLocaleString()} 个词片 · {Object.keys(wordMap).length} 首歌</p>
          </div>
          <button className="text-button" onClick={() => setLibraryOpen(false)}>关闭</button>
        </header>
        <div className="library-filters">
          <input autoFocus value={libraryQuery} onChange={(event) => setLibraryQuery(event.target.value)} placeholder="搜索歌词或歌名" aria-label="搜索全部词片" />
          <select value={librarySong} onChange={(event) => setLibrarySong(event.target.value)} aria-label="按歌曲筛选">
            <option value="">全部歌曲</option>
            {Object.keys(wordMap).map((song) => <option key={song} value={song}>{song}</option>)}
          </select>
          <p className="library-result-count" role="status">{libraryGroups.length} 首歌 · {libraryCount.toLocaleString()} 个词片</p>
        </div>
        <div className="library-content">
          {libraryGroups.length ? libraryGroups.map(([song, words]) => (
            <section className="library-song" key={song} aria-label={song}>
              <h3>{song}<span>{words.length} 个词片</span></h3>
              <div className="words">
                {words.map((word) => (
                  <button key={word.id} className="word" disabled={selectedIds.has(word.id)} onClick={() => addWord(word)}>{word.text}</button>
                ))}
              </div>
            </section>
          )) : <p className="library-empty">没有找到匹配的词片，试试其他关键词或歌曲。</p>}
        </div>
        <footer className="library-footer">
          <span role="status">已选 {selected.length} 个词片</span>
          <button className="primary-button" onClick={() => setLibraryOpen(false)}>返回编辑</button>
        </footer>
        </>}
      </dialog>
    </main>
  )
}
