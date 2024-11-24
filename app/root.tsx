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
      <body>
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
      <div className="mx-auto max-w-screen-lg">
        <span
          className={clsx([
            'rounded-full bg-gradient-to-r from-sky-400 to-teal-300',
            'opacity-40 -z-10 aspect-square w-full max-w-screen-lg blur-3xl bottom-[calc(100%-100px)] fixed',
          ])}
        />
      </div>
      <div className="max-w-2xl mx-auto">
        <Outlet />
      </div>
    </>
  )
}

export const HydrateFallback = () => {
  return <p>Loading...</p>
}

export default App
