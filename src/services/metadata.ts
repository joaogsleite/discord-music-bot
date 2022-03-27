import { Log } from './log'
import * as browser from './browser'

export interface IPlayItem {
  title: string
  url: string
}

const log = Log('services/metadata')

export async function query(value: string) {
  log('query', value)
  try {
    if (value.includes('http://') || value.includes('https://')) {
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
  if ((url.includes('youtube.com') || url.includes('youtu.be')) && url.includes('list=')) {
    if (url.includes('/watch')) {
      return await browser.scrapeFromPage(url, () => {
        const aElems = Array.from(document.getElementsByTagName('a')).filter((a, index, array) => {
          return !a.classList.contains('ytp-title-channel-name') && (a?.href || '').includes('index=') && index === array.findIndex((found) => {
            return (found?.href || '') === (a?.href || '')
          })
        })
        return aElems.map((aElem) => ({
          title: (aElem?.querySelector('#video-title') as HTMLSpanElement)?.innerText,
          url: aElem.href,
        }))
      })
    } else {
      return await browser.scrapeFromPage(url, () => {
        const aElems = Array.from(document.querySelectorAll('a#video-title')) as HTMLAnchorElement[]
        return aElems.map((aElem) => ({
          title: aElem.innerText,
          url: aElem.href,
        }))
      })
    }
  } else {
    const title = await browser.getPageTitle(url)
    return { title, url }
  }
}

async function search(query: string): Promise<IPlayItem | undefined> {
  log('search query', query)
  const searchQuery = query.split(' ').join('+')
  const url = `https://www.youtube.com/results?search_query=${searchQuery}`
  const result = await browser.scrapeFromPage(url, () => {
    const aElems = Array.from(document.querySelectorAll('a#video-title')) as HTMLAnchorElement[]
    return {
      title: aElems[0].innerText,
      url: aElems[0].href
    }
  })
  log('search result', result)
  return result
}