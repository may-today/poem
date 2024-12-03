import { useMemo, useEffect } from 'react'

interface PoemPaperSlipProps {
  id: string
  onClick?: () => void
}

const PoemPaperSlip: React.FC<PoemPaperSlipProps> = (props) => {
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
      {props.id}
    </div>
  )
}

export default PoemPaperSlip
