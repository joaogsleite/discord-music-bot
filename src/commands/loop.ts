import * as queueService from 'services/queue'
import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/loop')

export async function handler(message: Message) {
  const repeat = queueService.getLoop()
  if (repeat) {
    queueService.setLoop(false)
    message.reply('Loop disabled')
  } else {
    queueService.setLoop(true)
    message.reply('Loop enabled')
  } 
}