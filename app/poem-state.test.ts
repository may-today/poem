import { describe, expect, test } from 'bun:test'
import { initialHistory, poemReducer, type Action, type History } from './poem-state'
const word = (id: string) => ({ id, text: id, song: 'test' })
const apply = (state: History, ...actions: Action[]) => actions.reduce(poemReducer, state)
const seeded = () => apply(initialHistory, ...['A', 'B', 'C'].map((id): Action => ({ type: 'add', word: word(id) })))
const text = (state: History) => state.present.lines.map((line) => line.map((word) => word.text).join(''))

describe('poem editing', () => {
  test('splits after a selected word, inserts into that position and merges without losing words', () => {
    let state = apply(seeded(), { type: 'select', id: 'A' }, { type: 'split' })
    expect(text(state)).toEqual(['A', 'BC'])
    state = apply(state, { type: 'add', word: word('D') }, { type: 'merge', line: 1 })
    expect(text(state)).toEqual(['ADBC'])
  })
  test('moves in both directions within a line and across lines', () => {
    let state = apply(seeded(), { type: 'move', id: 'A', to: { line: 0, index: 3 } })
    expect(text(state)).toEqual(['BCA'])
    state = apply(state, { type: 'move', id: 'A', to: { line: 0, index: 0 } }, { type: 'move', id: 'B', to: { line: 1, index: 0 } })
    expect(text(state)).toEqual(['AC', 'B'])
    state = apply(state, { type: 'step', direction: -1 })
    expect(text(state)).toEqual(['ACB', ''])
    state = apply(state, { type: 'step', direction: 1 })
    expect(text(state)).toEqual(['AC', 'B'])
  })
  test('restores content and cursor after deletion, clear, undo and redo', () => {
    const original = apply(seeded(), { type: 'select', id: 'B' })
    let state = apply(original, { type: 'remove' })
    expect(text(state)).toEqual(['AC'])
    state = apply(state, { type: 'undo' })
    expect(state.present).toEqual(original.present)
    state = apply(state, { type: 'redo' }, { type: 'clear' }, { type: 'undo' })
    expect(text(state)).toEqual(['AC'])
    state = apply(state, { type: 'redo' })
    expect(text(state)).toEqual([''])
  })
  test('selection does not consume history; new edits replace the redo branch', () => {
    let state = apply(seeded(), { type: 'undo' })
    const depth = state.past.length
    state = apply(state, { type: 'select', id: 'A' }, { type: 'cursor', position: { line: 0, index: 0 } })
    expect(state.past.length).toBe(depth)
    expect(state.future.length).toBe(1)
    state = apply(state, { type: 'add', word: word('D') })
    expect(text(state)).toEqual(['DAB'])
    expect(state.future).toEqual([])
  })
  test('keeps duplicate words and no-op moves out of history', () => {
    const state = seeded()
    expect(apply(state, { type: 'add', word: word('A') }, { type: 'move', id: 'B', to: { line: 0, index: 2 } })).toBe(state)
  })
  test('handles first-position splits and empty-line removal', () => {
    let state = apply(seeded(), { type: 'cursor', position: { line: 0, index: 0 } }, { type: 'split' })
    expect(text(state)).toEqual(['', 'ABC'])
    state = apply(state, { type: 'merge', line: 1 }, { type: 'newLine' }, { type: 'newLine' })
    expect(text(state)).toEqual(['ABC', ''])
    state = apply(state, { type: 'merge', line: 1 })
    expect(text(state)).toEqual(['ABC'])
  })
})
