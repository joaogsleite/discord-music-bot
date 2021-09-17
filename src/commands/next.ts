import * as queueService from 'services/queue'
import * as voiceService from 'services/voice'
import * as player from 'services/player'
import { Log } from 'services/log'
import { Message } from 'discord.js'
import { getMemberVoiceChannel } from 'utils/discord'

const log = Log('commands/next')

export async function handler(message: Message) {
  const voiceChannel = getMemberVoiceChannel(message.member)
  if (!voiceChannel) {
    message.reply('Please join a voice channel')
    return
  }

  try {
    voiceService.join(voiceChannel)
  } catch (error) {
    log('error joining', error)
    message.reply('Error joining the voice channel')
    return
  }
  
  const item = queueService.dequeue()
  if (item) {
    player.play(item)
    message.reply(`Playing: **${item.title}**`)
    log('from queue', item)
  } else {
    message.reply('Queue is already empty')
  }
}