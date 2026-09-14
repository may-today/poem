import { useMemo, useState } from 'react'
import { allWords, sample } from '../lib/word-library'

export function useWordSuggestions() {
  const [suggestions, setSuggestions] = useState(() => sample(allWords))
  const [batch, setBatch] = useState(0)
  const [query, setQuery] = useState('')
  const candidates = useMemo(() => {
    const keyword = query.trim()
    if (!keyword) return suggestions
    return allWords.filter((word) => word.text.includes(keyword) || word.song.includes(keyword)).slice(0, 80)
  }, [query, suggestions])

  const refresh = () => {
    setQuery('')
    setSuggestions(sample(allWords))
    setBatch((value) => value + 1)
  }

  /** 每换一组或改变搜索词时变化，用来触发词片重新入场。 */
  const listKey = `${batch}:${query.trim()}`

  return { query, setQuery, candidates, refresh, listKey }
}
