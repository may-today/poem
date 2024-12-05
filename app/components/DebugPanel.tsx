import { lineIdListAtom, lineWordListMapAtom } from '@/stores/poem'
import { useAtomValue } from 'jotai'

const DebugPanel: React.FC = () => {
  const lineIdList = useAtomValue(lineIdListAtom)
  const lineWordListMap = useAtomValue(lineWordListMapAtom)
  return (
    <div>
      <pre className="text-xs border border-gray-400/50 my-2">
        {JSON.stringify({ lineIdList, lineWordListMap }, null, 2)}
      </pre>
    </div>
  )
}

export default DebugPanel
