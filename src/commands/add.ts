import * as queueService from 'services/queue'
import * as youtube from 'services/youtube'
import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/add')

export async function handler(message: Message, query: string) {
  message.channel.sendTyping()

  const result = await youtube.query(query)
  if (!result) {
    message.reply('Youtube video not found')
    return
  }

  queueService.enqueue(result)

  if (Array.isArray(result)) {
    message.reply(`Added ${result.length} items to queue`)
  } else {
    message.reply(`Added to queue: **${result.title}**`)
  }

  log('added to queue', result)
}