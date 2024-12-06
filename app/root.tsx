import { Links, Meta, Scripts, ScrollRestoration, Outlet } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/node'
import clsx from 'clsx'
import Header from './components/Header'

import './tailwind.css'

export const meta: MetaFunction = () => {
  return [{ title: 'Mayday拼贴诗' }, { name: 'description', content: '来自 Mayday 和你的摇滚拼贴诗' }]
}

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#aadfef" />
        <link rel="icon" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body
        className={clsx(['flex flex-col', 'supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh]'])}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

const App: React.FC = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1/2 overflow-hidden -z-10">
        <span
          className={clsx([
            'md:rounded-full bg-gradient-to-t md:bg-gradient-to-r from-sky-400 to-teal-300',
            'opacity-40 aspect-square blur-3xl',
            'absolute -z-10 w-[150%] md:w-full',
            'bottom-[calc(100%-120px)]',
            'left-1/2 -translate-x-1/2',
            'md:left-0 md:translate-x-0',
          ])}
        />
      </div>
      <div className="flex-1 flex flex-col items-stretch w-full max-w-4xl mx-auto overflow-hidden">
        <Header />
        <Outlet />
      </div>
    </>
  )
}

export const HydrateFallback = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="global-loader" />
    </div>
  )
}

export default App
