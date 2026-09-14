import { Fragment } from 'react'
import type { Dispatch } from 'react'
import { locate, type Action, type History } from '../poem-state'
import { usePoemDrag } from '../hooks/usePoemDrag'

export default function PoemEditor({ history, dispatch }: { history: History; dispatch: Dispatch<Action> }) {
  const { present: poem } = history
  const active = locate(poem, poem.activeId)
  const activeWord = active ? poem.lines[active.line][active.index] : null
  const { drag, startDrag, moveDrag, endDrag, stopDrag } = usePoemDrag(dispatch)

  const insertion = (line: number, index: number) => {
    const highlighted = drag ? drag.target?.line === line && drag.target.index === index : poem.cursor.line === line && poem.cursor.index === index
    return <button className={`insertion-slot${highlighted ? ' is-current' : ''}`} data-slot="" data-line={line} data-index={index} aria-label={`插入到第 ${line + 1} 行第 ${index + 1} 个位置`} aria-pressed={!drag && highlighted} onClick={() => dispatch({ type: 'cursor', position: { line, index } })}><span /></button>
  }

  return (
    <section className={`editor${drag ? ' is-dragging' : ''}`} aria-label="诗歌编辑区">
      <div className="section-heading">
        <div><b>我的诗</b><small>点选调整 · 拖动 ⠿ 排序</small></div>
        <div className="history-actions">
          <button className="text-button" disabled={!history.past.length} onClick={() => dispatch({ type: 'undo' })}>撤销</button>
          <button className="text-button" disabled={!history.future.length} onClick={() => dispatch({ type: 'redo' })}>重做</button>
        </div>
      </div>
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
                  <div className={`editor-word${poem.activeId === word.id ? ' is-selected' : ''}${drag?.id === word.id ? ' is-lifted' : ''}`} data-editor-word="" data-line={line} data-index={index}>
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
      <div className="editor-toolbar">
        <p role="status">{activeWord ? `已选「${activeWord.text}」` : `新词将插入第 ${poem.cursor.line + 1} 行${poem.cursor.index ? `第 ${poem.cursor.index} 个词片后` : '开头'}`}</p>
        <div className="editor-tools">
          <button disabled={!active || (active.line === 0 && active.index === 0)} onClick={() => dispatch({ type: 'step', direction: -1 })}>前移</button>
          <button disabled={!active || (active.line === poem.lines.length - 1 && active.index === poem.lines[active.line].length - 1)} onClick={() => dispatch({ type: 'step', direction: 1 })}>后移</button>
          <button disabled={!poem.lines[poem.cursor.line].length} onClick={() => dispatch({ type: 'split' })}>{activeWord ? '在此后换行' : '在此换行'}</button>
          <button className="delete-word" disabled={!active} onClick={() => dispatch({ type: 'remove' })}>删除</button>
        </div>
      </div>
      {drag && <div className="drag-preview" style={{ left: drag.x, top: drag.y }}>{drag.text}</div>}
    </section>
  )
}
