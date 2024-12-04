import { useMemo } from 'react'
import { useDataStore } from '@/stores/data'

interface PoemPaperSlipProps {
  id: string
  onClick?: () => void
}

const PoemPaperSlip: React.FC<PoemPaperSlipProps> = (props) => {
  const getWordById = useDataStore((state) => state.getWordById)

  const randomRotation = useMemo(() => {
    const rotation = (Math.random() - 0.5) * 4
    return `rotate(${rotation}deg)`
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      props.onClick?.()
    }
  }

  return (
    <div
      style={{ transform: randomRotation }}
      className="paper-slip"
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
    >
      {getWordById(props.id)}
    </div>
  )
}

export default PoemPaperSlip
