import { useState } from 'react'
import { Library, X } from 'lucide-react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { wordIdSlugMapAtom, wordIdFlattenMapAtom } from '@/stores/data'
import { getSongNameById } from '@/utils/data'
import PoemPaperSlip from '../PoemPaperSlip'
import { importWordToLastLineAtom, isInSelectedWordsAtom, selectedSongsAtom, selectedWordsAtom } from '@/stores/poem'

const PoemEditorSlipPanel: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="button button-ghost" type="button">
          <Library size={16} strokeWidth={1.5} />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[70vh] bg-[#eeeeee]">
        <Header />
        <p className="flex-1 flex flex-col px-4 pb-2 overflow-auto">
          <MainContent />
        </p>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <button className="button button-ghost" type="button">
              关闭
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const Header: React.FC = () => {
  const wordIdFlattenMap = useAtomValue(wordIdFlattenMapAtom)
  const selectedSongs = useAtomValue(selectedSongsAtom)
  const selectedWords = useAtomValue(selectedWordsAtom)

  return (
    <DrawerHeader className="text-left">
      <DrawerTitle>全部词片</DrawerTitle>
      <DrawerDescription>
        共有 {Object.keys(wordIdFlattenMap).length} 个词片，已选来自 {selectedSongs.length} 首歌曲的{' '}
        {selectedWords.length} 个词片
      </DrawerDescription>
    </DrawerHeader>
  )
}

const MainContent: React.FC = () => {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null)
  const wordIdSlugMap = useAtomValue(wordIdSlugMapAtom)
  const isInSelectedWords = useAtomValue(isInSelectedWordsAtom)
  const importWordToLastLine = useSetAtom(importWordToLastLineAtom)

  return (
    <>
      {!currentSongId && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(wordIdSlugMap).map(([songId, words]) => (
            <button
              key={songId}
              className="button button-small button-ghost"
              type="button"
              onClick={() => setCurrentSongId(songId)}
            >
              {getSongNameById(songId)}
              {Object.keys(words).length && ` (${Object.keys(words).length})`}
            </button>
          ))}
        </div>
      )}
      {currentSongId && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="mb-2">
            <button
              key={currentSongId}
              className="button button-small button-ghost"
              type="button"
              onClick={() => setCurrentSongId(null)}
            >
              {getSongNameById(currentSongId)}
              <X size={14} strokeWidth={1.5} className="mt-[2px] -ml-1" />
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {Object.keys(wordIdSlugMap[currentSongId]).map((wordId) => (
              <PoemPaperSlip
                key={wordId}
                id={wordId}
                active={isInSelectedWords(wordId)}
                onClick={() => {
                  !isInSelectedWords(wordId) && importWordToLastLine(wordId)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default PoemEditorSlipPanel
