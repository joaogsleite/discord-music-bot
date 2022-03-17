import * as queueService from 'services/queue'
import * as voiceService from 'services/voice'
import * as player from 'services/player'
import * as metadata from 'services/metadata'
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
    await player.play(item)
    message.reply(`Playing **${item.title}**`)
    log('from queue', item)
  } else if (player.getRelated()) {
    const playing = player.getPlaying()
    if (playing) {
      message.channel.sendTyping()
      const items = await metadata.related(playing)
      if (items[0]) {
        await player.play(items[0])
        message.reply(`Playing **${items[0].title}**`)
      } else {
        message.reply(`Error getting related videos for **${playing.title}**`)
      }
    }
  } else {
    message.reply('Queue is already empty')
  }
}