import clsx from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { randomWordIdListAtom } from '@/stores/data'
import { importWordToLastLineAtom, isInSelectedWordsAtom } from '@/stores/poem'
import PoemPaperSlip from '../PoemPaperSlip'
import { InfiniteSlider } from '@/components/motion-ui/infinite-slider'

const PoemEditorInitialBox: React.FC<{
  animated?: boolean
}> = (props) => {
  const randomWordIdList = useAtomValue(randomWordIdListAtom)
  const isInSelectedWords = useAtomValue(isInSelectedWordsAtom)
  const importWordToLastLine = useSetAtom(importWordToLastLineAtom)
  const groupList = generateGroupList(randomWordIdList, 4)
  const container = document.getElementById('scroll-container')

  return (
    <div className={clsx(['relative flex justify-start flex-wrap'])}>
      {props.animated && groupList.map((group, index) => (
        <InfiniteSlider
          key={group.join('-')}
          gap={0}
          reverse={index % 2 === 1}
          duration={120}
          durationOnHover={360}
        >
          {group.map((wordId) => (
            <PoemPaperSlip
              key={wordId}
              id={wordId}
              active={isInSelectedWords(wordId)}
              onClick={() => {
                !isInSelectedWords(wordId) && importWordToLastLine(wordId)
              }}
            />
          ))}
        </InfiniteSlider>
      ))}
      {!props.animated && randomWordIdList.map((wordId) => (
        <PoemPaperSlip
          key={wordId}
          id={wordId}
          active={isInSelectedWords(wordId)}
          onClick={() => {
            !isInSelectedWords(wordId) && importWordToLastLine(wordId)
            container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
          }}
        />
      ))}
    </div>
  )
}

// 将wordIdList平均分为5组
const generateGroupList = (wordIdList: string[], groupAmount: number) => {
  const groupList = []
  const groupSize = Math.ceil(wordIdList.length / groupAmount)
  for (let i = 0; i < groupAmount; i++) {
    groupList.push(wordIdList.slice(i * groupSize, (i + 1) * groupSize))
  }
  return groupList
}

export default PoemEditorInitialBox
