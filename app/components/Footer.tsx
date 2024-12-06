import { Link } from '@remix-run/react'

const Footer: React.FC = () => {
  return (
    <div className="py-4 md:px-1 px-4 text-xs text-center text-black/40">
      <span>
        Made by{' '}
        <Link to="https://ddiu.io" target="_blank" className="underline">
          Diu
        </Link>
      </span>
      <span className="mx-2">|</span>
      <span>
        <Link to="https://github.com/may-today/poem" target="_blank" className="underline">
          Source Code
        </Link>
      </span>
    </div>
  )
}

export default Footer
