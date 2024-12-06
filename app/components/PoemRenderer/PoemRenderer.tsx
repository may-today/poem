import { forwardRef, useMemo } from 'react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { lineIdListAtom, lineWordListMapAtom } from '@/stores/poem'
import PoemRendererLine from './PoemRendererLine'
import PoemRendererFooter from './PoemRendererFooter'

const PoemRenderer = forwardRef<HTMLDivElement>((props, ref) => {
  const lineIdList = useAtomValue(lineIdListAtom)
  const lineWordListMap = useAtomValue(lineWordListMapAtom)
  const randomContainerStyleClass = useMemo(() => {
    const styleId = Math.floor(Math.random() * 6) + 1
    return `renderer-container-${styleId}`
  }, [])

  return (
    <div className={clsx(['renderer-container relative', randomContainerStyleClass])} ref={ref}>
      <div className="p-2">
        {lineIdList.map((lineId, index) => (
          <PoemRendererLine key={lineId} id={lineId} index={index} items={lineWordListMap[lineId] || []} />
        ))}
      </div>
      <PoemRendererFooter />
      <div className="absolute inset-0" />
    </div>
  )
})

export default PoemRenderer
