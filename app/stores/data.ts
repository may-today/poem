import { atom } from 'jotai'
import { getWordIdFlattenMap, getWordIdSlugMap } from '@/utils/data'

type SlugMap = Record<string, Record<string, string>>

const wordIdSlugMapAtom = atom<SlugMap>({})
export const wordIdFlattenMapAtom = atom((get) => getWordIdFlattenMap(get(wordIdSlugMapAtom)))
export const randomWordIdListAtom = atom((get) =>
  Object.keys(get(wordIdFlattenMapAtom)).sort(() => Math.random() - 0.5).slice(0, 50),
)

export const prepareData = atom(null, (get, set) => {
  const slugMap = getWordIdSlugMap()
  set(wordIdSlugMapAtom, slugMap)
})

export const wordByIdAtom = atom((get) => (id: string) => {
  return get(wordIdFlattenMapAtom)[id]
})
