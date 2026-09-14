import { Fragment } from 'react'
import type { Dispatch } from 'react'
import { locate, type Action, type History } from '../poem-state'
import { usePoemDrag } from '../hooks/usePoemDrag'
import { tileStyle } from '../lib/tilt'

export default function PoemEditor({ history, dispatch }: { history: History; dispatch: Dispatch<Action> }) {
  const { present: poem } = history
  const active = locate(poem, poem.activeId)
  const activeWord = active ? poem.lines[active.line][active.index] : null
  const { drag, startDrag, moveDrag, endDrag, stopDrag } = usePoemDrag(dispatch)

  const insertion = (line: number, index: number) => {
    const highlighted = drag ? drag.target?.line === line && drag.target.index === index : poem.cursor.line === line && poem.cursor.index === index
    const splittable = !drag && !activeWord && highlighted && index > 0 && index < poem.lines[line].length
    return <>
      <button className={`insertion-slot${highlighted ? ' is-current' : ''}`} data-slot="" data-line={line} data-index={index} aria-label={`插入到第 ${line + 1} 行第 ${index + 1} 个位置`} aria-pressed={!drag && highlighted} onClick={() => dispatch({ type: 'cursor', position: { line, index } })}><span /></button>
      {splittable && <button className="split-chip" title="在此换行" aria-label="在此换行" onClick={() => dispatch({ type: 'split' })}><svg viewBox="0 0 16 16"><path d="M13 3v5H4.5" /><path d="M7 5.5 4.5 8 7 10.5" /></svg></button>}
    </>
  }

  return (
    <section className={`editor${drag ? ' is-dragging' : ''}`} aria-label="诗歌编辑区">
      <div className="poem-sheet">
        <div className="poem-editor-lines">
          {poem.lines.map((words, line) => (
            <div className={`editor-line${poem.cursor.line === line ? ' is-active' : ''}`} key={line}>
              <div className="line-heading">
                <span>第 {line + 1} 行</span>
                {line > 0 && <button className="text-button" onClick={() => dispatch({ type: 'merge', line })}>{words.length ? '合并到上一行' : '移除空行'}</button>}
              </div>
              <div className="line-words" data-poem-line={line} data-length={words.length}>
                {words.map((word, index) => (
                  <Fragment key={word.id}>
                    {insertion(line, index)}
                    <div className={`editor-word${poem.activeId === word.id ? ' is-selected' : ''}${drag?.id === word.id ? ' is-lifted' : ''}`} style={tileStyle(word.id, 0, 0.9)} data-editor-word="" data-line={line} data-index={index}>
                      <button className="word-label" aria-pressed={poem.activeId === word.id} onClick={() => dispatch({ type: 'select', id: word.id })}>{word.text}</button>
                      <button className="drag-handle" aria-label={`拖动 ${word.text}`} onPointerDown={(event) => startDrag(event, word.id, word.text)} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onKeyDown={(event) => {
                        if (event.key === 'Escape') stopDrag()
                      }} onClick={() => dispatch({ type: 'select', id: word.id })}>⠿</button>
                    </div>
                  </Fragment>
                ))}
                {insertion(line, words.length)}
                <button className="line-end" data-slot="" data-line={line} data-index={words.length} onClick={() => dispatch({ type: 'cursor', position: { line, index: words.length } })}>{words.length ? '＋ 在此选词' : '点此选词，或拖入词片'}</button>
              </div>
            </div>
          ))}
          <button className={`new-line${drag?.target?.line === poem.lines.length ? ' is-current' : ''}`} data-slot="" data-line={poem.lines.length} data-index={0} onClick={() => dispatch({ type: 'newLine' })}>＋ 新起一行{drag ? ' · 松手放入' : ''}</button>
        </div>
      </div>
      <div className="word-tools-slot" aria-live="polite">
        {activeWord && active && (
          <div className="word-tools" role="toolbar" aria-label={`调整「${activeWord.text}」`} key={activeWord.id}>
            <span className="word-tools-label">{activeWord.text}</span>
            <button title="前移" aria-label="前移" disabled={active.line === 0 && active.index === 0} onClick={() => dispatch({ type: 'step', direction: -1 })}>
              <svg viewBox="0 0 16 16"><path d="M10.5 3.5 6 8l4.5 4.5" /></svg>
            </button>
            <button title="后移" aria-label="后移" disabled={active.line === poem.lines.length - 1 && active.index === poem.lines[active.line].length - 1} onClick={() => dispatch({ type: 'step', direction: 1 })}>
              <svg viewBox="0 0 16 16"><path d="M5.5 3.5 10 8l-4.5 4.5" /></svg>
            </button>
            <button title="在此后换行" aria-label="在此后换行" disabled={active.index === poem.lines[active.line].length - 1} onClick={() => dispatch({ type: 'split' })}>
              <svg viewBox="0 0 16 16"><path d="M13 3v5H4.5" /><path d="M7 5.5 4.5 8 7 10.5" /></svg>
            </button>
            <button className="delete-word" title="删除" aria-label="删除" onClick={() => dispatch({ type: 'remove' })}>
              <svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </div>
        )}
      </div>
      {drag && <div className="drag-preview" style={{ left: drag.x, top: drag.y }}>{drag.text}</div>}
    </section>
  )
}
