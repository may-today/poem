import type { CSSProperties } from 'react'

/** 由词片 id 决定的固定小倾角，让纸条看起来像手工贴上去的。 */
export function tiltFor(id: string, range = 1.6): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) | 0
  const unit = ((hash >>> 0) % 1000) / 1000
  return Number(((unit * 2 - 1) * range).toFixed(2))
}

export const tileStyle = (id: string, index = 0, range?: number): CSSProperties =>
  ({ '--tilt': `${tiltFor(id, range)}deg`, '--i': index } as CSSProperties)
