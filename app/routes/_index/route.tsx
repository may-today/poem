import type { MetaFunction } from '@remix-run/node'
import { clsx } from 'clsx'
import Header from './Header'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <>
      <div className="mx-auto max-w-screen-lg">
        <span
          className={clsx([
            'rounded-full bg-gradient-to-r from-blue-300 to-green-300',
            'opacity-70 -z-10 aspect-square w-full max-w-screen-lg blur-3xl bottom-[calc(100%-200px)] fixed',
          ])}
        />
      </div>
      <div className="flex flex-col items-center items-center h-screen gap-16 p-8">
        <Header />
      </div>
    </>
  )
}
