import wordMap from '@/dict/wordMap.json'
import songSlugMap from '@/dict/songSlugMap.json'

type SlugMap = Record<string, Record<string, string>>

export const getWordIdSlugMap = () => {
  const idSlugMap: SlugMap = {}
  for (const [songName, wordList] of Object.entries(wordMap)) {
    const songSlug = (songSlugMap as Record<string, string>)[songName] || 'unknown'
    idSlugMap[songSlug] = {}
    for (let i = 0; i < wordList.length; i++) {
      const wordId = `${songSlug}:${i}`
      idSlugMap[songSlug][wordId] = wordList[i]
    }
  }
  return idSlugMap
}

export const getWordIdFlattenMap = () => {
  const slugMap = getWordIdSlugMap()
  const wordIdMap: Record<string, string> = {}
  for (const [_songSlug, wordMap] of Object.entries(slugMap)) {
    for (const [wordId, word] of Object.entries(wordMap)) {
      wordIdMap[wordId] = word
    }
  }
  return wordIdMap
}
