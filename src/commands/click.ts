import * as browserService from 'services/browser'
import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/click')

export async function handler(message: Message, query: string) {
  message.channel.sendTyping()
  const clicked = await browserService.runOnCurrentPage((query) => {
    const buttons = Array.from(document.getElementsByTagName('button')) as HTMLElement[]
    const links = Array.from(document.getElementsByTagName('a'))  as HTMLElement[]
    const toClick = buttons.concat(links).filter((elem) => {
      return elem.innerText.toLowerCase().includes(query.toLowerCase())
    })
    toClick.forEach((elem) => {
      elem.click()
    })
    return toClick.map((elem) => {
      return elem.innerText
    })
  }, query)
  log('clicked', clicked)
  if (clicked?.length) {
    message.reply(`Clicked on ${'`' + clicked.join('`, `') + '`'}`)
  } else {
    message.reply('No buttons to click with that text!')
  }
}