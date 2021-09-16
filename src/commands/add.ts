import * as queueService from 'services/queue'
import * as youtube from 'services/youtube'
import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/add')

export async function handler(message: Message, query: string) {
  message.channel.sendTyping()
  const item = await youtube.query(query)
  if (!item) {
    message.reply('Youtube video not found')
    return
  }
  queueService.enqueue(item)
  message.reply(`Added to queue: **${item.title}**`)
  log('added to queue', item)
}