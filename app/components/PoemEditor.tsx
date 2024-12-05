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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { useAtomValue, useSetAtom } from 'jotai'
import { debounce } from '@/utils/scheduled'
import { LINEID_NEWLINE_BEFORE, LINEID_NEWLINE_AFTER, LINEID_TRASH } from '@/utils/constants'
import {
  lineIdListAtom,
  lineWordListMapAtom,
  addNewLineAtom,
  moveWordToExistingLineAtom,
  wordMoveInlineAtom,
  deleteWordFromLineAtom,
} from '@/stores/poem'
// import { startConfetti } from '@/utils/anims'
import PoemEditorLine from './PoemEditorLine'
import PoemEditorNewLine from './PoemEditorNewLine'
import PoemPaperSlip from './PoemPaperSlip'
import PoemEditorTrashArea from './PoemEditorTrashArea'
// import DebugPanel from './DebugPanel'

const PoemEditor: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeLine, setActiveLine] = useState<string | null>(null)
  const lineIdList = useAtomValue(lineIdListAtom)
  const lineWordListMap = useAtomValue(lineWordListMapAtom)
  const addNewLine = useSetAtom(addNewLineAtom)
  const moveWordToExistingLine = useSetAtom(moveWordToExistingLineAtom)
  const wordMoveInline = useSetAtom(wordMoveInlineAtom)
  const deleteWordFromLine = useSetAtom(deleteWordFromLineAtom)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findLineId = (id: string) => {
    if (id.startsWith('L:')) {
      return id
    }
    return Object.keys(lineWordListMap).find((key) => lineWordListMap[key].includes(id))
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      return
    }
    const overId = event.over.id as string
    const overLineId = findLineId(overId)
    if (overLineId) {
      setActiveLine(overLineId)
      return
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    setActiveLine(null)
    if (!event.over) {
      return
    }
    const wordId = event.active.id as string
    const overId = event.over.id as string
    const prevLineId = findLineId(wordId)
    const overLineId = findLineId(overId)
    if (!prevLineId || !overLineId) {
      return
    }
    if (overLineId === LINEID_NEWLINE_BEFORE) {
      const newLineId = addNewLine(0)
      moveWordToExistingLine(wordId, prevLineId, newLineId)
      return
    }
    if (overLineId === LINEID_NEWLINE_AFTER) {
      const newLineId = addNewLine(lineIdList.length)
      moveWordToExistingLine(wordId, prevLineId, newLineId)
      return
    }
    if (overLineId.endsWith(':BEFORE')) {
      const targetLineId = overLineId.replace(':BEFORE', '')
      const newLineId = addNewLine(targetLineId)
      moveWordToExistingLine(wordId, prevLineId, newLineId)
      return
    }
    if (overLineId === LINEID_TRASH) {
      deleteWordFromLine(prevLineId, wordId)
      return
    }
    if (prevLineId !== overLineId) {
      moveWordToExistingLine(wordId, prevLineId, overLineId)
      return
    }
    wordMoveInline(overLineId, wordId, overId)
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setActiveLine(null)
  }

  return (
    <div className="flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={debounce(handleDragOver, 150)}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        autoScroll
      >
        <PoemEditorNewLine id={LINEID_NEWLINE_BEFORE} hover={activeLine === LINEID_NEWLINE_BEFORE} />
        <div>
          {lineIdList.map((lineId, index) => (
            <PoemEditorLine
              key={lineId}
              id={lineId}
              index={index}
              items={lineWordListMap[lineId] || []}
              hover={activeLine === lineId}
              beforeButtonHover={activeLine === `${lineId}:BEFORE`}
            />
          ))}
        </div>
        <PoemEditorNewLine id={LINEID_NEWLINE_AFTER} hover={activeLine === LINEID_NEWLINE_AFTER} />
        <PoemEditorTrashArea id={LINEID_TRASH} hover={activeLine === LINEID_TRASH} />
        <DragOverlay>{activeId ? <PoemPaperSlip id={activeId.toString()} /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}

export default PoemEditor
