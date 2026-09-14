import { useState, type CSSProperties } from 'react'
import type { Word } from '../poem-state'
import { copyPoem, downloadPoem, poemSourceText } from '../lib/poem-export'

type Props = { lines: Word[][]; onEdit: () => void }

export default function PoemPreview({ lines, onEdit }: Props) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleCopy() {
    try {
      await copyPoem(lines)
      setCopyStatus('success')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <section className="preview-screen">
      <article className="poem-card" aria-label="诗歌预览">
        <div className="poem-lines">
          {lines.filter((line) => line.length).map((line, index) => (
            <p key={index} style={{ '--i': index } as CSSProperties}>{line.map((word) => word.text).join('')}</p>
          ))}
        </div>
        <footer>
          <small>{poemSourceText(lines)}</small>
        </footer>
      </article>
      <div className="action-row">
        <button className="secondary-button" onClick={onEdit}>继续编辑</button>
        <button className="secondary-button" onClick={handleCopy} aria-live="polite">
          {copyStatus === 'success' ? '已复制' : copyStatus === 'error' ? '复制失败，请重试' : '复制文字'}
        </button>
        <button className="primary-button" onClick={() => downloadPoem(lines)}>保存图片</button>
      </div>
    </section>
  )
}
