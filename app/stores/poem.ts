import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type State = {
  selectedWordIds: string[]
}

type Actions = {
  addSelectedWordId: (id: string) => void
}

export const usePoemStore = create<State & Actions>()(devtools((set, get) => ({
  selectedWordIds: [],
  addSelectedWordId: (id: string) => {
    set((state) => ({
      selectedWordIds: [...state.selectedWordIds, id],
    }))
  },
})))
