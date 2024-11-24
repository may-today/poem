import { useState } from 'react'
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
import { LINEID_NEWLINE_BEFORE, LINEID_NEWLINE_AFTER, preserveLineIds } from '@/utils/constants'

import PoemEditorLine from './PoemEditorLine'
import PoemEditorNewLine from './PoemEditorNewLine'
import PoemPaperSlip from './PoemPaperSlip'

const PoemEditor: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeLine, setActiveLine] = useState<string | null>(null)
  const [items, setItems] = useState<Record<string, string[]>>({
    line1: ['用最小回忆', '香槟和气球', '月光晒干眼泪', '别走', '从前只想装懂'],
    line2: ['它给了你自由', '等你回答', '就当我飞翔', '买一杯果汁'],
    line3: ['这一刻', '星星在闪烁', '你孤独的生存', '喝着汽水'],
    line4: ['少年回头望', '想变成', '幻觉'],
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findLineId = (id: string) => {
    if (preserveLineIds.includes(id)) {
      return id
    }
    if (id in items) {
      return id as string
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
    if (overLineId) {
      setActiveLine(overLineId)
    }
    if (!prevLineId || !overLineId || prevLineId === overLineId) {
      return
    }
    if (preserveLineIds.includes(overLineId)) {
      return
    }

    setItems((prev) => {
      const prevActiveItems = prev[prevLineId]
      const prevOverItems = prev[overLineId]
      const prevActiveIndex = prevActiveItems.indexOf(activeId)
      const prevOverIndex = prevOverItems.indexOf(overId)

      return {
        ...prev,
        [prevLineId]: [...prev[prevLineId].filter((item) => item !== activeId)],
        [overLineId]: [
          ...prev[overLineId].slice(0, prevOverIndex),
          items[prevLineId][prevActiveIndex],
          ...prev[overLineId].slice(prevOverIndex, prev[overLineId].length),
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
    if (prevLineId && overLineId && preserveLineIds.includes(overLineId)) {
      const newLineId = Date.now().toString()
      setItems((prev) => {
        const prevActiveItems = prev[prevLineId]
        const prevActiveIndex = prevActiveItems.indexOf(activeId)
        if (overLineId === LINEID_NEWLINE_BEFORE) {
          return {
            [newLineId]: [
              items[prevLineId][prevActiveIndex],
            ],
            ...prev,
            [prevLineId]: [...prev[prevLineId].filter((item) => item !== activeId)],
          }
        } 
        return {
          ...prev,
          [prevLineId]: [...prev[prevLineId].filter((item) => item !== activeId)],
          [newLineId]: [
            items[prevLineId][prevActiveIndex],
          ],
        }
      })
      setActiveLine(null)
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
          if (prev[key].length === 0) {
            delete prev[key]
          }
        })
        return {
          ...prev,
          [overLineId]: arrayMove(items[overLineId], activeIndex, overIndex),
        }
      })
    }
  }

  return (
    <div className="flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={debounce(handleDragOver, 150)}
        onDragEnd={handleDragEnd}
      >
        <PoemEditorNewLine id={LINEID_NEWLINE_BEFORE} hover={activeLine === LINEID_NEWLINE_BEFORE} />
        {Object.keys(items).map((lineId) => (
          <PoemEditorLine key={lineId} id={lineId} items={items[lineId]} hover={activeLine === lineId} />
        ))}
        <PoemEditorNewLine id={LINEID_NEWLINE_AFTER} hover={activeLine === LINEID_NEWLINE_AFTER} />
        <DragOverlay>{activeId ? <PoemPaperSlip id={activeId.toString()} /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}

export default PoemEditor
