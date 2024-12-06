import { atom } from 'jotai'
import songSlugMap from '@/dict/songSlugMap.json'
import { getSongNameById } from '@/utils/data'

const genRandomLineId = () => {
  return `L:${Math.random().toString(36).substring(2, 8)}`
}

const initialLineId = genRandomLineId()

export const selectedWordsAtom = atom<string[]>([])
export const lineIdListAtom = atom<string[]>([initialLineId])
export const lineWordListMapAtom = atom<Record<string, string[]>>({
  [initialLineId]: [],
})

export const resetStateAtom = atom(null, (get, set) => {
  set(selectedWordsAtom, [])
  set(lineIdListAtom, [initialLineId])
  set(lineWordListMapAtom, {
    [initialLineId]: [],
  })
})
export const selectedSongsAtom = atom((get) => {
  const selectedWords = get(selectedWordsAtom)
  // words: ${songId}:${number}
  // sort by count
  const songIdCoundMap = {} as Record<string, number>
  for (const word of selectedWords) {
    const [songId] = word.split(':')
    songIdCoundMap[songId] = (songIdCoundMap[songId] || 0) + 1
  }
  const songIdList = Object.keys(songIdCoundMap).sort((a, b) => songIdCoundMap[b] - songIdCoundMap[a])
  return songIdList.map((songId) => getSongNameById(songId))
})
export const isInSelectedWordsAtom = atom((get) => (wordId: string) => get(selectedWordsAtom).includes(wordId))
export const addNewLineAtom = atom(null, (get, set, insertBefore: number | string) => {
  const lineId = genRandomLineId()
  const lineIdList = get(lineIdListAtom)
  const insertBeforeIndex = typeof insertBefore === 'number' ? insertBefore : lineIdList.indexOf(insertBefore)
  lineIdList.splice(insertBeforeIndex, 0, lineId)
  set(lineIdListAtom, lineIdList)
  set(lineWordListMapAtom, {
    ...get(lineWordListMapAtom),
    [lineId]: [],
  })
  return lineId
})
export const importWordToLastLineAtom = atom(null, (get, set, wordId: string) => {
  const lineId = get(lineIdListAtom)[get(lineIdListAtom).length - 1]
  set(selectedWordsAtom, [...get(selectedWordsAtom), wordId])
  set(lineWordListMapAtom, {
    ...get(lineWordListMapAtom),
    [lineId]: [...get(lineWordListMapAtom)[lineId], wordId],
  })
})
export const moveWordToExistingLineAtom = atom(
  null,
  (get, set, wordId: string, sourceLineId: string, targetLineId: string) => {
    const lineIdList = get(lineIdListAtom)
    const lineWordListMap = get(lineWordListMapAtom)
    if (!lineIdList.includes(targetLineId) || !lineIdList.includes(sourceLineId)) {
      return
    }
    const newSourceLineWordList = lineWordListMap[sourceLineId].filter((id) => id !== wordId)
    const newTargetLineWordList = [...lineWordListMap[targetLineId], wordId]
    const newLineWordListMap = {
      ...lineWordListMap,
      [sourceLineId]: newSourceLineWordList,
      [targetLineId]: newTargetLineWordList,
    }
    if (newSourceLineWordList.length === 0 && lineIdList.length > 1) {
      delete newLineWordListMap[sourceLineId]
      set(
        lineIdListAtom,
        lineIdList.filter((id) => id !== sourceLineId)
      )
    }
    set(lineWordListMapAtom, newLineWordListMap)
  }
)
export const wordMoveInlineAtom = atom(null, (get, set, lineId: string, wordId: string, toWordId: string) => {
  const lineWordListMap = get(lineWordListMapAtom)
  const wordList = lineWordListMap[lineId]
  const sourceIndex = wordList.indexOf(wordId)
  const targetIndex = wordList.indexOf(toWordId)
  const newWordList = wordList.slice()
  newWordList.splice(
    targetIndex < 0 ? newWordList.length + targetIndex : targetIndex,
    0,
    newWordList.splice(sourceIndex, 1)[0]
  )
  set(lineWordListMapAtom, {
    ...lineWordListMap,
    [lineId]: newWordList,
  })
})
export const deleteWordFromLineAtom = atom(null, (get, set, lineId: string, wordId: string) => {
  const lineIdList = get(lineIdListAtom)
  const lineWordListMap = get(lineWordListMapAtom)
  const newTargetLineWordList = lineWordListMap[lineId].filter((id) => id !== wordId)
  const newLineWordListMap = { ...lineWordListMap, [lineId]: newTargetLineWordList }
  if (newTargetLineWordList.length === 0 && lineIdList.length > 1) {
    delete newLineWordListMap[lineId]
    set(
      lineIdListAtom,
      lineIdList.filter((id) => id !== lineId)
    )
  }
  set(lineWordListMapAtom, newLineWordListMap)
  set(
    selectedWordsAtom,
    get(selectedWordsAtom).filter((id) => id !== wordId)
  )
})
