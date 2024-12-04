export interface LyricLine {
  time: number
  text: string
  isHighlight: boolean
  toneText?: string
  toneText2?: string
}

export interface SongDetail {
  title: string
  slug: string
  meta: {
    year?: number
    album?: string
    lyricist?: string
    composer?: string
    banlam: boolean
    length?: number
  }
  detail: LyricLine[]
}
