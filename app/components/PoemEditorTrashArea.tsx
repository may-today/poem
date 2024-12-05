import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { Trash2 } from 'lucide-react'

const PoemEditorTrashArea: React.FC<{
  id: string
  hover: boolean
}> = (props) => {
  const { setNodeRef } = useDroppable({ id: props.id })

  return (
    <div
      ref={setNodeRef}
      className={clsx([
        'flex justify-center items-center h-12 mt-2',
        'border border-red-400/50 border-dashed transition-colors',
        props.hover ? 'bg-red-400/5' : '',
      ])}
    >
      <Trash2 size={16} strokeWidth={1.5} className="text-red-400/70" />
    </div>
  )
}

export default PoemEditorTrashArea
