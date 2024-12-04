import type { SongDetail } from './type'

const response = await fetch('https://wx-static.ddiu.site/dataset/mayday.json')
const json = (await response.json()) as SongDetail[]
const allSongs = json.filter((song) => !song.title.match(/^\d+\./))
const songSlugMap: Record<string, string> = {}
for (const song of allSongs) {
  songSlugMap[song.title] = song.slug
}

const outputDir = `${import.meta.dir}/songSlugMap.json`
await Bun.write(outputDir, JSON.stringify(songSlugMap, null, 2))
