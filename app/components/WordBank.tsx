import type { useWordSuggestions } from '../hooks/useWordSuggestions'
import WordList, { type WordSelectionProps } from './WordList'

type Props = WordSelectionProps & ReturnType<typeof useWordSuggestions> & { onOpenLibrary: () => void }

export default function WordBank({ query, setQuery, candidates, refresh, selectedIds, onSelect, onOpenLibrary }: Props) {
  return (
    <section className="word-bank" aria-label="词片库">
      <div className="section-heading">
        <div><b>挑选词片</b><small>{query ? `找到 ${candidates.length} 个` : '每次随机出现一组'}</small></div>
        <div className="word-bank-actions">
          <button className="text-button" onClick={onOpenLibrary}>全部词片</button>
          <button className="text-button" onClick={refresh}>换一组</button>
        </div>
      </div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索歌词或歌名" aria-label="搜索歌词或歌名" />
      <WordList words={candidates} selectedIds={selectedIds} onSelect={onSelect} />
    </section>
  )
}
