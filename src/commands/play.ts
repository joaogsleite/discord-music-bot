import { Message } from "discord.js"
import * as player from 'services/player'
import * as connectionService from 'services/connection'
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
    const textChannel = message.channel
    connectionService.join(voiceChannel, textChannel)
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
  
  const videoInfo = await youtube.query(query)
  if (!videoInfo) {
    message.reply('Youtube video not found')
    return
  }

  player.play(videoInfo)
}