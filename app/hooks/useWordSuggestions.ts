import { useMemo, useState } from 'react'
import { allWords, sample } from '../lib/word-library'

export function useWordSuggestions() {
  const [suggestions, setSuggestions] = useState(() => sample(allWords))
  const [query, setQuery] = useState('')
  const candidates = useMemo(() => {
    const keyword = query.trim()
    if (!keyword) return suggestions
    return allWords.filter((word) => word.text.includes(keyword) || word.song.includes(keyword)).slice(0, 80)
  }, [query, suggestions])

  const refresh = () => {
    setQuery('')
    setSuggestions(sample(allWords))
  }

  return { query, setQuery, candidates, refresh }
}
