import type { useWordSuggestions } from '../hooks/useWordSuggestions'
import WordList, { type WordSelectionProps } from './WordList'

type Props = WordSelectionProps & ReturnType<typeof useWordSuggestions> & {
  onOpenLibrary: () => void
  /** panel：桌面右栏；sheet：移动端底部抽屉（标题行省略，控件并排） */
  layout?: 'panel' | 'sheet'
  /** 抽屉收起时：单行自动滚动 */
  marquee?: boolean
}

export default function WordBank({ query, setQuery, candidates, refresh, listKey, selectedIds, onSelect, onOpenLibrary, layout = 'panel', marquee = false }: Props) {
  const hint = query ? `找到 ${candidates.length} 个` : '每次随机出现一组'
  const search = (
    <label className="search-field">
      <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5 14 14" />
      </svg>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索歌词或歌名" aria-label="搜索歌词或歌名" />
    </label>
  )

  return (
    <section className={`word-bank is-${layout}`} aria-label="词片库">
      {layout === 'sheet' ? (
        <div className="bank-controls">
          {search}
          <button className="icon-button" title="换一组" aria-label="换一组" onClick={refresh}>
            <svg viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.6-3.66" /><path d="M13 2.5v3h-3" /></svg>
          </button>
          <button className="icon-button" title="全部词片" aria-label="全部词片" onClick={onOpenLibrary}>
            <svg viewBox="0 0 16 16"><path d="M2.5 3.5h4.5v9H2.5zM9 3.5h4.5v9H9z" /></svg>
          </button>
        </div>
      ) : (
        <>
          <div className="section-heading">
            <div><b>挑选词片</b><small>{hint}</small></div>
            <div className="word-bank-actions">
              <button className="text-button" onClick={onOpenLibrary}>全部词片</button>
              <button className="text-button" onClick={refresh}>换一组</button>
            </div>
          </div>
          {search}
        </>
      )}
      {candidates.length ? (
        <WordList words={candidates} selectedIds={selectedIds} onSelect={onSelect} listKey={listKey} marquee={marquee} />
      ) : (
        <p className="word-bank-empty">没有找到「{query.trim()}」，换个词试试，或打开全部词片。</p>
      )}
    </section>
  )
}
