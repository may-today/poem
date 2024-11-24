import type { MetaFunction } from '@remix-run/node'
import Header from './Header'
import Footer from './Footer'
import PoemEditor from '@/components/PoemEditor'
import SlipLibrary from '@/components/SlipLibrary'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <>
      <Header />
      <div className="flex-1 flex flex-col items-stretch gap-16">
        <PoemEditor />
        <SlipLibrary />
      </div>
      <Footer />
    </>
  )
}
