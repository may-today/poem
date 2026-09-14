import songSlugMap from '../dict/songSlugMap.json'
import wordMap from '../dict/wordMap.json'
import type { Word } from '../poem-state'

export const allWords: Word[] = Object.entries(wordMap).flatMap(([song, words]) =>
  words.map((text, index) => ({
    id: `${(songSlugMap as Record<string, string>)[song] ?? 'unknown'}:${index}`,
    text,
    song,
  })),
)

export const sample = (items: Word[], count = 36) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

export const songNames = Object.keys(wordMap)
