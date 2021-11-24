import * as ytdl from 'ytdl-core'
import ytpl from 'ytpl'
import ytsr from 'ytsr'
import { Log } from './log'

const log = Log('services/youtube')

export interface IPlayItem {
  title: string
  url: string
}

export async function query(value: string) {
  log('query', query)
  try {
    if (value.includes('youtube.com/') || value.includes('youtu.be/')) {
      return await getInfoFromUrl(value)
    } else {
      return await search(value)
    }
  } catch (error){
    log('error', error)
    return undefined
  }
}

export function createStream(url: string) {
  log('creating stream for url', url)
  const stream = ytdl.default(url, { 
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
  })
  log('created stream', !!stream)
  return stream
}

async function getInfoFromUrl(url: string): Promise<IPlayItem | IPlayItem[] | undefined> {
  log('get info', url)
  if (url.includes('list=')) {
    const playlist = await ytpl(url)
    return playlist.items.map((video) => ({
      title: video.title,
      url: video.shortUrl
    }))

  } else {
    const info = await ytdl.getInfo(url)
    if (info) {
      return {
        title: info.videoDetails.title,
        url: info.videoDetails.video_url,
      }
    }
  }
  
}

export async function related(original: IPlayItem): Promise<IPlayItem[]> {
  const filters = await ytsr.getFilters(original.url)
  const filter = filters.get('Type')?.get('Video')
  if (!filter || !filter.url) {
    return []
  }
  const result = await ytsr(filter.url) as any
  if (result && result.items && result.items[1]) {
    let items: Record<string, any>[]
    if (result.items[1].items && Array.isArray(result.items[1].items)) {
      items = result.items[1].items
    } else {
      items = result.items
    }
    return items.filter((item) => {
      return item.title && item.url && !original.url.includes(item.id)
    }).map((item) => ({
      title: item.title as string,
      url: item.url as string,
    }))
  }
  return []
}

async function search(query: string): Promise<IPlayItem | undefined> {
  log('search query', query)
  const filters = await ytsr.getFilters(query)
  const filter = filters.get('Type')?.get('Video')
  if (!filter || !filter.url) {
    throw 'error creating filter'
  }
  log('search filter', filter.url)
  const results = await ytsr(filter.url);
  const firstItem = results.items[0]
  if (firstItem.type === 'video') {
    const result = {
      title: firstItem.title,
      url: firstItem.url
    }
    log('search result', result)
    return result
  }
}
