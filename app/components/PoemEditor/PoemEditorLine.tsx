import { SortableContext } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import PoemPaperSortableSlip from '../PoemPaperSortableSlip'
import { Plus } from 'lucide-react'

interface PoemEditorLineProps {
  id: string
  items: string[]
  index: number
  hover?: boolean
  beforeButtonHover?: boolean
}

const PoemEditorLine: React.FC<PoemEditorLineProps> = (props) => {
  const { setNodeRef } = useDroppable({ id: props.id })
  const { setNodeRef: setBeforeNodeRef } = useDroppable({ id: `${props.id}:BEFORE` })

  return (
    <SortableContext items={props.items}>
      <div
        ref={setNodeRef}
        className={clsx([
          'editor-line relative flex justify-start flex-wrap min-h-14 w-full px-2 py-3',
          'border border-t-0 border-b-0 border-gray-400/50 border-dashed transition-colors',
          props.hover ? 'bg-black/5' : '',
        ])}
      >
        {props.items.map((id) => (
          <PoemPaperSortableSlip key={id.toString()} id={id.toString()} />
        ))}
        {props.index > 0 && (
          <div
            ref={setBeforeNodeRef}
            className={clsx([
              'absolute -top-4 right-4 flex justify-center items-center h-8 w-10',
              'border border-gray-400/50 border-dashed transition-colors',
              props.beforeButtonHover ? 'bg-black/5' : '',
            ])}
          >
            <Plus size={16} strokeWidth={1.5} className="opacity-30" />
          </div>
        )}
      </div>
    </SortableContext>
  )
}

export default PoemEditorLine
