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
  await sleep(1000)
  await page.evaluate(() => {
    Array.from(document.getElementsByTagName('a')).forEach((a) => {
      const text = a.innerHTML.toLowerCase()
      if(text.includes('agree') || text.includes('accept') || text.includes('allow')) {
        a.click()
      }
    })
    Array.from(document.getElementsByTagName('button')).forEach((a) => {
      const text = a.innerHTML.toLowerCase()
      if(text.includes('agree') || text.includes('accept') || text.includes('allow')) {
        a.click()
      }
    })
  })
}

export async function clickPlay(page: Page) {
  await sleep(1000)
  await page.evaluate(() => {
    const videoElem = document.getElementsByTagName('video')[0] as HTMLVideoElement
    if (videoElem && videoElem.paused) {
      videoElem.play()
    }
  })
}
