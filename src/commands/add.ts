import * as queueService from 'services/queue'
import * as metadata from 'services/metadata'
import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/add')

export async function handler(message: Message, query: string) {
  message.channel.sendTyping()

  const result = await metadata.query(query)
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