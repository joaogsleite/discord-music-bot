import { launch } from 'puppeteer-stream'
import { Browser } from 'puppeteer'
import { Log } from './log'
import { acceptCookies, clickPlay } from 'utils/browser'
import { sleep } from 'utils/sleep'

const log = Log('services/browser')

let browser: Browser
const UBLOCK_EXT = '/usr/src/app/uBlock0.chromium'

async function reOpenBrowser() {
  await killBrowser(browser)
  browser = await openBrowser()
}
async function killBrowser(browser: Browser) {
  if (!browser) return
  const pages = await browser.pages()
  await Promise.all(pages.map((page) => page.close()))
  await browser.close()
}
async function openBrowser() {
  const browser = await launch({
    //executablePath: '/usr/bin/brave-browser',
    //userDataDir: `/tmp/brave-browser-${Date.now()}`,
    ignoreDefaultArgs: [
      '--disable-extensions'
    ],
    args: [
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      `--load-extension=${UBLOCK_EXT}`
    ]
  })
  const newPage = await browser.newPage()
  const pages = await browser.pages()
  for(const page of pages) {
    if (page !== newPage) {
      await page.close()
    }
  }
  return browser
}

export async function newPage(url: string) {
  await reOpenBrowser()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })
  await acceptCookies(page)
  await clickPlay(page)
  return page
}

export async function scrapeFromPage<T>(url: string, evaluate: () => Promise<T> | T) {
  const browser = await openBrowser()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'load' })
  await acceptCookies(page)
  const result = await page.evaluate<() => Promise<T> | T>(evaluate)
  await sleep(1000)
  await page.close()
  await killBrowser(browser)
  return result
}

export async function getPageTitle(url: string) {
  const browser = await openBrowser()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'load' })
  const title = await page.title()
  await killBrowser(browser)
  return title
}

export async function screenshot() {
  const pages = await browser.pages()
  const page = pages[pages.length - 1]
  if (page) {
    return await page.screenshot()
  }
}