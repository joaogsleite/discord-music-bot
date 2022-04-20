import { createAudioResource } from '@discordjs/voice'
import { Page } from 'puppeteer'
import { getStream } from 'puppeteer-stream'
import { Readable } from 'stream'
import { sleep } from './sleep'

export async function createAudioResourceFromPage(page: Page) {
  const stream = await getStream(page, { audio: true, video: false }) as unknown as Readable
  return createAudioResource(stream)
}

export function getAudioElementFromPage(page: Page) {
  return page.evaluate(() => {
    while (true) {
      const audios = document.getElementsByTagName('audio')
      const videos = document.getElementsByTagName('video')
      if (audios[0]) {
        return audios[audios.length - 1]
      } else if (videos[0]) {
        return videos[videos.length - 1]
      }
    }
  })
}

export async function acceptCookies(page: Page) {
  const MATCH = ['youtube.com', 'instagram.com', 'soundcloud.com']
  if (!MATCH.some((match => page.url().includes(match)))) return
  await sleep(1000)
  await page.evaluate(() => {
    (Array.from(document.getElementsByTagName('a')) as HTMLElement[]).concat(
      Array.from(document.getElementsByTagName('button'))
    ).forEach((elem) => {
      const text = elem.innerText.toLowerCase();
      if (['i agree'].some((term) => {
        return new RegExp(`\\b${term}\\b`, 'g').test(text)
      })) {
        elem.click()
      }
    })
  })
}

export async function clickPlay(page: Page) {
  await sleep(1000)
  await page.evaluate(() => {
    const videos = document.getElementsByTagName('video')
    const videoElem = videos[videos.length - 1] as HTMLVideoElement
    if (videoElem && videoElem.paused) {
      videoElem.play()
    }
  })
}
