import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
} from '@remix-run/react'
import clsx from 'clsx'

import './tailwind.css'

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={clsx([
        'flex flex-col',
        'supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh]',
      ])}>
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
      <div className="mx-auto w-full max-w-screen-lg">
        <span
          className={clsx([
            'rounded-full bg-gradient-to-r from-sky-400 to-teal-300',
            'opacity-40 aspect-square blur-3xl bottom-[calc(100%-120px)]',
            'w-full max-w-screen-lg fixed -z-10',
          ])}
        />
      </div>
      <div className="flex-1 flex flex-col items-stretch w-full max-w-2xl mx-auto">
        <Outlet />
      </div>
    </>
  )
}

export const HydrateFallback = () => {
  return <p>Loading...</p>
}

export default App
