import * as queueService from 'services/queue'
import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/random')

export async function handler(message: Message) {
  const random = queueService.getRandom()
  if (random) {
    queueService.setRandom(false)
    message.reply('Random queue order disabled')
  } else {
    queueService.setRandom(true)
    message.reply('Random queue order enabled')
  } 
}