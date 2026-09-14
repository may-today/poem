import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'

export type SheetSnap = 'peek' | 'half' | 'full'
const ORDER: SheetSnap[] = ['peek', 'half', 'full']
/** 收起状态的内容高度（把手 + 搜索行 + 一行词片），不含安全区。 */
const PEEK_CONTENT = 174

type Props = {
  snap: SheetSnap
  onSnap: (snap: SheetSnap) => void
  count: number
  onFinish: () => void
  /** 放在「完成」左侧的附加控件（撤销 / 重做） */
  extra?: ReactNode
  children: ReactNode
}

/** 移动端的「词片键盘」：固定在底部、可拖拽吸附的抽屉。 */
export default function BankSheet({ snap, onSnap, count, onFinish, extra, children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const probeRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>(PEEK_CONTENT)
  const [dragging, setDragging] = useState(false)
  const gesture = useRef<{ startY: number; startHeight: number; lastY: number; lastTime: number; velocity: number } | null>(null)

  const snapHeights = (): Record<SheetSnap, number> => {
    const safe = probeRef.current?.offsetHeight ?? 0
    const viewport = window.innerHeight
    return { peek: PEEK_CONTENT + safe, half: Math.round(viewport * 0.58), full: viewport - 44 }
  }

  // 吸附高度随状态与视口变化
  useLayoutEffect(() => {
    const apply = () => setHeight(snapHeights()[snap])
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [snap])

  // 把当前高度同步给页面：诗稿底部留白、悬浮小工具的位置都依赖它
  useEffect(() => {
    document.documentElement.style.setProperty('--sheet-h', `${height}px`)
    return () => {
      document.documentElement.style.removeProperty('--sheet-h')
    }
  }, [height])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = { startY: event.clientY, startHeight: sheetRef.current?.offsetHeight ?? height, lastY: event.clientY, lastTime: event.timeStamp, velocity: 0 }
    setDragging(true)
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    if (!current) return
    const { peek, full } = snapHeights()
    const next = Math.min(full, Math.max(peek, current.startHeight + (current.startY - event.clientY)))
    const dt = event.timeStamp - current.lastTime
    if (dt > 0) current.velocity = (current.lastY - event.clientY) / dt
    current.lastY = event.clientY
    current.lastTime = event.timeStamp
    setHeight(next)
  }
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    gesture.current = null
    setDragging(false)
    if (!current) return
    const heights = snapHeights()
    const travelled = current.startY - event.clientY
    if (Math.abs(travelled) < 6) {
      // 轻点把手：收起 ↔ 半屏
      onSnap(snap === 'peek' ? 'half' : 'peek')
      setHeight(heights[snap === 'peek' ? 'half' : 'peek'])
      return
    }
    const finalHeight = current.startHeight + travelled
    let target: SheetSnap
    if (Math.abs(current.velocity) > 0.45) {
      const index = ORDER.indexOf(snap)
      target = ORDER[Math.min(ORDER.length - 1, Math.max(0, index + (current.velocity > 0 ? 1 : -1)))]
    } else {
      target = ORDER.reduce((best, key) => (Math.abs(heights[key] - finalHeight) < Math.abs(heights[best] - finalHeight) ? key : best), 'peek' as SheetSnap)
    }
    onSnap(target)
    setHeight(heights[target])
  }
  const onPointerCancel = () => {
    gesture.current = null
    setDragging(false)
    setHeight(snapHeights()[snap])
  }

  return (
    <div ref={sheetRef} className={`bank-sheet is-${snap}${dragging ? ' is-dragging' : ''}`} style={{ height }} role="region" aria-label="词片键盘">
      <div className="sheet-handle" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}>
        <button className="sheet-grabber" aria-label={snap === 'peek' ? '展开词片' : '收起词片'} aria-expanded={snap !== 'peek'} onClick={(event) => {
          // 指针点按已由把手的 pointerup 处理，这里只响应键盘触发（detail === 0）
          if (event.detail === 0) onSnap(snap === 'peek' ? 'half' : 'peek')
        }} />
        <span className="sheet-count"><strong>{count}</strong> 个词片</span>
        <div className="sheet-actions">
          {extra}
          <button className="primary-button sheet-finish" disabled={!count} onClick={onFinish} onPointerDown={(event) => event.stopPropagation()}>完成</button>
        </div>
      </div>
      <div className="sheet-body">{children}</div>
      <div ref={probeRef} className="safe-probe" aria-hidden="true" />
    </div>
  )
}
