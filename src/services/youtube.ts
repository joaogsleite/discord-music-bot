import * as ytdl from 'ytdl-core'
import ytsr from 'ytsr'

export async function query(value: string) {
  try {
    if (value.includes('youtube.com/') || value.includes('youtu.be/')) {
      return await getInfoFromUrl(value)
    } else {
      return await search(value)
    }
  } catch (error){
    console.error(error)
    return undefined
  }
}

export function createStream(url: string) {
  return ytdl.default(url)
}

async function getInfoFromUrl(url: string) {
  const info = await ytdl.getInfo(url)
  return {
    title: info.videoDetails.title,
    url: info.videoDetails.video_url,
  } 
}

async function search(query: string) {
  const filters = await ytsr.getFilters(query)
  const filter = filters.get('Type')?.get('Video')
  if (!filter || !filter.url) {
    throw 'error creating filter'
  }
  const results = await ytsr(filter.url);
  const firstItem = results.items[0]
  if (firstItem.type === 'video') {
    return {
      title: firstItem.title,
      url: firstItem.url
    }
  }
}