import { Log } from 'services/log'
import { Message } from 'discord.js'
import * as queueService from 'services/queue'

const log = Log('commands/queue')

export async function handler(message: Message) {
  const list = queueService.list()
  let text = '**Queue:**\n'
  if (list.length) {
    list.filter((_,index) => {
      return index < 10
    }).forEach((item, index) => {
      text += `${index+1}: ${item.title}\n`
    })
    if (list.length >= 10) {
      text += '...'
    }
  } else {
    text += '*(empty)*'
  }
  log('queue', list)
  message.reply(text)
}