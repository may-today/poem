import {
  Links,
  Meta,
  Form,
  Scripts,
  ScrollRestoration,
  Outlet,
} from "@remix-run/react";

import "./tailwind.css";

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
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                aria-label="Search contacts"
                id="q"
                name="q"
                placeholder="Search"
                type="search"
              />
              <div
                aria-hidden
                hidden={true}
                id="search-spinner"
              />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <ul>
              <li>
                <a href={"/contacts/1"}>Your Name</a>
              </li>
              <li>
                <a href={"/contacts/2"}>Your Friend</a>
              </li>
            </ul>
          </nav>
        </div>
        <div id="content">{children}</div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const App: React.FC = () => {
  return (
    <Outlet />
  );
}

export default App;
