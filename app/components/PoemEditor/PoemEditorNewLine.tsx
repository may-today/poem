import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { Plus } from 'lucide-react'

interface PoemEditorNewLineProps {
  id: string
  hover: boolean
}

const PoemEditorNewLine: React.FC<PoemEditorNewLineProps> = (props) => {
  const { setNodeRef } = useDroppable({ id: props.id })

  return (
    <div
      ref={setNodeRef}
      className={clsx([
        'flex justify-center items-center h-10 w-full gap-1',
        'border border-gray-400/50 border-dashed transition-colors',
        props.hover ? 'bg-black/5' : '',
      ])}
    >
      <Plus size={16} strokeWidth={1.5} className="opacity-30" />
    </div>
  )
}

export default PoemEditorNewLine
