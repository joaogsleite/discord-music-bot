import { Message } from "discord.js"
import * as player from 'services/player'
import * as voiceService from 'services/voice'
import * as queueService from 'services/queue'
import * as metadata from 'services/metadata'
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
    await voiceService.join(voiceChannel)
  } catch (error) {
    log('error joining', error)
    message.reply('Error joining the voice channel')
    return
  }
  
  if (!query) {
    if (player.isPaused()) {
      await player.play()
      return
    }
    const item = queueService.dequeue()
    if (item) {
      await player.play(item)
      message.reply(`Playing **${item.title}**`)
      return
    }
    message.reply('Usage: !play youtube link or search query')
    return
  }
  
  const result = await metadata.query(query)
  if (!result) {
    message.reply('Youtube video not found')
    return
  }

  if (Array.isArray(result)) {
    const item = result.shift()
    if (!item) {
      message.reply('Youtube video not found')
      return
    }
    await player.play(item)
    queueService.enqueue(result)
    message.reply(`Added ${result.length} items to queue and playing **${item.title}**`)
    return
  }

  await player.play(result)
  message.reply(`Playing **${result.title}**`)
}