import { useEffect } from 'react'
import clsx from 'clsx'
import { useSetAtom } from 'jotai'
import type { MetaFunction } from '@remix-run/node'
import { useMediaQuery } from '@uidotdev/usehooks'
import Header from './Header'
import Footer from './Footer'
import PoemEditor from '@/components/PoemEditor'
import SlipLibrary from '@/components/SlipLibrary'
import { prepareData } from '@/stores/data'
import PoemEditorInitialBox from '@/components/PoemEditorInitialBox'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {
  const setPrepareData = useSetAtom(prepareData)
  const isMediumDevice = useMediaQuery('only screen and (min-width : 769px)')

  useEffect(() => {
    setPrepareData()
  }, [setPrepareData])

  return (
    <>
      <Header />
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
            'md:flex-[2] overflow-auto py-4 md:px-4',
            'border-t md:border-t-0 border-gray-400/20',
            'bg-white/50 md:bg-white/30 rounded-lg md:h-[70%] shadow-lg md:shadow-none',
          ])}
        >
          <PoemEditorInitialBox animated={!isMediumDevice} />
          {/* <SlipLibrary /> */}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  )
}
