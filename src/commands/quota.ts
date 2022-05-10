import { setQuota } from 'services/quota'
import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/quota')

export async function handler(message: Message, text: string) {
  log('menstions', message.mentions.users.keys())
  const userId = message.mentions.users.first()?.id || message.author.id
  text = text.replace(/<[^>]*>/g, '');
  const quota = Number(text.replace(/\D/g, ''))
  setQuota(userId, quota)

  message.react('👍')

  log(`set quota=${quota} for user ${userId}`)
}