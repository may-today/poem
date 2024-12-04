import { useEffect } from 'react'
import type { MetaFunction } from '@remix-run/node'
import Header from './Header'
import Footer from './Footer'
import PoemEditor from '@/components/PoemEditor'
import SlipLibrary from '@/components/SlipLibrary'
import { useDataStore } from '@/stores/data'
import PoemEditorInitialBox from '@/components/PoemEditorInitialBox'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  const prepareData = useDataStore((state) => state.prepareData)
  useEffect(() => {
    prepareData()
  }, [prepareData])

  return (
    <>
      <Header />
      <div className="flex-1 flex flex-col items-stretch gap-16">
        <PoemEditor />
        <PoemEditorInitialBox />
        <SlipLibrary />
      </div>
      <Footer />
    </>
  )
}
