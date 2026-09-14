import { useRef } from 'react'
import type { Word } from '../poem-state'
import { tileStyle } from '../lib/tilt'
import { useMarquee } from '../hooks/useMarquee'

export type WordSelectionProps = {
  selectedIds: ReadonlySet<string>
  onSelect: (word: Word) => void
}

type Props = WordSelectionProps & {
  words: Word[]
  listKey?: string
  /** 跑马灯模式：单行横向自动滚动（移动端抽屉收起时） */
  marquee?: boolean
}

export default function WordList({ words, selectedIds, onSelect, listKey, marquee = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useMarquee(ref, marquee)

  const tiles = (copy: number) => words.map((word, index) => (
    <button
      key={`${copy}:${word.id}`}
      className="word"
      style={tileStyle(word.id, index)}
      disabled={selectedIds.has(word.id)}
      title={word.song}
      tabIndex={copy ? -1 : undefined}
      aria-hidden={copy ? true : undefined}
      onClick={() => onSelect(word)}
    >
      {word.text}
    </button>
  ))

  if (marquee) {
    return (
      <div className="words is-marquee" key={listKey} ref={ref}>
        <div className="words-group">{tiles(0)}</div>
        <div className="words-group">{tiles(1)}</div>
      </div>
    )
  }
  return (
    <div className="words" key={listKey} ref={ref}>
      {tiles(0)}
    </div>
  )
}
