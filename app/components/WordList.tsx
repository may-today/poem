import type { Word } from '../poem-state'

export type WordSelectionProps = {
  selectedIds: ReadonlySet<string>
  onSelect: (word: Word) => void
}

type Props = WordSelectionProps & { words: Word[] }

export default function WordList({ words, selectedIds, onSelect }: Props) {
  return (
    <div className="words">
      {words.map((word) => (
        <button key={word.id} className="word" disabled={selectedIds.has(word.id)} onClick={() => onSelect(word)}>
          {word.text}
        </button>
      ))}
    </div>
  )
}
