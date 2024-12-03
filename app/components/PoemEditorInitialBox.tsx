import { SortableContext } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import PoemPaperSlip from './PoemPaperSlip'

interface PoemEditorInitialBoxProps {
  id: string
  items: string[]
  hover: boolean
}

const PoemEditorInitialBox: React.FC<PoemEditorInitialBoxProps> = (props) => {
  const { setNodeRef } = useDroppable({ id: props.id })

  return (
    <div
      ref={setNodeRef}
      className={clsx(['flex justify-start flex-wrap min-h-14 p-2', 'border border-gray-400/50 border-dashed'])}
    >
      {props.items.map((id) => (
        <PoemPaperSlip key={id.toString()} id={id.toString()} />
      ))}
    </div>
  )
}

export default PoemEditorInitialBox
