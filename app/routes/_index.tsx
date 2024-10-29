import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <div className="flex flex-col items-center items-center h-screen gap-16">
      <h1>Hello World</h1>
    </div>
  )
}
