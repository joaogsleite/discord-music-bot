import * as ytdl from 'ytdl-core'
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
  const stream = ytdl.default(url, { quality: 'highestaudio' })
  log('created stream', !!stream)
  return stream
}

async function getInfoFromUrl(url: string): Promise<IPlayItem | undefined> {
  log('get info', url)
  const info = await ytdl.getInfo(url)
  if (info) {
    return {
      title: info.videoDetails.title,
      url: info.videoDetails.video_url,
    }
  }
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
