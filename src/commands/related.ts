import { Log } from 'services/log'
import * as player from 'services/player'
import { Message } from 'discord.js'

const log = Log('commands/related')

export async function handler(message: Message) {
  if (player.getRelated()) {
    player.setRelated(false)
    message.reply('Related videos disabled')
    log('enabled')
  } else {
    player.setRelated(true)
    message.reply('Related videos enabled')
    log('disabled')
  }
}