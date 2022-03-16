import { Log } from 'services/log'
import * as player from 'services/player'
import { Message } from 'discord.js'

const log = Log('commands/repeat')

export async function handler(message: Message) {
  if (player.getRepeat()) {
    player.setRepeat(false)
    message.reply('Repeat disabled')
    log('enabled')
  } else {
    player.setRepeat(true)
    message.reply('Repeat enabled')
    log('disabled')
  }
}