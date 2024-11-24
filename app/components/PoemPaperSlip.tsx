import { useMemo, useEffect } from 'react'

interface PoemPaperSlipProps {
  id: string
}

const PoemPaperSlip: React.FC<PoemPaperSlipProps> = (props) => {
  const randomRotation = useMemo(() => {
    const rotation = (Math.random() - 0.5) * 4
    return `rotate(${rotation}deg)`
  }, [])

  return (
    <div style={{ transform: randomRotation }} className="paper-slip">
      {props.id}
    </div>
  )
}

export default PoemPaperSlip
