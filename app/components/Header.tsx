import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <div className="py-4 md:px-1 px-4 leading-none">
      <Link to="/">
        <h1 className="text-lg">Mayday</h1>
        <h2 className="text-lg -mt-2">
          <span className="text-sky-700 font-bold">Re.</span>Poem 拼贴诗
        </h2>
      </Link>
    </div>
  )
}

export default Header