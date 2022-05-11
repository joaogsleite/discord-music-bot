import { generatePlays } from 'services/quota'
import { Log } from 'services/log'
import { Message } from 'discord.js'

const log = Log('commands/quotas')

export async function handler(message: Message, text: string) {
  message.channel.sendTyping()
  const plays = generatePlays()
  if (plays.length > 0) {
    message.reply(plays.map((play) => {
        return `${play.value}: ${play.players.map((userId) => {
          return `<@${userId}>`
        }).join(' => ')}`
      }).join('\n')
    )
  } else {
    message.reply('No sufficient players or quota')
  }
}