import {
  Links,
  Meta,
  Form,
  Scripts,
  ScrollRestoration,
  Outlet,
} from '@remix-run/react'

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
        <div id="content">{children}</div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

const App: React.FC = () => {
  return <Outlet />
}

export default App
