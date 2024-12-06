import { useEffect, useCallback, useRef } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import { useNavigate } from '@remix-run/react'
import { toPng } from 'html-to-image'
import PoemRenderer from '@/components/PoemRenderer/PoemRenderer'
import { startConfetti } from '@/utils/anims'
import { selectedWordsAtom } from '@/stores/poem'
import Footer from '@/components/Footer'

export default function Result() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const selectedWords = useAtomValue(selectedWordsAtom)

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
