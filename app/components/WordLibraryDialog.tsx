import { useEffect, useMemo, useRef, useState } from 'react'
import { allWords, songNames } from '../lib/word-library'
import type { Word } from '../poem-state'
import WordList, { type WordSelectionProps } from './WordList'

type Props = WordSelectionProps & { open: boolean; onClose: () => void }

export default function WordLibraryDialog({ open, onClose, selectedIds, onSelect }: Props) {
  const [libraryQuery, setLibraryQuery] = useState('')
  const [librarySong, setLibrarySong] = useState('')
  const libraryRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!open) return
    const dialog = libraryRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])

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

  return (
    <dialog ref={libraryRef} className="library-panel" aria-labelledby="library-title" onCancel={onClose} onClose={onClose}>
      {open && <>
        <header className="library-header">
          <div>
            <h2 id="library-title">全部词片</h2>
            <p>{allWords.length.toLocaleString()} 个词片 · {songNames.length} 首歌</p>
          </div>
          <button className="text-button" onClick={onClose}>关闭</button>
        </header>
        <div className="library-filters">
          <input autoFocus value={libraryQuery} onChange={(event) => setLibraryQuery(event.target.value)} placeholder="搜索歌词或歌名" aria-label="搜索全部词片" />
          <select value={librarySong} onChange={(event) => setLibrarySong(event.target.value)} aria-label="按歌曲筛选">
            <option value="">全部歌曲</option>
            {songNames.map((song) => <option key={song} value={song}>{song}</option>)}
          </select>
          <p className="library-result-count" role="status">{libraryGroups.length} 首歌 · {libraryCount.toLocaleString()} 个词片</p>
        </div>
        <div className="library-content">
          {libraryGroups.length ? libraryGroups.map(([song, words]) => (
            <section className="library-song" key={song} aria-label={song}>
              <h3>{song}<span>{words.length} 个词片</span></h3>
              <WordList words={words} selectedIds={selectedIds} onSelect={onSelect} />
            </section>
          )) : <p className="library-empty">没有找到匹配的词片，试试其他关键词或歌曲。</p>}
        </div>
        <footer className="library-footer">
          <span role="status">已选 {selectedIds.size} 个词片</span>
          <button className="primary-button" onClick={onClose}>返回编辑</button>
        </footer>
      </>}
    </dialog>
  )
}
