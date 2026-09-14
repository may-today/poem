import type { Dispatch } from 'react'
import type { Action, History } from '../poem-state'

/** 撤销 / 重做 图标按钮，放在「完成」旁边。 */
export default function HistoryButtons({ history, dispatch }: { history: History; dispatch: Dispatch<Action> }) {
  return (
    <div className="history-actions" role="group" aria-label="历史">
      <button className="icon-button" title="撤销" aria-label="撤销" disabled={!history.past.length} onClick={() => dispatch({ type: 'undo' })} onPointerDown={(event) => event.stopPropagation()}>
        <svg viewBox="0 0 16 16"><path d="M6 4.5 3 7.5l3 3" /><path d="M3 7.5h6a3.5 3.5 0 0 1 0 7H7" /></svg>
      </button>
      <button className="icon-button" title="重做" aria-label="重做" disabled={!history.future.length} onClick={() => dispatch({ type: 'redo' })} onPointerDown={(event) => event.stopPropagation()}>
        <svg viewBox="0 0 16 16"><path d="M10 4.5l3 3-3 3" /><path d="M13 7.5H7a3.5 3.5 0 0 0 0 7h2" /></svg>
      </button>
    </div>
  )
}
