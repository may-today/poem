import clsx from 'clsx'
import { useDataStore } from '@/stores/data'
import { usePoemStore } from '@/stores/poem'
import PoemPaperSlip from './PoemPaperSlip'

const PoemEditorInitialBox: React.FC = (props) => {
  const wordIdFlattenMap = useDataStore((state) => state.wordIdFlattenMap)
  const addSelectedWordId = usePoemStore((state) => state.addSelectedWordId)
  const initialItems = Object.keys(wordIdFlattenMap)
    .sort(() => Math.random() - 0.5)
    .slice(0, 50)

  return (
    <div
      className={clsx(['flex justify-start flex-wrap min-h-14 p-2', 'border border-gray-400/50 border-dashed'])}
    >
      {initialItems.map((id) => (
        <PoemPaperSlip
          key={id.toString()}
          id={id.toString()}
          onClick={() => {
            addSelectedWordId(id)
          }}
        />
      ))}
    </div>
  )
}

export default PoemEditorInitialBox
