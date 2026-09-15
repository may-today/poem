/**
 * 拼贴变体：由词片 id 推出一组固定的「手工感」参数，
 * 预览页（DOM）与导出图（canvas）共用同一套，保证所见即所得。
 * 字号与颜色保持统一，只让角度、错落和裁切边缘有变化。
 */

export type Slip = {
  /** 倾角（度） */
  tilt: number
  /** 基线错落，单位为字号的倍数 */
  shift: number
  /** 词片右侧的间隙，单位为字号的倍数 */
  gap: number
  /** 四角的裁切抖动（-1..1），画出手剪的毛边 */
  edge: [number, number, number, number]
}

/** 统一的纸色与墨色 */
export const SLIP_PAPER = '#fffdf8'
export const SLIP_INK = '#1c2126'

function hashOf(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return hash >>> 0 || 1
}

/** xorshift：从同一个 id 里取出互不相关的几个随机量 */
function sequence(seed: number) {
  let state = seed
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return ((state >>> 0) % 100000) / 100000
  }
}

export function slipFor(id: string): Slip {
  const next = sequence(hashOf(id))
  const tilt = Number(((next() * 2 - 1) * 1.8).toFixed(2))
  const shift = Number(((next() * 2 - 1) * 0.06).toFixed(3))
  const gap = Number((0.14 + next() * 0.1).toFixed(3))
  const edge: [number, number, number, number] = [next() * 2 - 1, next() * 2 - 1, next() * 2 - 1, next() * 2 - 1]
  return { tilt, shift, gap, edge }
}
