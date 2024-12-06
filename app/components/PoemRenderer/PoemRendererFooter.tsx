import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { selectedSongsAtom } from '@/stores/poem'

const PoemRenderFooter: React.FC = () => {
  const selectedSongs = useAtomValue(selectedSongsAtom)
  if (selectedSongs.length === 0) return null
  if (selectedSongs.length === 1)
    return (
      <div className="flex flex-col items-end bg-white/50 text-xs text-black/40 px-2 py-4">
        <p>来自五月天《{selectedSongs[0]}》的摇滚诗</p>
      </div>
    )
  if (selectedSongs.length <= 3)
    return (
      <div className="flex flex-col items-end bg-white/50 text-xs text-black/40 px-2 py-4">
        <p className="pr-[0.5em]">来自五月天</p>
        <div className="flex flex-wrap w-[60%] justify-end">
          {selectedSongs.map((song) => (
            <p key={song}>《{song}》</p>
          ))}
        </div>
        <p className="pr-[0.5em]">的摇滚诗</p>
      </div>
    )
  return (
    <div className="flex flex-col items-end bg-white/50 text-xs text-black/40 px-2 py-4">
      <p className="pr-[0.5em]">来自五月天</p>
      <div className="flex flex-wrap w-[60%] justify-end">
        {selectedSongs.slice(0, 3).map((song) => (
          <p key={song}>《{song}》</p>
        ))}
      </div>
      <p className="pr-[0.5em]">等{selectedSongs.length}首歌曲的摇滚诗</p>
    </div>
  )
}

export default PoemRenderFooter
