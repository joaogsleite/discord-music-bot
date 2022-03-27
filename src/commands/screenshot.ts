import { Log } from 'services/log'
import * as browser from 'services/browser'
import { Message } from 'discord.js'

const log = Log('commands/screenshot')

export async function handler(message: Message) {
  const file = await browser.screenshot()
  log('sending screenshot')
  if (file) {
    await message.reply({ files: [file] })
  } else {
    await message.reply('No browser tabs available.')
  }
}