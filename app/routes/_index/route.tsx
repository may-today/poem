import { useEffect } from 'react'
import { useNavigate } from '@remix-run/react'
import clsx from 'clsx'
import { useSetAtom } from 'jotai'
import { useMediaQuery } from '@uidotdev/usehooks'
import { RefreshCw } from 'lucide-react'
import PoemEditor from '@/components/PoemEditor/PoemEditor'
import PoemEditorSlipPanel from '@/components/PoemEditor/PoemEditorSlipPanel'
import { prepareData, refreshRandomWordIdList } from '@/stores/data'
import { resetStateAtom } from '@/stores/poem'
import PoemEditorInitialBox from '@/components/PoemEditor/PoemEditorInitialBox'
import Footer from '@/components/Footer'

export default function Index() {
  const navigate = useNavigate()
  const setPrepareData = useSetAtom(prepareData)
  const setRefreshRandomWordIdList = useSetAtom(refreshRandomWordIdList)
  const setResetStateAtom = useSetAtom(resetStateAtom)
  const isMediumDevice = useMediaQuery('only screen and (min-width : 769px)')

  useEffect(() => {
    setPrepareData()
  }, [setPrepareData])

  return (
    <>
      <div
        className={clsx([
          'flex-1 flex flex-col md:flex-row items-stretch md:items-start md:gap-4 h-full md:mb-4 overflow-hidden',
        ])}
      >
        <div
          id="scroll-container"
          className="flex-1 md:flex-[3] flex flex-col items-stretch h-full gap-16 overflow-auto"
        >
          <PoemEditor />
        </div>
        <div
          className={clsx([
            'md:flex-[2] flex flex-col items-stretch overflow-auto py-4 md:px-4',
            'border-t md:border-t-0 border-gray-400/20',
            'bg-white/50 md:bg-white/30 rounded-lg md:h-[70%] shadow-sm md:shadow-none',
          ])}
        >
          <div className="flex-1 overflow-auto">
            <PoemEditorInitialBox animated={!isMediumDevice} />
          </div>
          <div className="flex justify-between gap-2 px-4 md:px-0 pt-2 mt-2 border-t border-gray-400/20">
            <button className="button button-ghost danger" onClick={setResetStateAtom} type="button">
              重置
            </button>
            <div className="flex items-stretch gap-2">
              <PoemEditorSlipPanel />
              <button className="button button-ghost" onClick={setRefreshRandomWordIdList} type="button">
                <RefreshCw size={16} strokeWidth={1.5} />
              </button>
              <button className="button button-ghost" onClick={() => navigate('/result')} type="button">
                完成
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMediumDevice && <Footer />}
    </>
  )
}
