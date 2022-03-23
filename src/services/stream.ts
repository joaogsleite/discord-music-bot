import { IncomingMessage } from 'http'
import { Readable } from 'stream'
import play from 'play-dl'
import SoundCloud from 'soundcloud-scraper'
import { Log } from './log'
import { sleep } from 'utils/sleep'

export const soundcloud = new SoundCloud.Client()
export const youtube = play

const log = Log('services/stream')

let stream: Readable

export async function createStream(url: string) {
  log('creating stream for url', url)
  if (stream && !stream.destroyed) {
    stream.destroy()
    await sleep(1000)
  }
  if (url.includes('soundcloud.com/')) {
    const song = await soundcloud.getSongInfo(url)
    const soundcloudStream = await song.downloadProgressive();
    stream = soundcloudStream
  } else {
    const youtubeStream = await play.stream(url, {
      discordPlayerCompatibility: true,
    })
    stream = youtubeStream.stream
    return stream
  }
  const funcs = stream.listeners('error') as Array<() => void>
  funcs.forEach((func) => {
    stream.removeListener('error', func)
  })
  stream.on('error', (error) => {
    log('stream error', error)
    stream.destroy()
  })
  return stream
}
