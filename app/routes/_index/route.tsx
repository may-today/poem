import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import type { MetaFunction } from '@remix-run/node'
import Header from './Header'
import Footer from './Footer'
import PoemEditor from '@/components/PoemEditor'
import SlipLibrary from '@/components/SlipLibrary'
import { prepareData } from '@/stores/data'
import PoemEditorInitialBox from '@/components/PoemEditorInitialBox'
import clsx from 'clsx'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {
  const setPrepareData = useSetAtom(prepareData)

  useEffect(() => {
    setPrepareData()
  }, [setPrepareData])

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row items-stretch h-full">
        <div className="flex-1 flex flex-col items-stretch gap-16 overflow-auto">
          <PoemEditor />
        </div>
        <div
          className={clsx([
            'md:flex-1 overflow-hidden py-4 md:py-0 md:px-2',
            'border-t md:border-t-0 border-gray-400/20',
            'bg-white/50 md:bg-transparent',
          ])}
        >
          <PoemEditorInitialBox />
          <SlipLibrary />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  )
}
