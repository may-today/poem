import { create } from 'zustand'
import { getWordIdFlattenMap, getWordIdSlugMap } from '@/utils/data'

type SlugMap = Record<string, Record<string, string>>

type State = {
  wordIdSlugMap: SlugMap
  wordIdFlattenMap: Record<string, string>
}

type Actions = {
  prepareData: () => void
  getWordById: (id: string) => string | undefined
}

export const useDataStore = create<State & Actions>((set, get) => ({
  wordIdSlugMap: {},
  wordIdFlattenMap: {},
  prepareData: () => {
    set({
      wordIdSlugMap: getWordIdSlugMap(),
      wordIdFlattenMap: getWordIdFlattenMap(),
    })
  },
  getWordById: (id: string) => {
    return get().wordIdFlattenMap[id]
  },
}))
