export type Word = { id: string; text: string; song: string }
export type Position = { line: number; index: number }
export type Poem = { lines: Word[][]; cursor: Position; activeId: string | null }
export type History = { past: Poem[]; present: Poem; future: Poem[] }
export type Action =
  | { type: 'add'; word: Word }
  | { type: 'select'; id: string }
  | { type: 'cursor'; position: Position }
  | { type: 'move'; id: string; to: Position }
  | { type: 'step'; direction: -1 | 1 }
  | { type: 'merge'; line: number }
  | { type: 'split' | 'newLine' | 'remove' | 'clear' | 'undo' | 'redo' }

const emptyPoem = (): Poem => ({ lines: [[]], cursor: { line: 0, index: 0 }, activeId: null })
export const initialHistory: History = { past: [], present: emptyPoem(), future: [] }
export const locate = (poem: Poem, id: string | null): Position | null => {
  for (let line = 0; line < poem.lines.length; line++) {
    const index = poem.lines[line].findIndex((word) => word.id === id)
    if (index >= 0) return { line, index }
  }
  return null
}

function edit(poem: Poem, action: Action): Poem {
  const lines = poem.lines.map((line) => [...line])
  const active = locate(poem, poem.activeId)
  const { line, index } = poem.cursor
  switch (action.type) {
    case 'select': {
      const position = locate(poem, action.id)
      return position ? { ...poem, activeId: action.id, cursor: { ...position, index: position.index + 1 } } : poem
    }
    case 'cursor':
      return { ...poem, activeId: null, cursor: action.position }
    case 'add':
      if (locate(poem, action.word.id)) return poem
      lines[line].splice(index, 0, action.word)
      return { lines, cursor: { line, index: index + 1 }, activeId: null }
    case 'split':
      if (!lines[line].length) return poem
      lines.splice(line + 1, 0, lines[line].splice(index))
      return { lines, cursor: { line: line + 1, index: 0 }, activeId: null }
    case 'newLine':
      if (!lines.at(-1)?.length) return { ...poem, cursor: { line: lines.length - 1, index: 0 }, activeId: null }
      lines.push([])
      return { lines, cursor: { line: lines.length - 1, index: 0 }, activeId: null }
    case 'merge': {
      if (action.line <= 0 || action.line >= lines.length) return poem
      const boundary = lines[action.line - 1].length
      lines[action.line - 1].push(...lines[action.line])
      lines.splice(action.line, 1)
      return { lines, cursor: { line: action.line - 1, index: boundary }, activeId: null }
    }
    case 'remove':
      if (!active) return poem
      lines[active.line].splice(active.index, 1)
      return { lines, cursor: active, activeId: null }
    case 'step': {
      if (!active || !poem.activeId) return poem
      let to: Position
      if (action.direction === -1) {
        if (active.index > 0) to = { ...active, index: active.index - 1 }
        else if (active.line > 0) to = { line: active.line - 1, index: lines[active.line - 1].length }
        else return poem
      } else {
        if (active.index < lines[active.line].length - 1) to = { ...active, index: active.index + 2 }
        else if (active.line < lines.length - 1) to = { line: active.line + 1, index: 0 }
        else return poem
      }
      return edit(poem, { type: 'move', id: poem.activeId, to })
    }
    case 'move': {
      const from = locate(poem, action.id)
      if (!from || action.to.line < 0 || action.to.line > lines.length) return poem
      if (from.line === action.to.line && (action.to.index === from.index || action.to.index === from.index + 1)) return poem
      if (action.to.line === lines.length) lines.push([])
      const [word] = lines[from.line].splice(from.index, 1)
      const targetIndex = action.to.index - (from.line === action.to.line && from.index < action.to.index ? 1 : 0)
      lines[action.to.line].splice(targetIndex, 0, word)
      return { lines, cursor: { line: action.to.line, index: targetIndex + 1 }, activeId: word.id }
    }
    case 'clear':
      return emptyPoem()
    default:
      return poem
  }
}

export function poemReducer(state: History, action: Action): History {
  if (action.type === 'undo') {
    const previous = state.past.at(-1)
    return previous ? { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future] } : state
  }
  if (action.type === 'redo') {
    const next = state.future[0]
    return next ? { past: [...state.past, state.present], present: next, future: state.future.slice(1) } : state
  }
  const next = edit(state.present, action)
  if (next === state.present) return state
  if (next.lines === state.present.lines) return { ...state, present: next }
  return { past: [...state.past.slice(-99), state.present], present: next, future: [] }
}
