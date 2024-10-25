interface LyricLine {
  time: number
  text: string
  isHighlight: boolean
  toneText?: string
  toneText2?: string
}

interface SongDetail {
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

const response = await fetch('https://wx-static.ddiu.site/dataset/mayday.json')
const json = (await response.json()) as SongDetail[]
const allSongs = json.filter((song) => !song.title.match(/^\d+\./))
// key：歌曲名，value：单词数组，按出现次数排序
const wordMap: Record<string, string[]> = {}
for (const song of allSongs) {
  const lyrics = song.detail.map((line) => line.text)
  // 把歌词中的所有单词都添加到 wordMap[song.title] 中 并根据次数排序
  const wordCount: Record<string, number> = {}
  for (const lyric of lyrics) {
    const words = lyric.split(' ')
    for (const word of words) {
      if (!word) continue
      if (word.length < 2) continue
      wordCount[word] = (wordCount[word] || 0) + 1
    }
  }
  wordMap[song.title] = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .map((item) => item[0])
}

const outputDir = `${import.meta.dir}/wordMap.json`
await Bun.write(outputDir, JSON.stringify(wordMap, null, 2))
