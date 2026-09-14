import type { Word } from '../poem-state'
import { downloadPoem, sharePoem } from '../lib/poem-export'

type Props = { lines: Word[][]; onEdit: () => void }

export default function PoemPreview({ lines, onEdit }: Props) {
  const songs = [...new Set(lines.flat().map((word) => word.song))]

  return (
    <section className="preview-screen">
      <article className="poem-card" aria-label="诗歌预览">
        <p className="card-label">你的摇滚诗</p>
        <div className="poem-lines">
          {lines.filter((line) => line.length).map((line, index) => <p key={index}>{line.map((word) => word.text).join('')}</p>)}
        </div>
        <footer>
          <span>Mayday Re.Poem</span>
          <small>来自五月天 {songs.slice(0, 3).map((song) => `《${song}》`).join('')}{songs.length > 3 && `等 ${songs.length} 首歌`}</small>
        </footer>
      </article>
      <div className="action-row">
        <button className="secondary-button" onClick={onEdit}>继续编辑</button>
        <button className="secondary-button" onClick={() => sharePoem(lines)}>分享文字</button>
        <button className="primary-button" onClick={() => downloadPoem(lines)}>保存图片</button>
      </div>
    </section>
  )
}
