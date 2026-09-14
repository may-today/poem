import { useEffect, type RefObject } from 'react'

const SPEED = 26 // px / s
const IDLE_AFTER_TOUCH = 1600 // ms

/**
 * 让横向滚动容器像跑马灯一样缓缓自动滚动。
 * 容器内需要放两份相同内容（两个子元素），滚到第二份开头时回到起点，形成无缝循环。
 * 手指按住、滚轮、拖动或键盘焦点在其中时暂停，松开一会儿后继续；尊重 prefers-reduced-motion。
 * 故意不因鼠标悬停暂停：点完一个词片后指针往往还停在原地，会让人以为它坏了。
 */
export function useMarquee(ref: RefObject<HTMLElement>, enabled: boolean) {
  useEffect(() => {
    const element = ref.current
    if (!enabled || !element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let last = 0
    let held = false
    let idleUntil = 0
    let carry = 0 // 累积不足 1px 的位移，避免小数 scrollLeft 被丢弃

    const loopWidth = () => {
      const second = element.children[1] as HTMLElement | undefined
      return second ? second.offsetLeft - (element.children[0] as HTMLElement).offsetLeft : 0
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = last ? Math.min(64, now - last) : 0
      last = now
      // 焦点在容器内（键盘操作）时暂停；被点过的词片会被禁用并隐藏、焦点自动落回 body，所以这里动态判断而不监听 focusin/out
      const focused = document.activeElement as HTMLButtonElement | null
      const focusInside = !!focused && element.contains(focused) && !focused.disabled
      if (held || now < idleUntil || focusInside) return
      const width = loopWidth()
      if (!width || width <= element.clientWidth * 0.9) return
      carry += (SPEED * dt) / 1000
      const step = Math.floor(carry)
      if (!step) return
      carry -= step
      let next = element.scrollLeft + step
      if (next >= width) next -= width
      element.scrollLeft = next
    }

    const pause = () => { held = true }
    const release = () => { held = false; idleUntil = performance.now() + IDLE_AFTER_TOUCH }
    const wheel = () => { idleUntil = performance.now() + IDLE_AFTER_TOUCH }

    element.addEventListener('pointerdown', pause)
    element.addEventListener('pointerup', release)
    element.addEventListener('pointercancel', release)
    element.addEventListener('touchstart', pause, { passive: true })
    element.addEventListener('touchend', release)
    element.addEventListener('touchcancel', release)
    element.addEventListener('wheel', wheel, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointerdown', pause)
      element.removeEventListener('pointerup', release)
      element.removeEventListener('pointercancel', release)
      element.removeEventListener('touchstart', pause)
      element.removeEventListener('touchend', release)
      element.removeEventListener('touchcancel', release)
      element.removeEventListener('wheel', wheel)
    }
  }, [ref, enabled])
}
