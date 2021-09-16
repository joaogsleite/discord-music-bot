import { Message } from "discord.js"
import * as voiceService from 'services/voice'
import * as youtube from 'services/youtube'
import { Log } from 'services/log'
import { getMemberVoiceChannel } from 'utils/discord'

const log = Log('commands/play')

export async function handler(message: Message, query: string) {
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
    message.reply('Usage: !play youtube link or search query')
    return
  }
  
  const videoInfo = await youtube.query(query)
  if (!videoInfo) {
    message.reply('Youtube video not found')
    return
  }

  try {
    voiceService.play(videoInfo.url)
  } catch (error) {
    log('error playing video', error)
    message.reply('Error playing the video')
    return
  }

  message.reply(`Playing **${videoInfo.title}**`)
}