import { Message } from "discord.js"
import * as player from 'services/player'
import * as voiceService from 'services/voice'
import * as queueService from 'services/queue'
import * as youtube from 'services/youtube'
import { Log } from 'services/log'
import { getMemberVoiceChannel } from 'utils/discord'

const log = Log('commands/play')

export async function handler(message: Message, query: string) {
  message.channel.sendTyping()
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
  
  if (!query) {
    if (player.isPaused()) {
      player.play()
      return
    }
    const item = queueService.dequeue()
    if (item) {
      player.play(item)
      message.reply(`Playing: **${item.title}**`)
      return
    }
    message.reply('Usage: !play youtube link or search query')
    return
  }
  
  const item = await youtube.query(query)
  if (!item) {
    message.reply('Youtube video not found')
    return
  }

  player.play(item)
  message.reply(`Playing: **${item.title}**`)
}