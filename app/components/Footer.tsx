import { Link } from '@remix-run/react'

const Footer: React.FC = () => {
  return (
    <div className="py-4 md:px-1 px-4 text-xs text-center text-black/30">
      <div className="text-center">
        衍生作品在未获得著作权人许可的情况下
      </div>
      <div className="text-center">
        不得以商业、营销、出版或其他盈利用途使用
      </div>
      <div className="text-center">
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
    </div>
  )
}

export default Footer
