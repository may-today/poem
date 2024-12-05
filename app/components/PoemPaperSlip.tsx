import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { wordByIdAtom } from '@/stores/data'
import clsx from 'clsx'

interface PoemPaperSlipProps {
  id: string
  active?: boolean
  onClick?: () => void
}

const PoemPaperSlip: React.FC<PoemPaperSlipProps> = (props) => {
  const wordById = useAtomValue(wordByIdAtom)
  const word = wordById(props.id)
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
      className={clsx([
        'paper-slip',
        props.active ? 'bg-black/5' : '',
      ])}
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
    >
      {word}
    </div>
  )
}

export default PoemPaperSlip
