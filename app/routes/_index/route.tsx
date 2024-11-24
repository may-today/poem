import type { MetaFunction } from '@remix-run/node'
import Header from './Header'
import PoemEditor from '@/components/PoemEditor'

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
      <div className="flex flex-col h-full gap-16">
        <PoemEditor />
      </div>
    </>
  )
}
