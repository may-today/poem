import { useState, useMemo } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  pointerWithin,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { debounce } from '@/utils/scheduled'
import { LINEID_NEWLINE_BEFORE, LINEID_NEWLINE_AFTER, LINEID_INITIAL, preserveLineIds } from '@/utils/constants'
// import { startConfetti } from '@/utils/anims'
import wordMap from '@/dict/wordMap.json'

import PoemEditorLine from './PoemEditorLine'
import PoemEditorNewLine from './PoemEditorNewLine'
import PoemPaperSlip from './PoemPaperSlip'
import PoemEditorInitialBox from './PoemEditorInitialBox'

const genRandomLineId = () => {
  return `line:${Math.random().toString(36).substring(2, 15)}`
}

const PoemEditor: React.FC = () => {
  const initialItems = useMemo(() => {
    return Object.values(wordMap)
      .flat()
      .sort(() => Math.random() - 0.5)
      .slice(0, 50)
  }, [])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeLine, setActiveLine] = useState<string | null>(null)
  const initialNewLineId = genRandomLineId()
  const [items, setItems] = useState<Record<string, string[]>>({
    [initialNewLineId]: [],
  })
  const [lineIds, setLineIds] = useState<string[]>([initialNewLineId])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findLineId = (id: string) => {
    if (id.startsWith('line:')) {
      return id
    }
    if (initialItems.includes(id)) {
      return LINEID_INITIAL
    }
    return Object.keys(items).find((key) => items[key].includes(id))
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      return
    }
    const activeId = event.active.id as string
    const overId = event.over.id as string
    const prevLineId = findLineId(activeId)
    const overLineId = findLineId(overId)
    console.log('prevLineId', prevLineId, activeId)
    console.log('overLineId', overLineId, overId)
    if (overLineId) {
      setActiveLine(overLineId)
    }
    if (!prevLineId || !overLineId || prevLineId === overLineId) {
      return
    }
    if (preserveLineIds.includes(overLineId)) {
      return
    }
    if (preserveLineIds.includes(prevLineId)) {
      return
    }
    // if (prevLineId === LINEID_INITIAL) {
    //   setInitialItems((prev) => [...prev.filter((item) => item !== activeId)])
    // }
    setItems((prev) => {
      const prevActiveItems = prev[prevLineId] || []
      const prevOverItems = prev[overLineId] || []
      const prevActiveIndex = prevActiveItems.indexOf(activeId)
      const prevOverIndex = prevOverItems.indexOf(overId)
      if (prevLineId === LINEID_INITIAL) {
        return {
          ...prev,
          [overLineId]: [...prevOverItems, activeId],
        }
      }
      return {
        ...prev,
        [prevLineId]: [...prevActiveItems.filter((item) => item !== activeId)],
        [overLineId]: [
          ...prevOverItems.slice(0, prevOverIndex),
          prevActiveItems[prevActiveIndex],
          ...prevOverItems.slice(prevOverIndex, prevOverItems.length),
        ],
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    setActiveLine(null)
    if (!event.over) {
      return
    }
    const activeId = event.active.id as string
    const overId = event.over.id as string
    const prevLineId = findLineId(activeId)
    const overLineId = findLineId(overId)
    if (overLineId === LINEID_NEWLINE_BEFORE) {
      generateNewLine('before')
      return
    }
    if (overLineId === LINEID_NEWLINE_AFTER) {
      generateNewLine('after')
      return
    }
    if (prevLineId === LINEID_INITIAL && overLineId && !preserveLineIds.includes(overLineId)) {
      // move to a new line
      // setInitialItems((prev) => [...prev.filter((item) => item !== activeId)])
      setItems((prev) => {
        return {
          ...prev,
          [overLineId]: [...(prev[overLineId] || []), activeId],
        }
      })
      return
    }
    if (!prevLineId || !overLineId || prevLineId !== overLineId) {
      return
    }
    const activeIndex = items[overLineId].indexOf(activeId)
    const overIndex = items[overLineId].indexOf(overId)
    if (activeIndex !== overIndex) {
      setItems((prev) => {
        // delete empty line
        // biome-ignore lint/complexity/noForEach: <explanation>
        Object.keys(prev).forEach((key) => {
          // if (prev[key].length === 0) {
          //   delete prev[key]
          // }
        })
        return {
          ...prev,
          [overLineId]: arrayMove(items[overLineId], activeIndex, overIndex),
        }
      })
    }
  }

  const generateNewLine = (type: 'before' | 'after') => {
    const newLineId = genRandomLineId()
    if (type === 'before') {
      setLineIds((prev) => [newLineId, ...prev])
      setItems((prev) => {
        return {
          ...prev,
          [newLineId]: [],
        }
      })
    } else {
      setLineIds((prev) => [...prev, newLineId])
      setItems((prev) => {
        return {
          ...prev,
          [newLineId]: [],
        }
      })
    }
    return newLineId
  }

  return (
    <div className="flex flex-col">
      <div className="my-4">
        <PoemEditorInitialBox id={LINEID_INITIAL} items={initialItems} hover={activeLine === LINEID_INITIAL} />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={debounce(handleDragOver, 150)}
        onDragEnd={handleDragEnd}
      >
        <PoemEditorNewLine id={LINEID_NEWLINE_BEFORE} hover={activeLine === LINEID_NEWLINE_BEFORE} />
        {lineIds.map((lineId, index) => (
          <PoemEditorLine
            key={lineId}
            id={lineId}
            index={index}
            items={items[lineId] || []}
            hover={activeLine === lineId}
          />
        ))}
        <PoemEditorNewLine id={LINEID_NEWLINE_AFTER} hover={activeLine === LINEID_NEWLINE_AFTER} />
        <DragOverlay>{activeId ? <PoemPaperSlip id={activeId.toString()} /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}

export default PoemEditor
