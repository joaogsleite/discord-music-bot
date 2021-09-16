import * as queueService from 'services/queue'
import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/clear')

export async function handler(message: Message) {
  queueService.clear()
  message.reply('Queue clear')
}