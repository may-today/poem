import { atom } from 'jotai'
import { getWordIdFlattenMap, getWordIdSlugMap } from '@/utils/data'

type SlugMap = Record<string, Record<string, string>>

export const wordIdSlugMapAtom = atom<SlugMap>({})
export const randomWordIdListAtom = atom<string[]>([])
export const wordIdFlattenMapAtom = atom((get) => getWordIdFlattenMap(get(wordIdSlugMapAtom)))

export const prepareData = atom(null, (get, set) => {
  const slugMap = getWordIdSlugMap()
  set(wordIdSlugMapAtom, slugMap)
  set(refreshRandomWordIdList)
})

export const refreshRandomWordIdList = atom(null, (get, set) => {
  const randomWordIdList = Object.keys(get(wordIdFlattenMapAtom))
    .sort(() => Math.random() - 0.5)
    .slice(0, 52)
  set(randomWordIdListAtom, randomWordIdList)
})

export const wordByIdAtom = atom((get) => (id: string) => {
  return get(wordIdFlattenMapAtom)[id]
})
