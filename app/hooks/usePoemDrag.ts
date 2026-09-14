import { useEffect, useRef, useState } from 'react'
import type { Dispatch, PointerEvent as ReactPointerEvent } from 'react'
import type { Action, Position } from '../poem-state'

type Drag = { id: string; text: string; x: number; y: number; target: Position | null }

export function usePoemDrag(dispatch: Dispatch<Action>) {
  const [drag, setDrag] = useState<Drag | null>(null)
  const dragRef = useRef<Drag | null>(null)
  const frameRef = useRef(0)

  const targetAt = (x: number, y: number): Position | null => {
    const element = document.elementFromPoint(x, y)
    const slot = element?.closest<HTMLElement>('[data-slot]')
    if (slot) return { line: Number(slot.dataset.line), index: Number(slot.dataset.index) }
    const word = element?.closest<HTMLElement>('[data-editor-word]')
    if (word) {
      const rect = word.getBoundingClientRect()
      return { line: Number(word.dataset.line), index: Number(word.dataset.index) + (x > rect.left + rect.width / 2 ? 1 : 0) }
    }
    const row = element?.closest<HTMLElement>('[data-poem-line]')
    if (row) return { line: Number(row.dataset.poemLine), index: Number(row.dataset.length) }
    return null
  }

  const stopDrag = () => {
    cancelAnimationFrame(frameRef.current)
    dragRef.current = null
    setDrag(null)
  }
  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>, id: string, text: string) => {
    if (event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dispatch({ type: 'select', id })
    dragRef.current = { id, text, x: event.clientX, y: event.clientY, target: null }
    setDrag(dragRef.current)
    const scroll = () => {
      const current = dragRef.current
      if (!current) return
      const bottom = window.innerHeight - 100
      const delta = current.y < 90 ? -10 : current.y > bottom ? 10 : 0
      if (delta) {
        window.scrollBy(0, delta)
        current.target = targetAt(current.x, current.y)
        setDrag({ ...current })
      }
      frameRef.current = requestAnimationFrame(scroll)
    }
    frameRef.current = requestAnimationFrame(scroll)
  }

  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return
    dragRef.current = { ...dragRef.current, x: event.clientX, y: event.clientY, target: targetAt(event.clientX, event.clientY) }
    setDrag(dragRef.current)
  }
  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current
    const target = targetAt(event.clientX, event.clientY)
    if (current && target) dispatch({ type: 'move', id: current.id, to: target })
    stopDrag()
  }

  return { drag, startDrag, moveDrag, endDrag, stopDrag }
}
