import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PoemPaperSlip from './PoemPaperSlip'

interface PoemPaperSlipProps {
  id: string
}

const PoemPaperSortableSlip: React.FC<PoemPaperSlipProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PoemPaperSlip id={props.id} />
    </div>
  )
}

export default PoemPaperSortableSlip
