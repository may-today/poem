import { useReducer, useState } from 'react'
import BankSheet, { type SheetSnap } from './components/BankSheet'
import HistoryButtons from './components/HistoryButtons'
import PoemEditor from './components/PoemEditor'
import PoemPreview from './components/PoemPreview'
import WordBank from './components/WordBank'
import WordLibraryDialog from './components/WordLibraryDialog'
import { useIsDesktop } from './hooks/useMediaQuery'
import { useWordSuggestions } from './hooks/useWordSuggestions'
import { initialHistory, poemReducer, type Word } from './poem-state'

export default function App() {
  const [history, dispatch] = useReducer(poemReducer, initialHistory)
  const [preview, setPreview] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [sheet, setSheet] = useState<SheetSnap>('peek')
  const isDesktop = useIsDesktop()
  const suggestions = useWordSuggestions()
  const selectedIds = new Set(history.present.lines.flat().map((word) => word.id))

  const addWord = (word: Word) => {
    dispatch({ type: 'add', word })
    if (isDesktop) return
    // 抽屉全屏时挑完词退回半屏，让人看到诗句的变化；并把光标滚到抽屉上方
    if (sheet === 'full') setSheet('half')
    requestAnimationFrame(() => {
      const caret = document.querySelector('.insertion-slot.is-current')?.getBoundingClientRect()
      if (!caret) return
      const sheetHeight = sheet === 'full' ? Math.round(window.innerHeight * 0.58) : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sheet-h')) || 0
      const visibleBottom = window.innerHeight - sheetHeight - 72
      const delta = caret.bottom > visibleBottom ? caret.bottom - visibleBottom : caret.top < 96 ? caret.top - 96 : 0
      if (delta) window.scrollBy({ top: delta, behavior: 'smooth' })
    })
  }

  const reset = () => {
    dispatch({ type: 'clear' })
    setPreview(false)
  }

  const bank = (
    <WordBank
      {...suggestions}
      selectedIds={selectedIds}
      onSelect={addWord}
      onOpenLibrary={() => setLibraryOpen(true)}
      layout={isDesktop ? 'panel' : 'sheet'}
      marquee={!isDesktop && sheet === 'peek'}
    />
  )

  return (
    <main className={`app-shell${!preview && !isDesktop ? ' has-sheet' : ''}`}>
      <header className="topbar">
        <h1 className="logo">
          <span className="logo-line">Mayday</span>
          <span className="logo-line"><span className="accent">Re.</span>Poem<em>拼贴诗</em></span>
        </h1>
        <div className="topbar-actions">
          {selectedIds.size > 0 && <button className="text-button danger" onClick={reset}>清空</button>}
        </div>
      </header>

      {preview ? (
        <div className="view" key="preview">
          <PoemPreview lines={history.present.lines} onEdit={() => setPreview(false)} />
        </div>
      ) : (
        <div className="view workspace" key="editor">
          <div className="workspace-poem">
            <PoemEditor history={history} dispatch={dispatch} />
            {isDesktop && (
              <div className="bottom-bar">
                <span><strong>{selectedIds.size}</strong> 个词片</span>
                <div className="bar-actions">
                  <HistoryButtons history={history} dispatch={dispatch} />
                  <button className="primary-button" disabled={!selectedIds.size} onClick={() => setPreview(true)}>完成</button>
                </div>
              </div>
            )}
          </div>
          {isDesktop && (
            <aside className="workspace-bank">{bank}</aside>
          )}
        </div>
      )}
      {/* 与顶栏同级，避免 .view 的入场动画将抽屉困在较低的层叠上下文中。 */}
      {!preview && !isDesktop && (
        <BankSheet snap={sheet} onSnap={setSheet} count={selectedIds.size} onFinish={() => setPreview(true)} extra={<HistoryButtons history={history} dispatch={dispatch} />}>{bank}</BankSheet>
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
