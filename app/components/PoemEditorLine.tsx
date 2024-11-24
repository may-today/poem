import { SortableContext } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import PoemPaperSortableSlip from './PoemPaperSortableSlip'

interface PoemEditorLineProps {
  id: string
  items: string[]
  index: number
  hover: boolean
}

const PoemEditorLine: React.FC<PoemEditorLineProps> = (props) => {
  const { setNodeRef } = useDroppable({ id: props.id })

  return (
    <SortableContext items={props.items}>
      <div
        ref={setNodeRef}
        className={clsx([
          'flex justify-start flex-wrap min-h-14 p-2',
          'border border-gray-400/50 border-dashed transition-colors',
          'border-b-0',
          props.index === 0 && 'border-t-0',
          props.hover ? 'bg-black/5' : '',
        ])}
      >
        {props.items.map((id) => (
          <PoemPaperSortableSlip key={id.toString()} id={id.toString()} />
        ))}
      </div>
    </SortableContext>
  )
}

export default PoemEditorLine
