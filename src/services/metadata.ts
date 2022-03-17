import { Log } from './log'
import { soundcloud, youtube } from './stream'

export interface IPlayItem {
  title: string
  url: string
}

const log = Log('services/metadata')

export async function query(value: string) {
  log('query', query)
  try {
    if (value.includes('youtube.com/') || value.includes('youtu.be/') || value.includes('soundcloud.com/')) {
      return await getInfoFromUrl(value)
    } else {
      return await search(value)
    }
  } catch (error){
    log('error', error)
    return undefined
  }
}

async function getInfoFromUrl(url: string): Promise<IPlayItem | IPlayItem[] | undefined> {
  log('get info', url)
  if (url.includes('list=')) {
    const playlist = await youtube.playlist_info(url)
    const videos = await playlist.all_videos()
    return videos.map((video) => ({
      title: video.title || video.url,
      url: video.url
    }))
  } else if (url.includes('soundcloud.com/')) {
    const item = await soundcloud.getSongInfo(url)
    return {
      title: item.title,
      url: item.url
    }
  } else {
    const info = await youtube.video_basic_info(url)
    log('info', info)
    if (info) {
      return {
        title: info.video_details.title || info.video_details.url,
        url: info.video_details.url,
      }
    }
  }
}

export async function related(original: IPlayItem): Promise<IPlayItem[]> {
  const item = await youtube.video_info(original.url)
  if (item) {
    return await Promise.all(
      item.related_videos.filter((_, index) => {
        return index < 10
      }).map((url) => {
        return getInfoFromUrl(url) as Promise<IPlayItem>
      })
    )
  } 
  return []
}

async function search(query: string): Promise<IPlayItem | undefined> {
  log('search query', query)
  const results = await youtube.search(query)
  const firstItem = results[0]
  if (firstItem.type === 'video') {
    const result = {
      title: firstItem.title || firstItem.url,
      url: firstItem.url
    }
    log('search result', result)
    return result
  }
}