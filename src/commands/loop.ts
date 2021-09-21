import { Log } from 'services/log'
import * as player from 'services/player'
import { Message } from 'discord.js'

const log = Log('commands/loop')

export async function handler(message: Message) {
  if (player.getLoop()) {
    player.setLoop(false)
    message.reply('Loop disabled')
    log('enabled')
  } else {
    player.setLoop(true)
    message.reply('Loop enabled')
    log('disabled')
  }
}