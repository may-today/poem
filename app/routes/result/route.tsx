import { useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import { useNavigate } from '@remix-run/react'
import { toPng } from 'html-to-image'
import { startConfetti } from '@/utils/anims'
import { selectedWordsAtom, selectedSongsAtom } from '@/stores/poem'
import { Disclosure, DisclosureContent, DisclosureTrigger } from '@/components/motion-ui/disclosure'
import PoemRenderer from '@/components/PoemRenderer/PoemRenderer'
import Footer from '@/components/Footer'

export default function Result() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const selectedWords = useAtomValue(selectedWordsAtom)
  const selectedSongs = useAtomValue(selectedSongsAtom)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedWords.length === 0) {
      navigate('/')
      return
    }
    startConfetti()
  }, [navigate])

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'mayday-poem.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  return (
    <>
      <div className={clsx(['flex-1 flex flex-col items-center gap-4 h-full overflow-auto'])}>
        <div className="bg-white p-2 shadow-sm">
          <PoemRenderer ref={ref} />
        </div>
        {selectedSongs.length > 3 && (
          <div>
            <Disclosure className="w-80 rounded-md border border-zinc-200 px-3 dark:border-zinc-700">
              <DisclosureTrigger>
                <button className="w-full py-2 text-sm flex items-center justify-between opacity-60" type="button">
                  完整引用列表 ({selectedSongs.length})
                  <ChevronDown size={16} strokeWidth={1.5} />
                </button>
              </DisclosureTrigger>
              <DisclosureContent>
                <div className="pb-2">
                  <p className="text-xs text-black/30">{selectedSongs.map((name) => `《${name}》`).join('')}</p>
                </div>
              </DisclosureContent>
            </Disclosure>
          </div>
        )}
        <div className="flex gap-2">
          <button className="button button-normal" onClick={() => navigate('/')} type="button">
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <button className="button button-normal" onClick={onButtonClick} type="button">
            下载图片
          </button>
        </div>
        <Footer />
      </div>
    </>
  )
}
