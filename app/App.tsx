import { useReducer, useState } from 'react'
import PoemEditor from './components/PoemEditor'
import PoemPreview from './components/PoemPreview'
import WordBank from './components/WordBank'
import WordLibraryDialog from './components/WordLibraryDialog'
import { useWordSuggestions } from './hooks/useWordSuggestions'
import { initialHistory, poemReducer, type Word } from './poem-state'

export default function App() {
  const [history, dispatch] = useReducer(poemReducer, initialHistory)
  const [preview, setPreview] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const suggestions = useWordSuggestions()
  const selectedIds = new Set(history.present.lines.flat().map((word) => word.id))
  const addWord = (word: Word) => dispatch({ type: 'add', word })

  const reset = () => {
    dispatch({ type: 'clear' })
    setPreview(false)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Mayday</p>
          <h1><span>Re.</span>Poem 拼贴诗</h1>
        </div>
        {selectedIds.size > 0 && <button className="text-button danger" onClick={reset}>清空</button>}
      </header>

      {preview ? (
        <PoemPreview lines={history.present.lines} onEdit={() => setPreview(false)} />
      ) : (
        <>
          <PoemEditor history={history} dispatch={dispatch} />
          <WordBank
            {...suggestions}
            selectedIds={selectedIds}
            onSelect={addWord}
            onOpenLibrary={() => setLibraryOpen(true)}
          />
          <div className="bottom-bar">
            <span>{selectedIds.size} 个词片</span>
            <button className="primary-button" disabled={!selectedIds.size} onClick={() => setPreview(true)}>完成</button>
          </div>
        </>
      )}
      <WordLibraryDialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        selectedIds={selectedIds}
        onSelect={addWord}
      />
    </main>
  )
}
