import play from 'play-dl'
import SoundCloud from 'soundcloud-scraper'
import { Log } from './log'

export const soundcloud = new SoundCloud.Client();
export const youtube = play

const log = Log('services/stream')

export async function createStream(url: string) {
  log('creating stream for url', url)
  if (url.includes('soundcloud.com/')) {
    const song = await soundcloud.getSongInfo(url)
    return await song.downloadProgressive();
  } else {
    const { stream } = await play.stream(url, {
      discordPlayerCompatibility: true,
    })
    return stream
  }
}
