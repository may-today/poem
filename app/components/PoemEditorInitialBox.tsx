import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { randomWordIdListAtom } from '@/stores/data'
// import { usePoemStore } from '@/stores/poem'
import PoemPaperSlip from './PoemPaperSlip'
import { InfiniteSlider } from '@/components/motion-ui/infinite-slider'

const PoemEditorInitialBox: React.FC = (props) => {
  const randomWordIdList = useAtomValue(randomWordIdListAtom)
  const groupList = generateGroupList(randomWordIdList)

  return (
    <div className={clsx(['relative flex justify-start flex-wrap'])}>
      {groupList.map((group, index) => (
        <InfiniteSlider
          key={group.join('-')}
          gap={0}
          reverse={index % 2 === 1}
          duration={120}
          durationOnHover={360}
        >
          {group.map((id) => (
            <PoemPaperSlip key={id.toString()} id={id.toString()} />
          ))}
        </InfiniteSlider>
      ))}
    </div>
  )
}

// 将wordIdList平均分为5组
const generateGroupList = (wordIdList: string[]) => {
  const groupList = []
  const groupSize = Math.ceil(wordIdList.length / 5)
  for (let i = 0; i < 5; i++) {
    groupList.push(wordIdList.slice(i * groupSize, (i + 1) * groupSize))
  }
  return groupList
}

export default PoemEditorInitialBox
